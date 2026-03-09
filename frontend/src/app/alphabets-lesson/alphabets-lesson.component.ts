// alphabet-lesson.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface AlphabetCard {
  id: number;
  urduLetter: string;
  romanSyllables: string;
  audioUrl: string;
  exampleWord: {
    urdu: string;
    roman: string;
    english: string;
    imageUrl: string;
    audioUrl: string;
  };
}

@Component({
  selector: 'app-alphabet-lesson',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alphabets-lesson.component.html',
  styleUrls: ['./alphabets-lesson.component.scss']
})
export class AlphabetsLessonComponent implements OnInit {
  currentCardIndex = 0;
  isPlaying = false;
  currentAudio: HTMLAudioElement | null = null;

  // Urdu Alphabet Data (38 letters)
  alphabetCards: AlphabetCard[] = [
    {
      id: 1,
      urduLetter: 'ا',
      romanSyllables: 'alif (a / ā)',
      audioUrl: '/assets/audio/letters/alif.mp3',
      exampleWord: {
        urdu: 'آم',
        roman: 'aam',
        english: 'Mango',
        imageUrl: '/assets/images/words/mango.jpg',
        audioUrl: '/assets/audio/words/aam.mp3'
      }
    },
    {
      id: 2,
      urduLetter: 'ب',
      romanSyllables: 'be (b)',
      audioUrl: '/assets/audio/letters/be.mp3',
      exampleWord: {
        urdu: 'بلی',
        roman: 'bil-lee',
        english: 'Cat',
        imageUrl: '/assets/images/words/cat.jpg',
        audioUrl: '/assets/audio/words/billi.mp3'
      }
    },
    {
      id: 3,
      urduLetter: 'پ',
      romanSyllables: 'pe (p)',
      audioUrl: '/assets/audio/letters/pe.mp3',
      exampleWord: {
        urdu: 'پانی',
        roman: 'paa-nee',
        english: 'Water',
        imageUrl: '/assets/images/words/water.jpg',
        audioUrl: '/assets/audio/words/paani.mp3'
      }
    },
    {
      id: 4,
      urduLetter: 'ت',
      romanSyllables: 'te (t)',
      audioUrl: '/assets/audio/letters/te.mp3',
      exampleWord: {
        urdu: 'تارا',
        roman: 'taa-ra',
        english: 'Star',
        imageUrl: '/assets/images/words/star.jpg',
        audioUrl: '/assets/audio/words/taara.mp3'
      }
    },
    {
      id: 5,
      urduLetter: 'ٹ',
      romanSyllables: 'ṭe (ṭ)',
      audioUrl: '/assets/audio/letters/tte.mp3',
      exampleWord: {
        urdu: 'ٹماٹر',
        roman: 'ṭa-maa-ṭar',
        english: 'Tomato',
        imageUrl: '/assets/images/words/tomato.jpg',
        audioUrl: '/assets/audio/words/tamatar.mp3'
      }
    },
    // Add remaining 33 letters here...
    // For now, I'll add a few more for demonstration
    {
      id: 6,
      urduLetter: 'ث',
      romanSyllables: 'se (s)',
      audioUrl: '/assets/audio/letters/se.mp3',
      exampleWord: {
        urdu: 'ثواب',
        roman: 'sa-waab',
        english: 'Reward',
        imageUrl: '/assets/images/words/reward.jpg',
        audioUrl: '/assets/audio/words/sawaab.mp3'
      }
    },
    {
      id: 7,
      urduLetter: 'ج',
      romanSyllables: 'jeem (j)',
      audioUrl: '/assets/audio/letters/jeem.mp3',
      exampleWord: {
        urdu: 'جھنڈا',
        roman: 'jhan-da',
        english: 'Flag',
        imageUrl: '/assets/images/words/flag.jpg',
        audioUrl: '/assets/audio/words/jhanda.mp3'
      }
    },
    {
      id: 8,
      urduLetter: 'چ',
      romanSyllables: 'che (ch)',
      audioUrl: '/assets/audio/letters/che.mp3',
      exampleWord: {
        urdu: 'چاند',
        roman: 'chaand',
        english: 'Moon',
        imageUrl: '/assets/images/words/moon.jpg',
        audioUrl: '/assets/audio/words/chaand.mp3'
      }
    }
    // TODO: Add remaining 30 letters
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Restore progress if user came back from test
    const savedProgress = sessionStorage.getItem('alphabetLessonProgress');
    if (savedProgress) {
      this.currentCardIndex = parseInt(savedProgress, 10);
    }
  }

  get currentCard(): AlphabetCard {
    return this.alphabetCards[this.currentCardIndex];
  }

  get progressPercentage(): number {
    return ((this.currentCardIndex + 1) / this.alphabetCards.length) * 100;
  }

  nextCard() {
    if (this.currentCardIndex < this.alphabetCards.length - 1) {
      this.currentCardIndex++;
      this.saveProgress();
      this.stopAudio();
    }
  }

  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.saveProgress();
      this.stopAudio();
    }
  }

  goToCard(index: number) {
    this.currentCardIndex = index;
    this.saveProgress();
    this.stopAudio();
  }

  playLetterAudio() {
    this.playAudio(this.currentCard.audioUrl);
  }

  playWordAudio() {
    this.playAudio(this.currentCard.exampleWord.audioUrl);
  }

  private playAudio(url: string) {
    // Stop any currently playing audio
    this.stopAudio();

    // Create new audio instance
    this.currentAudio = new Audio(url);
    this.isPlaying = true;

    this.currentAudio.play().catch(error => {
      console.error('Error playing audio:', error);
      this.isPlaying = false;
    });

    this.currentAudio.onended = () => {
      this.isPlaying = false;
    };
  }

  private stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.isPlaying = false;
    }
  }

  private saveProgress() {
    sessionStorage.setItem('alphabetLessonProgress', this.currentCardIndex.toString());
  }

  goToTest() {
    this.saveProgress();
    this.stopAudio();
    this.router.navigate(['/lessons/alphabet/test']);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    this.stopAudio();
  }
}