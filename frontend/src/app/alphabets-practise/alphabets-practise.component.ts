// lesson1-practice.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface PracticeQuestion {
  id: number;
  imageUrl: string;
  correctAnswer: string;
  wordUrdu: string;
  wordEnglish: string;
  options: string[];
}

@Component({
  selector: 'app-alphabets-practise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alphabets-practise.component.html',
  styleUrls: ['./alphabets-practise.component.scss']
})
export class AlphabetsPractiseComponent implements OnInit {
  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;
  showFeedback = false;
  isCorrect = false;
  score = 0;
  answeredQuestions: Set<number> = new Set();
  userAnswers: { [key: number]: string } = {};
  showResults = false;

  // Practice questions - 15 questions covering all learned letters
  questions: PracticeQuestion[] = [
    {
      id: 1,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'ا',
      wordUrdu: 'آم',
      wordEnglish: 'Mango',
      options: ['ا', 'ب', 'پ', 'ت']
    },
    {
      id: 2,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'ب',
      wordUrdu: 'بلی',
      wordEnglish: 'Cat',
      options: ['ا', 'ب', 'پ', 'ت']
    },
    {
      id: 3,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'پ',
      wordUrdu: 'پانی',
      wordEnglish: 'Water',
      options: ['پ', 'ت', 'ٹ', 'ب']
    },
    {
      id: 4,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'ت',
      wordUrdu: 'تارا',
      wordEnglish: 'Star',
      options: ['ت', 'ٹ', 'ث', 'ج']
    },
    {
      id: 5,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'ٹ',
      wordUrdu: 'ٹماٹر',
      wordEnglish: 'Tomato',
      options: ['ت', 'ٹ', 'ث', 'پ']
    },
    {
      id: 6,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'ج',
      wordUrdu: 'جھنڈا',
      wordEnglish: 'Flag',
      options: ['ج', 'چ', 'ح', 'خ']
    },
    {
      id: 7,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'چ',
      wordUrdu: 'چاند',
      wordEnglish: 'Moon',
      options: ['ج', 'چ', 'ح', 'ت']
    },
    {
      id: 8,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'ک',
      wordUrdu: 'کتاب',
      wordEnglish: 'Book',
      options: ['ک', 'گ', 'ق', 'ف']
    },
    {
      id: 9,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'گ',
      wordUrdu: 'گھر',
      wordEnglish: 'House',
      options: ['گ', 'ک', 'ق', 'غ']
    },
    {
      id: 10,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'پ',
      wordUrdu: 'پھول',
      wordEnglish: 'Flower',
      options: ['پ', 'ف', 'ب', 'ت']
    },
    {
      id: 11,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'د',
      wordUrdu: 'درخت',
      wordEnglish: 'Tree',
      options: ['د', 'ذ', 'ڈ', 'ر']
    },
    {
      id: 12,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'د',
      wordUrdu: 'دودھ',
      wordEnglish: 'Milk',
      options: ['د', 'ذ', 'ڈ', 'ر']
    },
    {
      id: 13,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'س',
      wordUrdu: 'سورج',
      wordEnglish: 'Sun',
      options: ['س', 'ش', 'ص', 'ث']
    },
    {
      id: 14,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'ہ',
      wordUrdu: 'ہاتھ',
      wordEnglish: 'Hand',
      options: ['ہ', 'ح', 'خ', 'ھ']
    },
    {
      id: 15,
      imageUrl: 'https://fastly.picsum.photos/id/1/200/300.jpg',
      correctAnswer: 'آ',
      wordUrdu: 'آنکھ',
      wordEnglish: 'Eye',
      options: ['ا', 'آ', 'ع', 'ہ']
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadProgress();
  }

  get currentQuestion(): PracticeQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  get progressPercentage(): number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  selectAnswer(answer: string) {
    if (this.showFeedback) return;
    this.selectedAnswer = answer;
  }

  submitAnswer() {
    if (!this.selectedAnswer || this.showFeedback) return;

    this.isCorrect = this.selectedAnswer === this.currentQuestion.correctAnswer;
    this.showFeedback = true;

    // Save answer
    this.userAnswers[this.currentQuestion.id] = this.selectedAnswer;

    // Update score if correct and not previously answered correctly
    if (this.isCorrect && !this.answeredQuestions.has(this.currentQuestion.id)) {
      this.score++;
      this.answeredQuestions.add(this.currentQuestion.id);
    }

    this.saveProgress();

    // Auto advance after 2 seconds
    setTimeout(() => {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.nextQuestion();
      } else {
        this.showResults = true;
      }
    }, 2000);
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.resetQuestionState();
      this.loadSavedAnswer();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.resetQuestionState();
      this.loadSavedAnswer();
    }
  }

  private resetQuestionState() {
    this.selectedAnswer = null;
    this.showFeedback = false;
    this.isCorrect = false;
  }

  private loadSavedAnswer() {
    const questionId = this.currentQuestion.id;
    if (this.userAnswers[questionId]) {
      this.selectedAnswer = this.userAnswers[questionId];
    }
  }

  private saveProgress() {
    const progress = {
      currentIndex: this.currentQuestionIndex,
      score: this.score,
      userAnswers: this.userAnswers,
      answeredQuestions: Array.from(this.answeredQuestions)
    };
    sessionStorage.setItem('lesson1PracticeProgress', JSON.stringify(progress));
  }

  private loadProgress() {
    const saved = sessionStorage.getItem('lesson1PracticeProgress');
    if (saved) {
      const progress = JSON.parse(saved);
      this.currentQuestionIndex = progress.currentIndex || 0;
      this.score = progress.score || 0;
      this.userAnswers = progress.userAnswers || {};
      this.answeredQuestions = new Set(progress.answeredQuestions || []);
      this.loadSavedAnswer();
    }
  }

  resetPractice() {
    if (confirm('Are you sure you want to reset your practice progress?')) {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.userAnswers = {};
      this.answeredQuestions.clear();
      this.showResults = false;
      this.resetQuestionState();
      sessionStorage.removeItem('lesson1PracticeProgress');
    }
  }

  goToLesson() {
    this.router.navigate(['/alphabets']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  getScorePercentage(): number {
    return Math.round((this.score / this.questions.length) * 100);
  }

  getScoreRating(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 90) return 'Excellent! 🎉';
    if (percentage >= 75) return 'Great Job! 👍';
    if (percentage >= 60) return 'Good! 😊';
    if (percentage >= 40) return 'Keep Practicing! 💪';
    return 'Try Again! 🔄';
  }

  retryPractice() {
    this.resetPractice();
  }
}