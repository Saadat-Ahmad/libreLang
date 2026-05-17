import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface DialogueLine {
  speaker: string;
  speakerLabel: string;
  urdu: string;
  transliteration: string;
  english: string;
  audioUrl?: string;
}

interface Scene {
  id: number;
  title: string;
  titleUrdu: string;
  setting: string;
  context: string;
  icon: string;
  imageClass: string;
  vocabulary: VocabularyWord[];
  dialogue: DialogueLine[];
  culturalNote: string;
}

interface VocabularyWord {
  urdu: string;
  transliteration: string;
  english: string;
}

@Component({
  selector: 'app-conversation-lesson',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lesson-4.component.html',
  styleUrls: ['./lesson-4.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerDialogue', [
      transition(':enter', [
        query('.dialogue-line', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(150, [
            animate('0.4s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ConversationLessonComponent implements OnInit {
  activeSceneIndex = 0;
  showTranslation = false;
  expandedVocabulary: number | null = null;
  
  scenes: Scene[] = [
    {
      id: 1,
      title: 'At a Restaurant',
      titleUrdu: 'ریستوران میں',
      setting: 'A cozy restaurant in Delhi. You want to order traditional some Indian food.',
      context: 'You enter a restaurant and the waiter greets you. You need to ask for a table, understand the menu, and place your order.',
      icon: '🍽️',
      imageClass: 'scene-restaurant',
      vocabulary: [
        { urdu: 'کھانا', transliteration: 'Khana', english: 'Food' },
        { urdu: 'پانی', transliteration: 'Paani', english: 'Water' },
        { urdu: 'چائے', transliteration: 'Chai', english: 'Tea' },
        { urdu: 'روٹی', transliteration: 'Roti', english: 'Bread' },
        { urdu: 'سالن', transliteration: 'Saalan', english: 'Curry' },
        { urdu: 'میٹھا', transliteration: 'Meetha', english: 'Dessert/Sweet' },
        { urdu: 'بل', transliteration: 'Bill', english: 'Bill/Check' }
      ],
      dialogue: [
        {
          speaker: 'waiter',
          speakerLabel: 'Waiter',
          urdu: 'خوش آمدید۔ کتنے لوگ ہیں؟',
          transliteration: 'Khush aamdeed. Kitne log hain?',
          english: 'Welcome. How many people?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'دو لوگ ہیں۔',
          transliteration: 'Do log hain.',
          english: 'Two people.'
        },
        {
          speaker: 'waiter',
          speakerLabel: 'Waiter',
          urdu: 'یہاں بیٹھیں۔ کیا آپ کچھ پینا پسند کریں گے؟',
          transliteration: 'Yahan baithain. Kya aap kuch peena pasand karein gay?',
          english: 'Please sit here. Would you like something to drink?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'جی، دو پانی اور ایک چائے لے آئیں۔',
          transliteration: 'Jee, do paani aur ek chai le aayein.',
          english: 'Yes, please bring two waters and one tea.'
        },
        {
          speaker: 'waiter',
          speakerLabel: 'Waiter',
          urdu: 'کیا آپ کھانے کے لیے تیار ہیں؟',
          transliteration: 'Kya aap khanay ke liye tayyar hain?',
          english: 'Are you ready to order food?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'جی، ہم دو روٹی، ایک چکن سالن اور ایک دال لیں گے۔',
          transliteration: 'Jee, hum do roti, ek chicken saalan aur ek daal lain gay.',
          english: 'Yes, we will have two breads, one chicken curry, and one lentil soup.'
        },
        {
          speaker: 'waiter',
          speakerLabel: 'Waiter',
          urdu: 'بہت اچھے۔ کیا کچھ میٹھا بھی چاہیے؟',
          transliteration: 'Bohat achay. Kya kuch meetha bhi chahiye?',
          english: 'Very good. Would you like something sweet as well?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'جی ہاں، دو گلاب جامن لے آئیں۔',
          transliteration: 'Jee haan, do gulab jamun le aayein.',
          english: 'Yes, please bring two gulab jamun.'
        },
        {
          speaker: 'waiter',
          speakerLabel: 'Waiter',
          urdu: 'کیا کھانا پسند آیا؟',
          transliteration: 'Kya khana pasand aaya?',
          english: 'Did you enjoy the food?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'جی بہت اچھا تھا۔ بل لے آئیں۔',
          transliteration: 'Jee bohat acha tha. Bill le aayein.',
          english: 'Yes, it was very good. Please bring the bill.'
        }
      ],
      culturalNote: 'In Indian restaurants, it is common to be offered tea (chai) multiple times. Saying "jee" before yes/no adds politeness. Meals typically end with a sweet dish like gulab jamun or kheer.'
    },
    {
      id: 2,
      title: 'At a Market',
      titleUrdu: 'بازار میں',
      setting: 'A bustling bazaar in old Lucknow. You want to buy some clothes and practice bargaining.',
      context: 'You are shopping at a traditional market. You need to ask about prices, sizes, and try bargaining like a local.',
      icon: '🛍️',
      imageClass: 'scene-market',
      vocabulary: [
        { urdu: 'قیمت', transliteration: 'Qeemat', english: 'Price' },
        { urdu: 'مہنگا', transliteration: 'Mehnga', english: 'Expensive' },
        { urdu: 'سستا', transliteration: 'Sasta', english: 'Cheap' },
        { urdu: 'کپڑا', transliteration: 'Kapra', english: 'Cloth/Fabric' },
        { urdu: 'رنگ', transliteration: 'Rang', english: 'Color' },
        { urdu: 'سائز', transliteration: 'Size', english: 'Size' },
        { urdu: 'پیسے', transliteration: 'Paisay', english: 'Money' }
      ],
      dialogue: [
        {
          speaker: 'shopkeeper',
          speakerLabel: 'Shopkeeper',
          urdu: 'جی، کیا چاہیے آپ کو؟',
          transliteration: 'Jee, kya chahiye aap ko?',
          english: 'Yes, what would you like?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'مجھے ایک اچھا سا کپڑا دکھائیں۔',
          transliteration: 'Mujhe ek acha sa kapra dikhayen.',
          english: 'Please show me a nice fabric.'
        },
        {
          speaker: 'shopkeeper',
          speakerLabel: 'Shopkeeper',
          urdu: 'یہ دیکھیں، بہت اعلیٰ کوالٹی ہے۔',
          transliteration: 'Yeh dekhein, bohat aala quality hai.',
          english: 'Look at this, very high quality.'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'اس کی قیمت کیا ہے؟',
          transliteration: 'Is ki qeemat kya hai?',
          english: 'What is the price of this?'
        },
        {
          speaker: 'shopkeeper',
          speakerLabel: 'Shopkeeper',
          urdu: 'صرف دو ہزار روپے۔',
          transliteration: 'Sirf do hazaar rupay.',
          english: 'Only two thousand rupees.'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'یہ تو بہت مہنگا ہے۔ کچھ کم کریں۔',
          transliteration: 'Yeh to bohat mehnga hai. Kuch kam karein.',
          english: 'This is too expensive. Please reduce the price.'
        },
        {
          speaker: 'shopkeeper',
          speakerLabel: 'Shopkeeper',
          urdu: 'آپ کتنے دیں گے؟',
          transliteration: 'Aap kitne dain gay?',
          english: 'How much will you give?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'میں بارہ سو دوں گا۔',
          transliteration: 'Main barah so doon ga.',
          english: 'I will give twelve hundred.'
        },
        {
          speaker: 'shopkeeper',
          speakerLabel: 'Shopkeeper',
          urdu: 'چلیں پندرہ سو دے دیں۔',
          transliteration: 'Chalein, pandrah so day dein.',
          english: 'Okay, give fifteen hundred.'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'ٹھیک ہے، پندرہ سو میں پیک کر دیں۔',
          transliteration: 'Theek hai, pandrah so mein pack kar dein.',
          english: 'Alright, pack it for fifteen hundred.'
        }
      ],
      culturalNote: 'Bargaining (mol-bhaav) is expected in traditional markets. Start by offering about 60% of the asking price. Using phrases like "bohat mehnga hai" (too expensive) is part of the cultural shopping experience.'
    },
    {
      id: 3,
      title: 'Meeting Someone New',
      titleUrdu: 'نئی ملاقات',
      setting: 'A wedding reception in Aligarh. You meet new people and want to make conversation.',
      context: 'You are at a social gathering and want to introduce yourself, ask about others, and make polite small talk.',
      icon: '🤝',
      imageClass: 'scene-meeting',
      vocabulary: [
        { urdu: 'ملاقات', transliteration: 'Mulaqaat', english: 'Meeting' },
        { urdu: 'تعارف', transliteration: 'Taaruf', english: 'Introduction' },
        { urdu: 'پیشہ', transliteration: 'Pesha', english: 'Profession' },
        { urdu: 'شہر', transliteration: 'Shehar', english: 'City' },
        { urdu: 'خاندان', transliteration: 'Khandaan', english: 'Family' },
        { urdu: 'شوق', transliteration: 'Shauq', english: 'Hobby/Interest' }
      ],
      dialogue: [
        {
          speaker: 'stranger',
          speakerLabel: 'Stranger',
          urdu: 'السلام علیکم! آپ کا نام کیا ہے؟',
          transliteration: 'Assalam-u-alaikum! Aap ka naam kya hai?',
          english: 'Hello! What is your name?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'وعلیکم السلام! میرا نام احمد ہے۔ اور آپ کا؟',
          transliteration: 'Wa-alaikum-assalam! Mera naam Ahmed hai. Aur aap ka?',
          english: 'Hello! My name is Ahmed. And yours?'
        },
        {
          speaker: 'stranger',
          speakerLabel: 'Stranger',
          urdu: 'میں فاطمہ ہوں۔ آپ کہاں سے ہیں؟',
          transliteration: 'Main Fatima hoon. Aap kahan se hain?',
          english: 'I am Fatima. Where are you from?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'میں میروت سے ہوں۔ آپ کا تعلق کہاں سے ہے؟',
          transliteration: 'Main Meerut se hoon. Aap ka talluq kahan se hai?',
          english: 'I am from Meerut. Where do you belong from?'
        },
        {
          speaker: 'stranger',
          speakerLabel: 'Stranger',
          urdu: 'میرا تعلق میزفرپر سے ہے۔ آپ کیا کرتے ہیں؟',
          transliteration: 'Mera talluq Muzaffarpur se hai. Aap kya karte hain?',
          english: 'I belong to Muzaffarpur. What do you do?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'میں ایک استاد ہوں۔ آپ کا پیشہ کیا ہے؟',
          transliteration: 'Main ek ustaad hoon. Aap ka pesha kya hai?',
          english: 'I am a teacher. What is your profession?'
        },
        {
          speaker: 'stranger',
          speakerLabel: 'Stranger',
          urdu: 'میں ڈاکٹر ہوں۔ آپ کو اردو بہت اچھی آتی ہے۔',
          transliteration: 'Main doctor hoon. Aap ko Urdu bohat achi aati hai.',
          english: 'I am a doctor. You speak Urdu very well.'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'شکریہ! میں ابھی سیکھ رہا ہوں۔',
          transliteration: 'Shukriya! Main abhi seekh raha hoon.',
          english: 'Thank you! I am still learning.'
        },
        {
          speaker: 'stranger',
          speakerLabel: 'Stranger',
          urdu: 'آپ سے مل کر بہت خوشی ہوئی۔',
          transliteration: 'Aap se mil kar bohat khushi hui.',
          english: 'It was very nice to meet you.'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'مجھے بھی بہت اچھا لگا۔ پھر ملیں گے۔',
          transliteration: 'Mujhe bhi bohat acha laga. Phir milain gay.',
          english: 'I also enjoyed it. See you again.'
        }
      ],
      culturalNote: 'In Indian culture, asking about someone\'s city and profession is a common way to start a conversation. The phrase "aap se mil kar khushi hui" is the standard polite way to end a first meeting.'
    },
    {
      id: 4,
      title: 'At Home with Family',
      titleUrdu: 'گھر میں خاندان کے ساتھ',
      setting: 'A warm family home during dinner time. You are visiting a Indian family.',
      context: 'You are a guest at a Indian home. Learn how to compliment food, ask for seconds, and express gratitude.',
      icon: '🏠',
      imageClass: 'scene-family',
      vocabulary: [
        { urdu: 'مزیدار', transliteration: 'Mazedar', english: 'Delicious' },
        { urdu: 'بھوک', transliteration: 'Bhook', english: 'Hunger' },
        { urdu: 'پیٹ', transliteration: 'Pait', english: 'Stomach' },
        { urdu: 'اور', transliteration: 'Aur', english: 'More' },
        { urdu: 'بہت', transliteration: 'Bohat', english: 'Very/Much' },
        { urdu: 'مہمان', transliteration: 'Mehmaan', english: 'Guest' }
      ],
      dialogue: [
        {
          speaker: 'host',
          speakerLabel: 'Host Mother',
          urdu: 'آئیے، کھانا تیار ہے۔ بیٹھ جائیں۔',
          transliteration: 'Aayiye, khana tayyar hai. Baith jayein.',
          english: 'Come, food is ready. Please sit down.'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'بہت شکریہ۔ بہت اچھا لگ رہا ہے۔',
          transliteration: 'Bohat shukriya. Bohat acha lag raha hai.',
          english: 'Thank you very much. It looks very good.'
        },
        {
          speaker: 'host',
          speakerLabel: 'Host Mother',
          urdu: 'کیا آپ کو بھوک لگی ہے؟',
          transliteration: 'Kya aap ko bhook lagi hai?',
          english: 'Are you hungry?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'جی، تھوڑی بھوک ہے۔',
          transliteration: 'Jee, thori bhook hai.',
          english: 'Yes, I am a little hungry.'
        },
        {
          speaker: 'host',
          speakerLabel: 'Host Mother',
          urdu: 'یہ چکن بریانی ہے۔ پسند آئے گی آپ کو۔',
          transliteration: 'Yeh chicken biryani hai. Pasand aaye gi aap ko.',
          english: 'This is chicken biryani. You will like it.'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'واہ! بہت مزیدار ہے۔',
          transliteration: 'Wah! Bohat mazedar hai.',
          english: 'Wow! It is very delicious.'
        },
        {
          speaker: 'host',
          speakerLabel: 'Host Mother',
          urdu: 'تھوڑا اور لیں نا۔',
          transliteration: 'Thora aur lain na.',
          english: 'Please take a little more.'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'جی، تھوڑا سا اور دے دیں۔',
          transliteration: 'Jee, thora sa aur day dein.',
          english: 'Yes, please give a little more.'
        },
        {
          speaker: 'host',
          speakerLabel: 'Host Mother',
          urdu: 'کیا میٹھا پسند کریں گے؟',
          transliteration: 'Kya meetha pasand karein gay?',
          english: 'Would you like something sweet?'
        },
        {
          speaker: 'you',
          speakerLabel: 'You',
          urdu: 'جی نہیں، پیٹ بھر گیا ہے۔ بہت بہت شکریہ۔',
          transliteration: 'Jee nahi, pait bhar gaya hai. Bohat bohat shukriya.',
          english: 'No, I am full. Thank you so very much.'
        }
      ],
      culturalNote: 'In Indian culture, hosts will offer food multiple times. It is polite to accept seconds, and saying "bohat mazedar hai" (very delicious) is highly appreciated. Refusing food gently with "pait bhar gaya" is acceptable after having enough.'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  get activeScene(): Scene {
    return this.scenes[this.activeSceneIndex];
  }

  get totalScenes(): number {
    return this.scenes.length;
  }

  get progressPercentage(): number {
    return Math.round(((this.activeSceneIndex + 1) / this.totalScenes) * 100);
  }

  nextScene(): void {
    if (this.activeSceneIndex < this.scenes.length - 1) {
      this.activeSceneIndex++;
      this.showTranslation = false;
    }
  }

  previousScene(): void {
    if (this.activeSceneIndex > 0) {
      this.activeSceneIndex--;
      this.showTranslation = false;
    }
  }

  goToScene(index: number): void {
    this.activeSceneIndex = index;
    this.showTranslation = false;
  }

  toggleTranslation(): void {
    this.showTranslation = !this.showTranslation;
  }

  speakLine(line: DialogueLine): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(line.urdu);
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

  speakVocabulary(word: VocabularyWord): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word.urdu);
      utterance.lang = 'ur-PK';
      utterance.rate = 0.7;
      
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
}