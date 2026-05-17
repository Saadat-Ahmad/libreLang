import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Add this import
import { trigger, transition, style, animate } from '@angular/animations';

interface MatchingPair {
  id: number;
  urdu: string;
  english: string;
  matched: boolean;
}

interface FillInBlank {
  id: number;
  sentence: string;
  answer: string;
  hint: string;
  userAnswer: string;
  showHint: boolean;
  isCorrect: boolean | null;
}

interface MultipleChoice {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
  isCorrect: boolean | null;
}

@Component({
  selector: 'app-practise-3',
  standalone: true,  // Add this if not already present
  imports: [FormsModule],  // Add FormsModule here
  templateUrl: './practise-3.component.html',
  styleUrls: ['./practise-3.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class UrduPracticeSheetComponent implements OnInit {
  activeExercise: 'matching' | 'fillblank' | 'multiplechoice' | 'pronunciation' = 'matching';
  
  totalScore: number = 0;
  matchingScore: number = 0;
  fillBlankScore: number = 0;
  multipleChoiceScore: number = 0;
  pronunciationAttempts: number = 0;

  // Matching Exercise
  matchingPairs: MatchingPair[] = [
    { id: 1, urdu: 'آپ کیسے ہیں؟', english: 'How are you?', matched: false },
    { id: 2, urdu: 'شکریہ', english: 'Thank you', matched: false },
    { id: 3, urdu: 'میرا نام ۔۔۔ ہے', english: 'My name is...', matched: false },
    { id: 4, urdu: 'آپ کا نام کیا ہے؟', english: 'What is your name?', matched: false },
    { id: 5, urdu: 'جی ہاں', english: 'Yes (respectful)', matched: false },
    { id: 6, urdu: 'پھر ملیں گے', english: 'See you later', matched: false }
  ];
  
  shuffledEnglish: { id: number; text: string; pairId: number }[] = [];
  selectedUrdu: number | null = null;
  selectedEnglish: number | null = null;
  matchAttempts: number = 0;
  matchCorrect: number = 0;

  // Fill in the Blanks Exercise
  fillBlanks: FillInBlank[] = [
    {
      id: 1,
      sentence: 'آپ _______ ہیں؟',
      answer: 'کیسے',
      hint: 'Question word for "how"',
      userAnswer: '',
      showHint: false,
      isCorrect: null
    },
    {
      id: 2,
      sentence: 'میرا نام علی ہے۔ آپ کا نام _______ ہے؟',
      answer: 'کیا',
      hint: 'Question word for "what"',
      userAnswer: '',
      showHint: false,
      isCorrect: null
    },
    {
      id: 3,
      sentence: 'آپ کا دن اچھا _______',
      answer: 'گزرے',
      hint: 'Means "may it pass"',
      userAnswer: '',
      showHint: false,
      isCorrect: null
    },
    {
      id: 4,
      sentence: '_______! میں ٹھیک ہوں۔',
      answer: 'شکریہ',
      hint: 'Expression of gratitude',
      userAnswer: '',
      showHint: false,
      isCorrect: null
    }
  ];

  // Multiple Choice Exercise
  multipleChoiceQuestions: MultipleChoice[] = [
    {
      id: 1,
      question: 'What does "شکریہ" mean?',
      options: ['Hello', 'Goodbye', 'Thank you', 'How are you?'],
      correctIndex: 2,
      selectedIndex: null,
      isCorrect: null
    },
    {
      id: 2,
      question: 'How do you ask "What is your name?" in Urdu?',
      options: ['آپ کیسے ہیں؟', 'آپ کا نام کیا ہے؟', 'میرا نام ہے', 'شکریہ'],
      correctIndex: 1,
      selectedIndex: null,
      isCorrect: null
    },
    {
      id: 3,
      question: 'Which word means "name" in Urdu?',
      options: ['کیا', 'آپ', 'نام', 'میرا'],
      correctIndex: 2,
      selectedIndex: null,
      isCorrect: null
    },
    {
      id: 4,
      question: '"Aap" is used to show:',
      options: ['Informality', 'Respect', 'Anger', 'Sadness'],
      correctIndex: 1,
      selectedIndex: null,
      isCorrect: null
    }
  ];

  // Pronunciation Practice
  pronunciationPhrases = [
    { urdu: 'آپ کیسے ہیں؟', transliteration: 'Aap kaise hain?', spoken: false },
    { urdu: 'شکریہ', transliteration: 'Shukriya', spoken: false },
    { urdu: 'پھر ملیں گے', transliteration: 'Phir milenge', spoken: false },
    { urdu: 'آپ کا نام کیا ہے؟', transliteration: 'Aap ka naam kya hai?', spoken: false }
  ];

  constructor() {}

  ngOnInit(): void {
    this.shuffleEnglishPairs();
  }

  // Getters for template
  get matchedCount(): number {
    return this.matchingPairs.filter(p => p.matched).length;
  }

  get totalPairsCount(): number {
    return this.matchingPairs.length;
  }

  get allExercisesCompleted(): boolean {
    return this.matchingPairs.every(p => p.matched) &&
           this.fillBlanks.every(b => b.isCorrect === true) &&
           this.multipleChoiceQuestions.every(q => q.isCorrect === true) &&
           this.pronunciationPhrases.every(p => p.spoken);
  }

  // Exercise Selection
  setActiveExercise(exercise: 'matching' | 'fillblank' | 'multiplechoice' | 'pronunciation'): void {
    this.activeExercise = exercise;
  }

  // Matching Exercise Methods
  shuffleEnglishPairs(): void {
    this.shuffledEnglish = this.matchingPairs.map(pair => ({
      id: pair.id + 100,
      text: pair.english,
      pairId: pair.id
    })).sort(() => Math.random() - 0.5);
  }

  selectUrdu(pairId: number): void {
    const pair = this.matchingPairs.find(p => p.id === pairId);
    if (pair?.matched) return;

    // If this Urdu card is already selected, deselect it
    if (this.selectedUrdu === pairId) {
      this.selectedUrdu = null;
      return;
    }

    this.selectedUrdu = pairId;
    this.checkMatch();
  }

  selectEnglish(engId: number): void {
    const engItem = this.shuffledEnglish.find(e => e.id === engId);
    if (!engItem) return;
    
    const pair = this.matchingPairs.find(p => p.id === engItem.pairId);
    if (pair?.matched) return;

    // If this English card is already selected, deselect it
    if (this.selectedEnglish === engId) {
      this.selectedEnglish = null;
      return;
    }

    this.selectedEnglish = engId;
    this.checkMatch();
  }

  checkMatch(): void {
    if (this.selectedUrdu !== null && this.selectedEnglish !== null) {
      this.matchAttempts++;
      const engItem = this.shuffledEnglish.find(e => e.id === this.selectedEnglish);
      
      if (engItem && this.selectedUrdu === engItem.pairId) {
        // Correct match
        this.matchCorrect++;
        const pair = this.matchingPairs.find(p => p.id === this.selectedUrdu);
        if (pair) {
          pair.matched = true;
        }
        this.matchingScore = Math.round((this.matchCorrect / this.matchAttempts) * 100);
        this.updateTotalScore();
      } else {
        // Wrong match - flash animation would go here
      }

      // Reset selections after a brief delay
      setTimeout(() => {
        this.selectedUrdu = null;
        this.selectedEnglish = null;
      }, 300);
    }
  }

  resetMatching(): void {
    this.matchingPairs.forEach(p => {
      p.matched = false;
    });
    this.selectedUrdu = null;
    this.selectedEnglish = null;
    this.matchAttempts = 0;
    this.matchCorrect = 0;
    this.matchingScore = 0;
    this.shuffleEnglishPairs();
    this.updateTotalScore();
  }

  // Fill in the Blanks Methods
  checkFillBlank(blank: FillInBlank): void {
    const userAnswer = blank.userAnswer.trim();
    const correctAnswer = blank.answer.trim();
    
    if (userAnswer === correctAnswer || 
        userAnswer.replace(/[ًٌٍَُِّْ]/g, '') === correctAnswer.replace(/[ًٌٍَُِّْ]/g, '')) {
      blank.isCorrect = true;
    } else {
      blank.isCorrect = false;
    }

    this.updateFillBlankScore();
  }

  updateFillBlankScore(): void {
    const correct = this.fillBlanks.filter(b => b.isCorrect === true);
    this.fillBlankScore = Math.round((correct.length / this.fillBlanks.length) * 100);
    this.updateTotalScore();
  }

  resetFillBlanks(): void {
    this.fillBlanks.forEach(b => {
      b.userAnswer = '';
      b.showHint = false;
      b.isCorrect = null;
    });
    this.fillBlankScore = 0;
    this.updateTotalScore();
  }

  // Multiple Choice Methods
  selectMCAnswer(question: MultipleChoice, index: number): void {
    if (question.selectedIndex !== null) return;
    
    question.selectedIndex = index;
    question.isCorrect = index === question.correctIndex;
    this.updateMCScore();
  }

  updateMCScore(): void {
    const correct = this.multipleChoiceQuestions.filter(q => q.isCorrect === true);
    this.multipleChoiceScore = Math.round((correct.length / this.multipleChoiceQuestions.length) * 100);
    this.updateTotalScore();
  }

  resetMultipleChoice(): void {
    this.multipleChoiceQuestions.forEach(q => {
      q.selectedIndex = null;
      q.isCorrect = null;
    });
    this.multipleChoiceScore = 0;
    this.updateTotalScore();
  }

  // Pronunciation Methods
  speakPhrase(urdu: string): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(urdu);
      utterance.lang = 'ur-PK';
      utterance.rate = 0.8;
      
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

  markPronounced(index: number): void {
    this.pronunciationPhrases[index].spoken = true;
    this.pronunciationAttempts = this.pronunciationPhrases.filter(p => p.spoken).length;
  }

  // Score Management
  updateTotalScore(): void {
    const scores = [this.matchingScore, this.fillBlankScore, this.multipleChoiceScore];
    const validScores = scores.filter(s => s > 0);
    this.totalScore = validScores.length > 0 
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 0;
  }
  getPairById(pairId: number): MatchingPair | undefined {
    return this.matchingPairs.find(p => p.id === pairId);
  }
}