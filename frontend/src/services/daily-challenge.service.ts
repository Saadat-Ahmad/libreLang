import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Challenge {
  id: number;
  title: string;
  description: string;
  type: 'translate' | 'pronounce' | 'write' | 'read' | 'vocabulary' | 'grammar';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pointsReward: number;
  timeLimit: number; // seconds
  content: ChallengeContent;
  hints: string[];
  correctAnswer: string;
  completed: boolean;
  userAnswer: string;
  score: number | null;
}

export interface ChallengeContent {
  prompt: string;
  urduText?: string;
  englishText?: string;
  options?: string[];
  audioUrl?: string;
  imageUrl?: string;
}

export interface DailyProgress {
  date: string;
  challengesCompleted: number;
  totalChallenges: number;
  pointsEarned: number;
  streak: number;
  xpMultiplier: number;
}

export interface UserStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  xpToNextLevel: number;
  totalXp: number;
  badges: Badge[];
  weeklyProgress: DailyProgress[];
}

export interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  unlockedAt: Date | null;
  progress: number;
  target: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  avatar: string;
  points: number;
  streak: number;
  level: number;
}

@Injectable({
  providedIn: 'root'
})
export class DailyChallengeService {
  private challengesSubject = new BehaviorSubject<Challenge[]>([]);
  private userStatsSubject = new BehaviorSubject<UserStats>(this.getInitialStats());
  private leaderboardSubject = new BehaviorSubject<LeaderboardEntry[]>([]);
  private timeLeftSubject = new BehaviorSubject<number>(0);
  private timerInterval: any = null;

  constructor() {
    this.generateDailyChallenges();
    this.generateLeaderboard();
  }

  private getInitialStats(): UserStats {
    return {
      totalPoints: 1250,
      currentStreak: 7,
      longestStreak: 15,
      level: 4,
      xpToNextLevel: 500,
      totalXp: 2500,
      badges: [
        {
          id: 1,
          name: 'Early Bird',
          icon: '🌅',
          description: 'Complete 5 challenges before 9 AM',
          unlockedAt: new Date('2024-01-20'),
          progress: 5,
          target: 5
        },
        {
          id: 2,
          name: 'Perfect Score',
          icon: '🎯',
          description: 'Get 100% on 10 challenges',
          unlockedAt: null,
          progress: 7,
          target: 10
        },
        {
          id: 3,
          name: 'Streak Master',
          icon: '🔥',
          description: 'Maintain a 30-day streak',
          unlockedAt: null,
          progress: 7,
          target: 30
        },
        {
          id: 4,
          name: 'Vocabulary King',
          icon: '👑',
          description: 'Complete 50 vocabulary challenges',
          unlockedAt: null,
          progress: 23,
          target: 50
        }
      ],
      weeklyProgress: [
        { date: '2024-01-22', challengesCompleted: 8, totalChallenges: 8, pointsEarned: 400, streak: 7, xpMultiplier: 1.5 },
        { date: '2024-01-21', challengesCompleted: 6, totalChallenges: 8, pointsEarned: 300, streak: 6, xpMultiplier: 1.3 },
        { date: '2024-01-20', challengesCompleted: 5, totalChallenges: 8, pointsEarned: 250, streak: 5, xpMultiplier: 1.1 },
        { date: '2024-01-19', challengesCompleted: 7, totalChallenges: 8, pointsEarned: 350, streak: 4, xpMultiplier: 1.0 },
        { date: '2024-01-18', challengesCompleted: 4, totalChallenges: 8, pointsEarned: 200, streak: 3, xpMultiplier: 1.0 },
        { date: '2024-01-17', challengesCompleted: 8, totalChallenges: 8, pointsEarned: 400, streak: 2, xpMultiplier: 1.0 },
        { date: '2024-01-16', challengesCompleted: 3, totalChallenges: 8, pointsEarned: 150, streak: 1, xpMultiplier: 1.0 }
      ]
    };
  }

