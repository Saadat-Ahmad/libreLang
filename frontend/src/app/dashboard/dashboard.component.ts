import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface Lesson {
  urdu: string;
  english: string;
  route: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  completed: boolean;
}

interface CommunityGroup {
  id: number;
  name: string;
  nameUrdu: string;
  icon: string;
  membersCount: number;
  postsCount: number;
  category: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  type: string;
  icon: string;
  points: number;
  timeLeft: string;
  participants: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName = 'Ahmed';
  userLevel = 4;
  userPoints = 1250;
  streakDays = 7;
  
  lessons: Lesson[] = [
    { 
      urdu: 'حروفِ تہجی', 
      english: 'Alphabets', 
      route: 'lesson-1',
      icon: '🔤',
      difficulty: 'beginner',
      progress: 100,
      completed: true
    },
    { 
      urdu: 'الفاظ', 
      english: 'Words', 
      route: 'lesson-2',
      icon: '📝',
      difficulty: 'beginner',
      progress: 100,
      completed: true
    },
    { 
      urdu: 'جملہ', 
      english: 'Sentence', 
      route: 'lesson-3',
      icon: '✍️',
      difficulty: 'beginner',
      progress: 75,
      completed: false
    },
    { 
      urdu: 'محاورہ', 
      english: 'Conversation', 
      route: 'lesson-4',
      icon: '🏃',
      difficulty: 'intermediate',
      progress: 30,
      completed: false
    },
    { 
      urdu: 'گرامر', 
      english: 'Grammar', 
      route: 'lesson-5',
      icon: '💬',
      difficulty: 'intermediate',
      progress: 0,
      completed: false
    },
    { 
      urdu: 'محاورے', 
      english: 'Idioms', 
      route: 'lesson-6',
      icon: '🎯',
      difficulty: 'advanced',
      progress: 0,
      completed: false
    },
    { 
      urdu: 'گرامر', 
      english: 'Grammar', 
      route: 'lesson-7',
      icon: '📖',
      difficulty: 'intermediate',
      progress: 0,
      completed: false
    },
    { 
      urdu: 'مطالعہ', 
      english: 'Reading', 
      route: 'lesson-8',
      icon: '📚',
      difficulty: 'advanced',
      progress: 0,
      completed: false
    },
    { 
      urdu: 'مکالمہ', 
      english: 'Conversation', 
      route: 'lesson-9',
      icon: '🗣️',
      difficulty: 'advanced',
      progress: 0,
      completed: false
    },
    { 
      urdu: 'تحریر', 
      english: 'Writing', 
      route: 'lesson-10',
      icon: '🖊️',
      difficulty: 'advanced',
      progress: 0,
      completed: false
    }
  ];

  communityGroups: CommunityGroup[] = [
    {
      id: 1,
      name: 'Urdu Poetry Circle',
      nameUrdu: 'اردو شاعری حلقہ',
      icon: '📝',
      membersCount: 2340,
      postsCount: 456,
      category: 'poetry'
    },
    {
      id: 2,
      name: 'Afsana Aur Kahaniyan',
      nameUrdu: 'افسانہ اور کہانیاں',
      icon: '📖',
      membersCount: 1890,
      postsCount: 320,
      category: 'stories'
    },
    {
      id: 3,
      name: 'Socio-Political Discourse',
      nameUrdu: 'سماجی و سیاسی مباحث',
      icon: '🗣️',
      membersCount: 1560,
      postsCount: 678,
      category: 'politics'
    },
    {
      id: 4,
      name: 'Learn Urdu Together',
      nameUrdu: 'مل کر اردو سیکھیں',
      icon: '📚',
      membersCount: 4230,
      postsCount: 1234,
      category: 'language'
    }
  ];

  dailyChallenges: Challenge[] = [
    {
      id: 1,
      title: 'Translate This Phrase',
      description: 'Translate "Good morning, how are you?" to Urdu',
      type: 'translate',
      icon: '🔄',
      points: 50,
      timeLeft: '12:45',
      participants: 234
    },
    {
      id: 2,
      title: 'Vocabulary Quiz',
      description: 'Match 10 Urdu words with their English meanings',
      type: 'vocabulary',
      icon: '📚',
      points: 75,
      timeLeft: '08:30',
      participants: 156
    },
    {
      id: 3,
      title: 'Pronunciation Practice',
      description: 'Record yourself saying 5 common Urdu phrases',
      type: 'pronounce',
      icon: '🎤',
      points: 100,
      timeLeft: '16:20',
      participants: 89
    }
  ];

  constructor(public router: Router) {}

  ngOnInit(): void {}

  getCompletedLessonsCount(): number {
    return this.lessons.filter(l => l.completed).length;
  }

  getOverallProgress(): number {
    const total = this.lessons.length;
    const completed = this.getCompletedLessonsCount();
    return Math.round((completed / total) * 100);
  }

  getDifficultyColor(difficulty: string): string {
    switch(difficulty) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#666';
    }
  }

  openLesson(lesson: Lesson, index: number): void {
    this.router.navigateByUrl(`/${lesson.route}`);
  }

  openCommunity(): void {
    this.router.navigateByUrl('/community');
  }

  openGroup(groupId: number): void {
    this.router.navigateByUrl(`/community?group=${groupId}`);
  }

  openChallenges(): void {
    this.router.navigateByUrl('/daily-challenge');
  }

  startChallenge(challengeId: number): void {
    this.router.navigateByUrl(`/daily-challenge?challenge=${challengeId}`);
  }

  continueLearning(): void {
    const nextLesson = this.lessons.find(l => !l.completed);
    if (nextLesson) {
      const index = this.lessons.indexOf(nextLesson);
      this.openLesson(nextLesson, index);
    }
  }
}