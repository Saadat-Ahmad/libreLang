import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Router } from '@angular/router';

interface VocabularyWord {
  id: number;
  urdu: string;
  transliteration: string;
  english: string;
  category: string;
  example: string;
  exampleTransliteration: string;
  exampleTranslation: string;
  learned: boolean;
}

interface WordCategory {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-lesson2',
  standalone: true,
  templateUrl: './lesson-2.component.html',
  styleUrls: ['./lesson-2.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerList', [
      transition(':enter', [
        query('.word-card', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger(80, [
            animate('0.35s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('flipCard', [
      transition('front => back', [
        animate('0.3s ease-out', style({ transform: 'rotateY(90deg)' })),
        animate('0.3s ease-in', style({ transform: 'rotateY(0deg)' }))
      ])
    ])
  ]
})
export class Lesson2Component implements OnInit {
  selectedCategory: string = 'all';
  viewMode: 'grid' | 'list' = 'grid';
  searchTerm: string = '';
  flippedCardId: number | null = null;
  learnedCount: number = 0;
  totalWords: number = 0;

  categories: WordCategory[] = [
    { id: 'all', name: 'All Words', icon: '📚' },
    { id: 'greetings', name: 'Greetings', icon: '👋' },
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'food', name: 'Food & Drinks', icon: '🍽️' },
    { id: 'daily', name: 'Daily Life', icon: '🏠' },
    { id: 'questions', name: 'Question Words', icon: '❓' }
  ];

  vocabularyWords: VocabularyWord[] = [
    {
      id: 1,
      urdu: 'سلام',
      transliteration: 'Salaam',
      english: 'Hello / Greetings',
      category: 'greetings',
      example: 'آپ کو سلام',
      exampleTransliteration: 'Aap ko salaam',
      exampleTranslation: 'Greetings to you',
      learned: false
    },
    {
      id: 2,
      urdu: 'صبح',
      transliteration: 'Subah',
      english: 'Morning',
      category: 'greetings',
      example: 'صبح بخیر',
      exampleTransliteration: 'Subah bakhair',
      exampleTranslation: 'Good morning',
      learned: false
    },
    {
      id: 3,
      urdu: 'شام',
      transliteration: 'Shaam',
      english: 'Evening',
      category: 'greetings',
      example: 'شام بخیر',
      exampleTransliteration: 'Shaam bakhair',
      exampleTranslation: 'Good evening',
      learned: false
    },
    {
      id: 4,
      urdu: 'رات',
      transliteration: 'Raat',
      english: 'Night',
      category: 'greetings',
      example: 'شب بخیر',
      exampleTransliteration: 'Shab bakhair',
      exampleTranslation: 'Good night',
      learned: false
    },
    {
      id: 5,
      urdu: 'ماں',
      transliteration: 'Maan',
      english: 'Mother',
      category: 'family',
      example: 'میری ماں بہت اچھی ہیں',
      exampleTransliteration: 'Meri maan bohat achi hain',
      exampleTranslation: 'My mother is very good',
      learned: false
    },
    {
      id: 6,
      urdu: 'باپ',
      transliteration: 'Baap',
      english: 'Father',
      category: 'family',
      example: 'میرے باپ کا نام احمد ہے',
      exampleTransliteration: 'Mere baap ka naam Ahmed hai',
      exampleTranslation: 'My father\'s name is Ahmed',
      learned: false
    },
    {
      id: 7,
      urdu: 'بھائی',
      transliteration: 'Bhai',
      english: 'Brother',
      category: 'family',
      example: 'میرا بھائی سکول جاتا ہے',
      exampleTransliteration: 'Mera bhai school jata hai',
      exampleTranslation: 'My brother goes to school',
      learned: false
    },
    {
      id: 8,
      urdu: 'بہن',
      transliteration: 'Behan',
      english: 'Sister',
      category: 'family',
      example: 'میری بہن کا نام فاطمہ ہے',
      exampleTransliteration: 'Meri behan ka naam Fatima hai',
      exampleTranslation: 'My sister\'s name is Fatima',
      learned: false
    },
    {
      id: 9,
      urdu: 'دوست',
      transliteration: 'Dost',
      english: 'Friend',
      category: 'family',
      example: 'وہ میرا اچھا دوست ہے',
      exampleTransliteration: 'Woh mera acha dost hai',
      exampleTranslation: 'He is my good friend',
      learned: false
    },
    {
      id: 10,
      urdu: 'پانی',
      transliteration: 'Paani',
      english: 'Water',
      category: 'food',
      example: 'مجھے پانی چاہیے',
      exampleTransliteration: 'Mujhe paani chahiye',
      exampleTranslation: 'I need water',
      learned: false
    },
    {
      id: 11,
      urdu: 'چائے',
      transliteration: 'Chai',
      english: 'Tea',
      category: 'food',
      example: 'کیا آپ چائے لیں گے؟',
      exampleTransliteration: 'Kya aap chai lain gay?',
      exampleTranslation: 'Will you have tea?',
      learned: false
    },
    {
      id: 12,
      urdu: 'روٹی',
      transliteration: 'Roti',
      english: 'Bread',
      category: 'food',
      example: 'روٹی گرم ہے',
      exampleTransliteration: 'Roti garam hai',
      exampleTranslation: 'The bread is hot',
      learned: false
    },
    {
      id: 13,
      urdu: 'دودھ',
      transliteration: 'Doodh',
      english: 'Milk',
      category: 'food',
      example: 'بچہ دودھ پیتا ہے',
      exampleTransliteration: 'Bacha doodh peeta hai',
      exampleTranslation: 'The child drinks milk',
      learned: false
    },
    {
      id: 14,
      urdu: 'پھل',
      transliteration: 'Phal',
      english: 'Fruit',
      category: 'food',
      example: 'پھل صحت کے لیے اچھے ہیں',
      exampleTransliteration: 'Phal sehat ke liye ache hain',
      exampleTranslation: 'Fruits are good for health',
      learned: false
    },
    {
      id: 15,
      urdu: 'گھر',
      transliteration: 'Ghar',
      english: 'House / Home',
      category: 'daily',
      example: 'میرا گھر بڑا ہے',
      exampleTransliteration: 'Mera ghar bara hai',
      exampleTranslation: 'My house is big',
      learned: false
    },
    {
      id: 16,
      urdu: 'کتاب',
      transliteration: 'Kitaab',
      english: 'Book',
      category: 'daily',
      example: 'یہ کتاب دلچسپ ہے',
      exampleTransliteration: 'Yeh kitaab dilchasp hai',
      exampleTranslation: 'This book is interesting',
      learned: false
    },
    {
      id: 17,
      urdu: 'وقت',
      transliteration: 'Waqt',
      english: 'Time',
      category: 'daily',
      example: 'وقت کیا ہوا ہے؟',
      exampleTransliteration: 'Waqt kya hua hai?',
      exampleTranslation: 'What time is it?',
      learned: false
    },
    {
      id: 18,
      urdu: 'دن',
      transliteration: 'Din',
      english: 'Day',
      category: 'daily',
      example: 'آج اچھا دن ہے',
      exampleTransliteration: 'Aaj acha din hai',
      exampleTranslation: 'Today is a good day',
      learned: false
    },
    {
      id: 19,
      urdu: 'کیا',
      transliteration: 'Kya',
      english: 'What',
      category: 'questions',
      example: 'کیا ہوا؟',
      exampleTransliteration: 'Kya hua?',
      exampleTranslation: 'What happened?',
      learned: false
    },
    {
      id: 20,
      urdu: 'کون',
      transliteration: 'Kaun',
      english: 'Who',
      category: 'questions',
      example: 'کون آیا ہے؟',
      exampleTransliteration: 'Kaun aaya hai?',
      exampleTranslation: 'Who has come?',
      learned: false
    },
    {
      id: 21,
      urdu: 'کب',
      transliteration: 'Kab',
      english: 'When',
      category: 'questions',
      example: 'آپ کب آئیں گے؟',
      exampleTransliteration: 'Aap kab aain gay?',
      exampleTranslation: 'When will you come?',
      learned: false
    },
    {
      id: 22,
      urdu: 'کہاں',
      transliteration: 'Kahan',
      english: 'Where',
      category: 'questions',
      example: 'آپ کہاں ہیں؟',
      exampleTransliteration: 'Aap kahan hain?',
      exampleTranslation: 'Where are you?',
      learned: false
    },
    {
      id: 23,
      urdu: 'کیوں',
      transliteration: 'Kyun',
      english: 'Why',
      category: 'questions',
      example: 'آپ کیوں ہنس رہے ہیں؟',
      exampleTransliteration: 'Aap kyun hans rahe hain?',
      exampleTranslation: 'Why are you laughing?',
      learned: false
    },
    {
      id: 24,
      urdu: 'کیسے',
      transliteration: 'Kaise',
      english: 'How',
      category: 'questions',
      example: 'آپ کیسے آئے؟',
      exampleTransliteration: 'Aap kaise aaye?',
      exampleTranslation: 'How did you come?',
      learned: false
    }
  ];

  filteredWords: VocabularyWord[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filterWords();
    this.totalWords = this.vocabularyWords.length;
    this.updateLearnedCount();
  }

  filterWords(): void {
    let words = this.vocabularyWords;
    
    if (this.selectedCategory !== 'all') {
      words = words.filter(w => w.category === this.selectedCategory);
    }
    
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      words = words.filter(w => 
        w.english.toLowerCase().includes(term) ||
        w.transliteration.toLowerCase().includes(term) ||
        w.urdu.includes(term)
      );
    }
    
    this.filteredWords = words;
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterWords();
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterWords();
  }

  flipCard(wordId: number): void {
    this.flippedCardId = this.flippedCardId === wordId ? null : wordId;
  }

  toggleLearned(word: VocabularyWord, event: Event): void {
    event.stopPropagation();
    word.learned = !word.learned;
    this.updateLearnedCount();
  }

  updateLearnedCount(): void {
    this.learnedCount = this.vocabularyWords.filter(w => w.learned).length;
  }

  speakWord(word: VocabularyWord, event: Event): void {
    event.stopPropagation();
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word.urdu);
      utterance.lang = 'ur-PK';
      utterance.rate = 0.75;
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

  speakExample(word: VocabularyWord, event: Event): void {
    event.stopPropagation();
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word.example);
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

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  }

  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.icon : '📝';
  }
  navigateToPractise(): void {
    this.router.navigateByUrl('/practise-2');
  }
}