  private generateDailyChallenges(): void {
    const challenges: Challenge[] = [
      {
        id: 1,
        title: 'Morning Greetings',
        description: 'Translate the English greeting to Urdu',
        type: 'translate',
        difficulty: 'beginner',
        pointsReward: 50,
        timeLimit: 60,
        content: {
          prompt: 'Translate to Urdu:',
          englishText: 'Good morning, how are you?',
          options: [
            'صبح بخیر، آپ کیسے ہیں؟',
            'شب بخیر، آپ کہاں ہیں؟',
            'سلام، آپ کون ہیں؟',
            'خدا حافظ، میں ٹھیک ہوں'
          ]
        },
        hints: [
          'صبح means morning',
          'کیسے means how',
          'آپ means you (formal)'
        ],
        correctAnswer: 'صبح بخیر، آپ کیسے ہیں؟',
        completed: false,
        userAnswer: '',
        score: null
      },
      {
        id: 2,
        title: 'Family Vocabulary',
        description: 'Match the Urdu word with its English meaning',
        type: 'vocabulary',
        difficulty: 'beginner',
        pointsReward: 40,
        timeLimit: 90,
        content: {
          prompt: 'What does "بھائی" mean?',
          urduText: 'بھائی',
          options: [
            'Sister',
            'Brother',
            'Mother',
            'Father'
          ]
        },
        hints: [
          'It\'s a male family member',
          'Often used as a term of respect for men'
        ],
        correctAnswer: 'Brother',
        completed: false,
        userAnswer: '',
        score: null
      },
      {
        id: 3,
        title: 'Pronunciation Challenge',
        description: 'Listen and type what you hear in Urdu',
        type: 'pronounce',
        difficulty: 'intermediate',
        pointsReward: 75,
        timeLimit: 120,
        content: {
          prompt: 'Type the Urdu phrase you hear:',
          audioUrl: 'assets/audio/challenge-phrase.mp3',
          options: [
            'میرا نام احمد ہے',
            'میں پاکستان سے ہوں',
            'مجھے اردو سیکھنی ہے',
            'آپ کا شکریہ'
          ]
        },
        hints: [
          'Listen for "میرا نام"',
          'The phrase includes a name'
        ],
        correctAnswer: 'میرا نام احمد ہے',
        completed: false,
        userAnswer: '',
        score: null
      },
      {
        id: 4,
        title: 'Fill in the Blank',
        description: 'Complete the Urdu sentence',
        type: 'grammar',
        difficulty: 'intermediate',
        pointsReward: 60,
        timeLimit: 90,
        content: {
          prompt: 'Fill in the blank:',
          urduText: 'وہ ______ جا رہا ہے۔',
          options: [
            'سکول',
            'کتاب',
            'پانی',
            'کھانا'
          ]
        },
        hints: [
          'The sentence means "He is going to..."',
          'It\'s a place where students go'
        ],
        correctAnswer: 'سکول',
        completed: false,
        userAnswer: '',
        score: null
      },
      {
        id: 5,
        title: 'Word Unscramble',
        description: 'Unscramble the Urdu letters to form a word',
        type: 'write',
        difficulty: 'beginner',
        pointsReward: 45,
        timeLimit: 60,
        content: {
          prompt: 'Unscramble: ک ت ا ب',
          options: [
            'کتاب',
            'کاتب',
            'بتاک',
            'تباک'
          ]
        },
        hints: [
          'It\'s something you read',
          'It has pages'
        ],
        correctAnswer: 'کتاب',
        completed: false,
        userAnswer: '',
        score: null
      },
      {
        id: 6,
        title: 'Reading Comprehension',
        description: 'Read the passage and answer the question',
        type: 'read',
        difficulty: 'advanced',
        pointsReward: 100,
        timeLimit: 180,
        content: {
          prompt: 'Read and answer: کہانی کس کے بارے میں ہے؟',
          urduText: 'ایک چھوٹا لڑکا تھا جس کا نام علی تھا۔ وہ ہر روز صبح سویرے اٹھتا تھا اور سکول جاتا تھا۔ اسے پڑھائی بہت پسند تھی۔',
          options: [
            'ایک لڑکی کے بارے میں',
            'علی نامی لڑکے کے بارے میں',
            'ایک استاد کے بارے میں',
            'سکول کے بارے میں'
          ]
        },
        hints: [
          'Look for the name in the passage',
          'The story mentions a boy'
        ],
        correctAnswer: 'علی نامی لڑکے کے بارے میں',
        completed: false,
        userAnswer: '',
        score: null
      },
      {
        id: 7,
        title: 'Speed Translation',
        description: 'Translate the Urdu sentence to English quickly',
        type: 'translate',
        difficulty: 'intermediate',
        pointsReward: 80,
        timeLimit: 60,
        content: {
          prompt: 'Translate to English:',
          urduText: 'آج موسم بہت اچھا ہے',
          options: [
            'The weather is very nice today',
            'Today is a bad day',
            'Tomorrow will be sunny',
            'It was raining yesterday'
          ]
        },
        hints: [
          'موسم means weather',
          'آج means today',
          'اچھا means good/nice'
        ],
        correctAnswer: 'The weather is very nice today',
        completed: false,
        userAnswer: '',
        score: null
      },
      {
        id: 8,
        title: 'Poetry Appreciation',
        description: 'Complete the famous Urdu couplet',
        type: 'vocabulary',
        difficulty: 'advanced',
        pointsReward: 120,
        timeLimit: 120,
        content: {
          prompt: 'Complete the couplet:',
          urduText: 'ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم ______',
          options: [
            'نکلے',
            'آئے',
            'جائے',
            'رکے'
          ]
        },
        hints: [
          'This is a famous Ghalib couplet',
          'The word rhymes with the theme of desires'
        ],
        correctAnswer: 'نکلے',
        completed: false,
        userAnswer: '',
        score: null
      }
    ];

    this.challengesSubject.next(challenges);
  }

