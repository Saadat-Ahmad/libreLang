import librosa
import numpy as np
from scipy.spatial.distance import euclidean
from fastdtw import fastdtw

def compare_audio_dtw(reference_audio, user_audio):
    # Load and trim silence
    ref, sr = librosa.load(reference_audio, sr=16000)
    user, _ = librosa.load(user_audio, sr=16000)
    ref, _ = librosa.effects.trim(ref, top_db=20)
    user, _ = librosa.effects.trim(user, top_db=20)

    # Extract MFCCs + deltas
    def extract_features(y, sr):
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13).T
        delta = librosa.feature.delta(mfcc.T).T
        return np.concatenate([mfcc, delta], axis=1)

    ref_feat = extract_features(ref, sr)
    user_feat = extract_features(user, sr)

    # DTW comparison
    distance, path = fastdtw(ref_feat, user_feat, dist=euclidean)
    
    # Normalize by path length
    normalized_distance = distance / len(path)
    max_distance = 500  # tune this based on your audio
    similarity = max(0, 100 - (normalized_distance / max_distance * 100))

    return round(similarity, 2)

score = compare_audio_dtw('anaar.mpeg', 'testAnaar.mpeg')
print(f"Similarity: {score}%")