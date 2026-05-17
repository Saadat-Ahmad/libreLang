import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioAnalysisService } from '../../services/pronunciation.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

interface PracticeWord {
  id: number;
  urdu: string;
  transliteration: string;
  english: string;
  audioUrl: string;
  completed: boolean;
  score?: number;
}

@Component({
  selector: 'app-pronunciation-practice',
  standalone: true,
  templateUrl: './practise-2.component.html',
  styleUrls: ['./practise-2.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pulseAnimation', [
      transition('* => *', [
        animate('0.3s ease-in-out', style({ transform: 'scale(1.05)' })),
        animate('0.3s ease-in-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class PronunciationPracticeComponent implements OnInit, OnDestroy {
  practiceWords: PracticeWord[] = [
    {
      id: 1,
      urdu: 'شکریہ',
      transliteration: 'Shukriya',
      english: 'Thank you',
      audioUrl: 'assets/audio/shukriya.mp3',
      completed: false
    },
    {
      id: 2,
      urdu: 'پانی',
      transliteration: 'Paani',
      english: 'Water',
      audioUrl: 'assets/audio/paani.mp3',
      completed: false
    },
    {
      id: 3,
      urdu: 'کتاب',
      transliteration: 'Kitaab',
      english: 'Book',
      audioUrl: 'assets/audio/kitaab.mp3',
      completed: false
    },
    {
      id: 4,
      urdu: 'گھر',
      transliteration: 'Ghar',
      english: 'House',
      audioUrl: 'assets/audio/ghar.mp3',
      completed: false
    },
    {
      id: 6,
      urdu: 'انار',
      transliteration: 'Anaar',
      english: 'Pomogranate',
      audioUrl: '../assets/anaar.mp3',
      completed: false
    }
  ];

  activeWord: PracticeWord | null = null;
  recordingStatus: 'idle' | 'recording' | 'analyzing' | 'complete' = 'idle';
  audioLevel: number = 0;
  currentResult: any | null = null;
  recordedAudioUrl: string | null = null;
  overallScore: number = 0;
  
  private subscriptions: Subscription[] = [];

  constructor(private audioAnalysisService: AudioAnalysisService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.audioAnalysisService.recordingStatus$.subscribe(status => {
        this.recordingStatus = status;
      }),
      this.audioAnalysisService.audioLevel$.subscribe(level => {
        this.audioLevel = level;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.recordedAudioUrl) {
      URL.revokeObjectURL(this.recordedAudioUrl);
    }
    this.audioAnalysisService.reset();
  }

  selectWord(word: PracticeWord): void {
    this.activeWord = word;
    this.currentResult = null;
    this.recordedAudioUrl = null;
    this.audioAnalysisService.reset();
    this.recordingStatus = 'idle';
    this.audioLevel = 0;
  }

  async playReferenceAudio(): Promise<void> {
    if (!this.activeWord) return;
    
    try {
      const audio = new Audio(this.activeWord.audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error playing reference audio:', error);
      // Fallback to TTS if audio file not found
      this.speakWord(this.activeWord.urdu);
    }
  }

  private speakWord(urdu: string): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(urdu);
      utterance.lang = 'ur-PK';
      utterance.rate = 0.7;
      utterance.pitch = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const urduVoice = voices.find(voice => 
        voice.lang.startsWith('ur') || 
        voice.name.toLowerCase().includes('urdu')
      );
      
      if (urduVoice) {
        utterance.voice = urduVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  }

  async startRecording(): Promise<void> {
    try {
      this.currentResult = null;
      
      // Revoke previous recording URL if exists
      if (this.recordedAudioUrl) {
        URL.revokeObjectURL(this.recordedAudioUrl);
        this.recordedAudioUrl = null;
      }
      
      await this.audioAnalysisService.startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Please allow microphone access to use this feature. Check your browser permissions.');
      this.audioAnalysisService.reset();
      this.recordingStatus = 'idle';
    }
  }

  async stopRecording(): Promise<void> {
    try {
      const audioBlob = await this.audioAnalysisService.stopRecording();
      
      // Create URL for playback
      if (this.recordedAudioUrl) {
        URL.revokeObjectURL(this.recordedAudioUrl);
      }
      this.recordedAudioUrl = URL.createObjectURL(audioBlob);
      
      // Analyze pronunciation if we have an active word
      if (this.activeWord) {
        const result = await this.audioAnalysisService.analyzePronunciation(
          this.activeWord.audioUrl,
          audioBlob
        );
        
        this.currentResult = result;
        this.currentResult.word = this.activeWord.urdu;
        
        // Update word completion status
        this.activeWord.score = result.similarityScore;
        this.activeWord.completed = true;
        this.updateOverallScore();
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      alert('An error occurred while analyzing your pronunciation. Please try again.');
      this.audioAnalysisService.reset();
      this.recordingStatus = 'idle';
    }
  }

  async playRecordedAudio(): Promise<void> {
    if (this.recordedAudioUrl) {
      try {
        const audio = new Audio(this.recordedAudioUrl);
        await audio.play();
      } catch (error) {
        console.error('Error playing recorded audio:', error);
      }
    }
  }

  selectNextWord(): void {
    if (!this.activeWord) return;
    
    const currentIndex = this.practiceWords.findIndex(w => w.id === this.activeWord!.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < this.practiceWords.length) {
      this.selectWord(this.practiceWords[nextIndex]);
    } else {
      // Loop back to first uncompleted word or first word
      const firstUncompleted = this.practiceWords.find(w => !w.completed);
      if (firstUncompleted) {
        this.selectWord(firstUncompleted);
      } else {
        this.selectWord(this.practiceWords[0]);
      }
    }
  }

  selectPreviousWord(): void {
    if (!this.activeWord) return;
    
    const currentIndex = this.practiceWords.findIndex(w => w.id === this.activeWord!.id);
    const prevIndex = currentIndex - 1;
    
    if (prevIndex >= 0) {
      this.selectWord(this.practiceWords[prevIndex]);
    } else {
      // Go to last word
      this.selectWord(this.practiceWords[this.practiceWords.length - 1]);
    }
  }

  private updateOverallScore(): void {
    const completed = this.practiceWords.filter(w => w.completed && w.score !== undefined);
    if (completed.length > 0) {
      const total = completed.reduce((sum, w) => sum + (w.score || 0), 0);
      this.overallScore = Math.round(total / completed.length);
    }
  }

  resetPractice(): void {
    // Reset current word practice state
    this.currentResult = null;
    
    if (this.recordedAudioUrl) {
      URL.revokeObjectURL(this.recordedAudioUrl);
      this.recordedAudioUrl = null;
    }
    
    this.audioAnalysisService.reset();
    this.recordingStatus = 'idle';
    this.audioLevel = 0;
  }

  resetAllWords(): void {
    // Reset all words to uncompleted state
    this.practiceWords.forEach(w => {
      w.completed = false;
      w.score = undefined;
    });
    
    this.overallScore = 0;
    this.resetPractice();
    this.activeWord = null;
  }

  get completedCount(): number {
    return this.practiceWords.filter(w => w.completed).length;
  }

  get totalWordsCount(): number {
    return this.practiceWords.length;
  }

  get progressPercentage(): number {
    if (this.totalWordsCount === 0) return 0;
    return Math.round((this.completedCount / this.totalWordsCount) * 100);
  }

  getFeedbackEmoji(score: number): string {
    if (score >= 90) return '🌟';
    if (score >= 75) return '👏';
    if (score >= 60) return '👍';
    if (score >= 45) return '📚';
    if (score >= 30) return '💪';
    return '🎯';
  }

  getFeedbackColor(score: number): string {
    if (score >= 75) return '#4caf50';
    if (score >= 60) return '#8bc34a';
    if (score >= 45) return '#ff9800';
    if (score >= 30) return '#ff5722';
    return '#f44336';
  }

  get hasCompletedAllWords(): boolean {
    return this.practiceWords.every(w => w.completed);
  }

  get bestWord(): PracticeWord | null {
    const completed = this.practiceWords.filter(w => w.completed && w.score !== undefined);
    if (completed.length === 0) return null;
    
    return completed.reduce((best, current) => 
      (current.score || 0) > (best.score || 0) ? current : best
    );
  }

  get worstWord(): PracticeWord | null {
    const completed = this.practiceWords.filter(w => w.completed && w.score !== undefined);
    if (completed.length === 0) return null;
    
    return completed.reduce((worst, current) => 
      (current.score || 100) < (worst.score || 100) ? current : worst
    );
  }

  // Helper method to check if a word is the currently active one
  isActiveWord(word: PracticeWord): boolean {
    return this.activeWord?.id === word.id;
  }

  // Helper to check if recording is in progress
  get isRecording(): boolean {
    return this.recordingStatus === 'recording';
  }

  // Helper to check if analysis is in progress
  get isAnalyzing(): boolean {
    return this.recordingStatus === 'analyzing';
  }

  // Helper to check if ready to record
  get canRecord(): boolean {
    return this.recordingStatus === 'idle' || this.recordingStatus === 'complete';
  }

  // Format score for display
  formatScore(score: number): string {
    return `${score}%`;
  }

  // Get message based on score
  getEncouragementMessage(score: number): string {
    if (score >= 90) return 'Perfect! You sound like a native speaker!';
    if (score >= 75) return 'Excellent work! Your pronunciation is very good.';
    if (score >= 60) return 'Good job! Keep practicing to improve further.';
    if (score >= 45) return 'Nice effort! Try to match the reference audio more closely.';
    if (score >= 30) return 'Keep going! Focus on the sounds and try again.';
    return 'Don\'t give up! Practice makes perfect.';
  }
}