import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PronunciationResult {
  word: string;
  similarityScore: number;
  feedback: string;
  color: 'green' | 'yellow' | 'orange' | 'red';
}

@Injectable({
  providedIn: 'root'
})
export class AudioAnalysisService {
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private recordingStream: MediaStream | null = null;
  
  recordingStatus$ = new BehaviorSubject<'idle' | 'recording' | 'analyzing' | 'complete'>('idle');
  audioLevel$ = new BehaviorSubject<number>(0);

  constructor() {}

  async initializeAudio(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  async startRecording(): Promise<void> {
    await this.initializeAudio();
    
    try {
      this.recordingStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.recordingStream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      // Monitor audio levels
      const source = this.audioContext!.createMediaStreamSource(this.recordingStream);
      const analyser = this.audioContext!.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const levelInterval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        this.audioLevel$.next(average);
      }, 100);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.onstop = () => {
        clearInterval(levelInterval);
        this.audioLevel$.next(0);
      };
      
      this.mediaRecorder.start();
      this.recordingStatus$.next('recording');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Microphone access denied or not available');
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }
      
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        
        // Stop all tracks
        if (this.recordingStream) {
          this.recordingStream.getTracks().forEach(track => track.stop());
          this.recordingStream = null;
        }
        
        this.mediaRecorder = null;
        resolve(audioBlob);
      };
      
      this.mediaRecorder.stop();
    });
  }

  async analyzePronunciation(
    referenceAudioUrl: string, 
    userAudioBlob: Blob
  ): Promise<PronunciationResult> {
    this.recordingStatus$.next('analyzing');
    
    try {
      await this.initializeAudio();
      
      // Load reference audio
      const referenceBuffer = await this.loadAudioFromUrl(referenceAudioUrl);
      
      // Load user audio
      const userBuffer = await this.loadAudioFromBlob(userAudioBlob);
      
      // Extract features (simplified MFCC-like features using Web Audio API)
      const refFeatures = this.extractAudioFeatures(referenceBuffer);
      const userFeatures = this.extractAudioFeatures(userBuffer);
      
      // Normalize features for comparison
      const normalizedRef = this.normalizeFeatures(refFeatures);
      const normalizedUser = this.normalizeFeatures(userFeatures);
      
      // Calculate DTW-like distance
      const distance = this.calculateDTWDistance(normalizedRef, normalizedUser);
      
      // Convert to similarity score (0-100)
      const similarityScore = this.distanceToScore(distance);
      
      // Generate feedback
      const result = this.generateFeedback(similarityScore);
      
      this.recordingStatus$.next('complete');
      return result;
      
    } catch (error) {
      console.error('Analysis error:', error);
      this.recordingStatus$.next('idle');
      throw error;
    }
  }

  private async loadAudioFromUrl(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.audioContext!.decodeAudioData(arrayBuffer);
  }

  private async loadAudioFromBlob(blob: Blob): Promise<AudioBuffer> {
    const arrayBuffer = await blob.arrayBuffer();
    return await this.audioContext!.decodeAudioData(arrayBuffer);
  }

  private extractAudioFeatures(buffer: AudioBuffer): Float32Array[] {
    const features: Float32Array[] = [];
    const channelData = buffer.getChannelData(0);
    
    // Frame-based feature extraction (simulating MFCC)
    const frameSize = 512;
    const hopSize = 256;
    const numFrames = Math.floor((channelData.length - frameSize) / hopSize) + 1;
    
    for (let i = 0; i < numFrames; i++) {
      const frameStart = i * hopSize;
      const frame = channelData.slice(frameStart, frameStart + frameSize);
      
      // Extract features for this frame
      const frameFeatures = this.extractFrameFeatures(frame);
      features.push(frameFeatures);
    }
    
    return features;
  }

  private extractFrameFeatures(frame: Float32Array): Float32Array {
    const features = new Float32Array(13); // 13 features like MFCC
    
    // 1. Energy (RMS)
    features[0] = Math.sqrt(frame.reduce((sum, val) => sum + val * val, 0) / frame.length);
    
    // 2-5. Spectral centroid spread (simplified frequency features)
    const spectrum = this.computeSpectrum(frame);
    features[1] = this.computeSpectralCentroid(spectrum);
    features[2] = this.computeSpectralSpread(spectrum, features[1]);
    features[3] = this.computeSpectralRolloff(spectrum);
    features[4] = this.computeSpectralFlux(spectrum);
    
    // 6-9. Formant-like features (frequency bands energy)
    const bands = this.computeFrequencyBands(frame);
    features[5] = bands[0];  // Low band (0-500 Hz)
    features[6] = bands[1];  // Mid-low band (500-1500 Hz)
    features[7] = bands[2];  // Mid-high band (1500-3000 Hz)
    features[8] = bands[3];  // High band (3000-8000 Hz)
    
    // 10-13. Zero-crossing rate and variations
    features[9] = this.computeZeroCrossingRate(frame);
    features[10] = this.computePitchEstimate(frame);
    features[11] = this.computeSpectralEntropy(spectrum);
    features[12] = this.computeHarmonicRatio(frame);
    
    return features;
  }

  private computeSpectrum(frame: Float32Array): Float32Array {
    // Simple FFT implementation using correlation
    const spectrum = new Float32Array(128);
    for (let k = 0; k < 128; k++) {
      let real = 0;
      let imag = 0;
      const frequency = (2 * Math.PI * k) / frame.length;
      
      for (let n = 0; n < frame.length; n++) {
        real += frame[n] * Math.cos(frequency * n);
        imag -= frame[n] * Math.sin(frequency * n);
      }
      
      spectrum[k] = Math.sqrt(real * real + imag * imag);
    }
    
    return spectrum;
  }

  private computeSpectralCentroid(spectrum: Float32Array): number {
    let weightedSum = 0;
    let sum = 0;
    
    for (let i = 0; i < spectrum.length; i++) {
      weightedSum += i * spectrum[i];
      sum += spectrum[i];
    }
    
    return sum > 0 ? weightedSum / sum : 0;
  }

  private computeSpectralSpread(spectrum: Float32Array, centroid: number): number {
    let variance = 0;
    let sum = 0;
    
    for (let i = 0; i < spectrum.length; i++) {
      variance += Math.pow(i - centroid, 2) * spectrum[i];
      sum += spectrum[i];
    }
    
    return sum > 0 ? Math.sqrt(variance / sum) : 0;
  }

  private computeSpectralRolloff(spectrum: Float32Array, threshold: number = 0.85): number {
    const total = spectrum.reduce((a, b) => a + b, 0);
    let cumulative = 0;
    
    for (let i = 0; i < spectrum.length; i++) {
      cumulative += spectrum[i];
      if (cumulative >= total * threshold) {
        return i / spectrum.length;
      }
    }
    
    return 1;
  }

  private computeSpectralFlux(spectrum: Float32Array): number {
    // Simplified spectral flux
    let flux = 0;
    for (let i = 0; i < spectrum.length; i++) {
      flux += Math.abs(spectrum[i]);
    }
    return flux / spectrum.length;
  }

  private computeFrequencyBands(frame: Float32Array): Float32Array {
    const bands = new Float32Array(4);
    const sampleRate = 16000;
    const spectrum = this.computeSpectrum(frame);
    
    // Map FFT bins to frequency bands
    const binFreq = sampleRate / frame.length;
    
    for (let i = 0; i < spectrum.length; i++) {
      const freq = i * binFreq;
      const magnitude = spectrum[i];
      
      if (freq < 500) {
        bands[0] += magnitude;
      } else if (freq < 1500) {
        bands[1] += magnitude;
      } else if (freq < 3000) {
        bands[2] += magnitude;
      } else {
        bands[3] += magnitude;
      }
    }
    
    return bands;
  }

  private computeZeroCrossingRate(frame: Float32Array): number {
    let crossings = 0;
    
    for (let i = 1; i < frame.length; i++) {
      if (frame[i] * frame[i - 1] < 0) {
        crossings++;
      }
    }
    
    return crossings / frame.length;
  }

  private computePitchEstimate(frame: Float32Array): number {
    // Autocorrelation-based pitch estimation
    const minLag = Math.floor(16000 / 400); // 400 Hz max
    const maxLag = Math.floor(16000 / 80);  // 80 Hz min
    
    let maxCorrelation = -Infinity;
    let bestLag = minLag;
    
    for (let lag = minLag; lag <= maxLag; lag++) {
      let correlation = 0;
      for (let i = 0; i < frame.length - lag; i++) {
        correlation += frame[i] * frame[i + lag];
      }
      
      if (correlation > maxCorrelation) {
        maxCorrelation = correlation;
        bestLag = lag;
      }
    }
    
    return maxCorrelation > 0 ? 16000 / bestLag : 0;
  }

  private computeSpectralEntropy(spectrum: Float32Array): number {
    const sum = spectrum.reduce((a, b) => a + b, 0);
    if (sum === 0) return 0;
    
    let entropy = 0;
    for (let i = 0; i < spectrum.length; i++) {
      const prob = spectrum[i] / sum;
      if (prob > 0) {
        entropy -= prob * Math.log2(prob);
      }
    }
    
    return entropy;
  }

  private computeHarmonicRatio(frame: Float32Array): number {
    // Simplified harmonic ratio calculation
    const spectrum = this.computeSpectrum(frame);
    const peaks = this.findPeaks(spectrum);
    
    if (peaks.length < 2) return 0;
    
    // Check if peaks are harmonically related
    const fundamental = peaks[0];
    let harmonicCount = 0;
    
    for (let i = 1; i < peaks.length; i++) {
      const ratio = peaks[i] / fundamental;
      if (Math.abs(ratio - Math.round(ratio)) < 0.1) {
        harmonicCount++;
      }
    }
    
    return harmonicCount / (peaks.length - 1);
  }

  private findPeaks(spectrum: Float32Array): number[] {
    const peaks: number[] = [];
    
    for (let i = 1; i < spectrum.length - 1; i++) {
      if (spectrum[i] > spectrum[i - 1] && spectrum[i] > spectrum[i + 1]) {
        if (spectrum[i] > 0.1) { // Minimum peak threshold
          peaks.push(i);
        }
      }
    }
    
    return peaks;
  }

  private normalizeFeatures(features: Float32Array[]): number[][] {
    const normalized: number[][] = [];
    const numFrames = features.length;
    const numFeatures = features[0].length;
    
    // Calculate mean and std for each feature
    const means = new Float32Array(numFeatures);
    const stds = new Float32Array(numFeatures);
    
    for (let i = 0; i < numFrames; i++) {
      for (let j = 0; j < numFeatures; j++) {
        means[j] += features[i][j];
      }
    }
    
    for (let j = 0; j < numFeatures; j++) {
      means[j] /= numFrames;
    }
    
    for (let i = 0; i < numFrames; i++) {
      for (let j = 0; j < numFeatures; j++) {
        stds[j] += Math.pow(features[i][j] - means[j], 2);
      }
    }
    
    for (let j = 0; j < numFeatures; j++) {
      stds[j] = Math.sqrt(stds[j] / numFrames) || 1;
    }
    
    // Normalize
    for (let i = 0; i < numFrames; i++) {
      const normalizedFrame = [];
      for (let j = 0; j < numFeatures; j++) {
        normalizedFrame.push((features[i][j] - means[j]) / stds[j]);
      }
      normalized.push(normalizedFrame);
    }
    
    return normalized;
  }

  private calculateDTWDistance(ref: number[][], user: number[][]): number {
    const n = ref.length;
    const m = user.length;
    
    // Create DTW matrix
    const dtw: number[][] = Array(n + 1).fill(null).map(() => 
      Array(m + 1).fill(Infinity)
    );
    dtw[0][0] = 0;
    
    // Fill DTW matrix
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const cost = this.euclideanDistance(ref[i - 1], user[j - 1]);
        dtw[i][j] = cost + Math.min(
          dtw[i - 1][j],     // insertion
          dtw[i][j - 1],     // deletion
          dtw[i - 1][j - 1]  // match
        );
      }
    }
    
    return dtw[n][m];
  }

  private euclideanDistance(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
  }

  private distanceToScore(distance: number): number {
    // Convert DTW distance to 0-100 similarity score
    const maxDistance = 500; // Threshold for 0% similarity
    const score = Math.max(0, 100 - (distance / maxDistance) * 100);
    return Math.round(score);
  }

  private generateFeedback(score: number): PronunciationResult {
    let feedback: string;
    let color: 'green' | 'yellow' | 'orange' | 'red';

    if (score >= 85) {
      feedback = 'Excellent pronunciation! Very close to native speaker.';
      color = 'green';
    } else if (score >= 70) {
      feedback = 'Good job! Your pronunciation is quite clear.';
      color = 'green';
    } else if (score >= 55) {
      feedback = 'Fair attempt. Keep practicing the sounds.';
      color = 'yellow';
    } else if (score >= 40) {
      feedback = 'Needs improvement. Try to match the reference audio more closely.';
      color = 'orange';
    } else {
      feedback = 'Keep trying! Listen carefully to the reference and try again.';
      color = 'red';
    }

    return {
      word: '',
      similarityScore: score,
      feedback,
      color
    };
  }

  reset(): void {
    this.recordingStatus$.next('idle');
    this.audioLevel$.next(0);
    this.recordedChunks = [];
    
    if (this.recordingStream) {
      this.recordingStream.getTracks().forEach(track => track.stop());
      this.recordingStream = null;
    }
    
    this.mediaRecorder = null;
  }

  ngOnDestroy(): void {
    this.reset();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}