  private generateLeaderboard(): void {
    const leaderboard: LeaderboardEntry[] = [
      { rank: 1, userId: 101, username: 'UrduMaster', avatar: '👨‍🎓', points: 5200, streak: 45, level: 12 },
      { rank: 2, userId: 102, username: 'PoetryQueen', avatar: '👩‍🎨', points: 4800, streak: 38, level: 11 },
      { rank: 3, userId: 103, username: 'WordWarrior', avatar: '🧙‍♂️', points: 4500, streak: 30, level: 10 },
      { rank: 4, userId: 104, username: 'ScriptScholar', avatar: '👨‍🔬', points: 4200, streak: 25, level: 9 },
      { rank: 5, userId: 1, username: 'Ahmed Khan', avatar: '👤', points: 3900, streak: 7, level: 4 },
      { rank: 6, userId: 105, username: 'GhazalGuru', avatar: '🧕', points: 3600, streak: 20, level: 8 },
      { rank: 7, userId: 106, username: 'UrduNovice', avatar: '👶', points: 3400, streak: 15, level: 7 },
      { rank: 8, userId: 107, username: 'LanguageLover', avatar: '💁‍♀️', points: 3100, streak: 12, level: 6 },
      { rank: 9, userId: 108, username: 'CultureKing', avatar: '🤴', points: 2800, streak: 10, level: 5 },
      { rank: 10, userId: 109, username: 'AlifSeYa', avatar: '👩‍🏫', points: 2500, streak: 8, level: 4 }
    ];

    this.leaderboardSubject.next(leaderboard);
  }

  getChallenges(): Observable<Challenge[]> {
    return this.challengesSubject.asObservable();
  }

  getUserStats(): Observable<UserStats> {
    return this.userStatsSubject.asObservable();
  }

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.leaderboardSubject.asObservable();
  }

  getTimeLeft(): Observable<number> {
    return this.timeLeftSubject.asObservable();
  }

  startChallenge(challengeId: number): void {
    const challenges = this.challengesSubject.value;
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (challenge && challenge.timeLimit > 0) {
      this.timeLeftSubject.next(challenge.timeLimit);
      
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      
      this.timerInterval = setInterval(() => {
        const currentTime = this.timeLeftSubject.value - 1;
        this.timeLeftSubject.next(currentTime);
        
        if (currentTime <= 0) {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    }
  }

  submitAnswer(challengeId: number, answer: string): void {
    const challenges = this.challengesSubject.value;
    const challengeIndex = challenges.findIndex(c => c.id === challengeId);
    
    if (challengeIndex !== -1) {
      const challenge = challenges[challengeIndex];
      const timeLeft = this.timeLeftSubject.value;
      const maxTime = challenge.timeLimit;
      
      // Calculate score based on correctness and time
      const isCorrect = answer.trim() === challenge.correctAnswer.trim();
      const timeBonus = maxTime > 0 ? Math.floor((timeLeft / maxTime) * 20) : 0;
      const baseScore = isCorrect ? challenge.pointsReward : 0;
      const totalScore = baseScore + (isCorrect ? timeBonus : 0);
      
      challenge.userAnswer = answer;
      challenge.score = totalScore;
      challenge.completed = true;
      
      challenges[challengeIndex] = challenge;
      this.challengesSubject.next([...challenges]);
      
      // Update user stats
      if (isCorrect) {
        this.updateUserStats(totalScore);
      }
      
      // Clear timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
    }
  }

  private updateUserStats(pointsEarned: number): void {
    const stats = this.userStatsSubject.value;
    const xpMultiplier = this.getXPMultiplier(stats.currentStreak);
    const earnedXp = Math.floor(pointsEarned * xpMultiplier);
    
    stats.totalPoints += pointsEarned;
    stats.totalXp += earnedXp;
    
    // Check level up
    if (stats.totalXp >= stats.xpToNextLevel) {
      stats.level++;
      stats.totalXp -= stats.xpToNextLevel;
      stats.xpToNextLevel = Math.floor(stats.xpToNextLevel * 1.5);
    }
    
    // Update badges progress
    stats.badges.forEach(badge => {
      if (!badge.unlockedAt) {
        if (badge.id === 4) { // Vocabulary King
          badge.progress++;
        }
        if (badge.id === 2) { // Perfect Score
          badge.progress++;
        }
      }
    });
    
    this.userStatsSubject.next({ ...stats });
  }

  getXPMultiplier(streak: number): number {
    if (streak >= 30) return 3.0;
    if (streak >= 14) return 2.0;
    if (streak >= 7) return 1.5;
    if (streak >= 3) return 1.2;
    return 1.0;
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#666';
    }
  }

  getChallengeTypeIcon(type: string): string {
    switch (type) {
      case 'translate': return '🔄';
      case 'pronounce': return '🎤';
      case 'write': return '✍️';
      case 'read': return '📖';
      case 'vocabulary': return '📚';
      case 'grammar': return '📝';
      default: return '❓';
    }
  }

  getFormattedTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}