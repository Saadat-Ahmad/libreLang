import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Phrase {
  id: number;
  urdu: string;
  transliteration: string;
  english: string;
  literal: string;
  usage: string;
  response?: {
    urdu: string;
    transliteration: string;
    english: string;
  };
}

@Component({
  selector: 'app-lesson-3',
  templateUrl: './lesson-3.component.html',
  styleUrls: ['./lesson-3.component.scss']
})
export class Lesson3Component {
  constructor(private router: Router) {}
  expandedId: number | null = null;
  showAnswer = false;
  showAnswer2 = false;

  phrases: Phrase[] = [
    {
      id: 1,
      urdu: 'آپ کیسے ہیں؟',
      transliteration: 'Aap kaise hain?',
      english: 'How are you?',
      literal: 'You how are?',
      usage: 'A polite way to ask someone how they are. Use "Aap" for respect with elders, strangers, or in formal settings.',
      response: {
        urdu: 'میں ٹھیک ہوں، شکریہ',
        transliteration: 'Main theek hoon, shukriya',
        english: 'I am fine, thank you'
      }
    },
    {
      id: 2,
      urdu: 'میرا نام ۔۔۔ ہے',
      transliteration: 'Mera naam ... hai',
      english: 'My name is ...',
      literal: 'My name ... is',
      usage: 'Introduce yourself by inserting your name. The word order is different from English - the name comes before "hai" (is).'
    },
    {
      id: 3,
      urdu: 'آپ کا نام کیا ہے؟',
      transliteration: 'Aap ka naam kya hai?',
      english: 'What is your name?',
      literal: 'Your name what is?',
      usage: 'A polite way to ask someone\'s name. Notice how "Aap ka" means "your" (respectful form).',
      response: {
        urdu: 'میرا نام علی ہے',
        transliteration: 'Mera naam Ali hai',
        english: 'My name is Ali'
      }
    },
    {
      id: 4,
      urdu: 'شکریہ',
      transliteration: 'Shukriya',
      english: 'Thank you',
      literal: 'Thanks/Gratitude',
      usage: 'The most common way to say thank you. Can be used in both formal and informal situations.',
      response: {
        urdu: 'کوئی بات نہیں',
        transliteration: 'Koi baat nahi',
        english: 'You\'re welcome / It\'s nothing'
      }
    },
    {
      id: 5,
      urdu: 'جی ہاں / جی نہیں',
      transliteration: 'Jee haan / Jee nahi',
      english: 'Yes / No (respectful)',
      literal: 'Respect-yes / Respect-no',
      usage: 'Adding "Jee" before haan (yes) or nahi (no) makes your response polite and respectful. Use with elders or in formal situations.'
    },
    {
      id: 8,
      urdu: 'آپ کا دن اچھا گزرے',
      transliteration: 'Aap ka din acha guzray',
      english: 'Have a nice day',
      literal: 'Your day good may pass',
      usage: 'A warm, polite farewell wish. "Guzray" means "may it pass" - expressing hope for their day ahead.',
      response: {
        urdu: 'آپ کا بھی',
        transliteration: 'Aap ka bhi',
        english: 'Yours too'
      }
    },
    {
        id: 6,
        urdu: 'میں علیغرہ میں رہتا ہوں',
        transliteration: 'Mein Aligarh mein rahta hoon',
        english: 'I live in Aligarh',
        literal: 'I live in Aligarh',
        usage: 'To introduce yourself and where you live. "Mein" means "I" and "Aligarh mein rahta hoon" means "live in Aligarh".',
        response: {
            urdu: 'میں دلھی میں رہتا ہوں',
            transliteration: 'Achha, Mein Delhi mein rahta hoon',
            english: 'I live in Delhi'
        }
    }
  ];

  toggleCard(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  speak(text: string, event: Event): void {
    event.stopPropagation();
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ur-PK';
      utterance.rate = 0.85;
      utterance.pitch = 1;
      
      // Try to find a Urdu voice
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
  navigateToPractise(): void {
    this.router.navigateByUrl('/practise-3');
  }
}