import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DailyChallengeService, Challenge, UserStats, LeaderboardEntry, DailyProgress } from '../../services/daily-challenge.service';
import { Subscription, interval } from 'rxjs';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-daily-challenge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-challenge.component.html',
  styleUrls: ['./daily-challenge.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pulse', [
      transition('* => *', [
        animate('0.5s ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class DailyChallengeComponent implements OnInit, OnDestroy {
  challenges: Challenge[] = [];
  userStats: UserStats | null = null;
  leaderboard: LeaderboardEntry[] = [];
  activeChallengeId: number | null = null;
  selectedAnswer: string = '';
  timeLeft: number = 0;
  activeTab: 'challenges' | 'leaderboard' | 'stats' = 'challenges';
  
  private subscriptions: Subscription[] = [];

  constructor(private challengeService: DailyChallengeService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.challengeService.getChallenges().subscribe(challenges => {
        this.challenges = challenges;
      }),
      this.challengeService.getUserStats().subscribe(stats => {
        this.userStats = stats;
      }),
      this.challengeService.getLeaderboard().subscribe(leaderboard => {
        this.leaderboard = leaderboard;
      }),
      this.challengeService.getTimeLeft().subscribe(time => {
        this.timeLeft = time;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectChallenge(challengeId: number): void {
    this.activeChallengeId = challengeId;
    this.selectedAnswer = '';
    this.challengeService.startChallenge(challengeId);
  }

  selectAnswer(answer: string): void {
    this.selectedAnswer = answer;
  }

  submitChallenge(): void {
    if (this.activeChallengeId && this.selectedAnswer) {
      this.challengeService.submitAnswer(this.activeChallengeId, this.selectedAnswer);
      this.activeChallengeId = null;
      this.selectedAnswer = '';
    }
  }

  getActiveChallenge(): Challenge | undefined {
    return this.challenges.find(c => c.id === this.activeChallengeId);
  }

  getCompletedCount(): number {
    return this.challenges.filter(c => c.completed).length;
  }

  getTotalPoints(): number {
    return this.challenges.reduce((sum, c) => sum + (c.score || 0), 0);
  }

  getFormattedTime(): string {
    return this.challengeService.getFormattedTime(this.timeLeft);
  }

  getDifficultyColor(difficulty: string): string {
    return this.challengeService.getDifficultyColor(difficulty);
  }

  getChallengeTypeIcon(type: string): string {
    return this.challengeService.getChallengeTypeIcon(type);
  }

  getXPMultiplier(): number {
    return this.userStats ? this.challengeService.getXPMultiplier(this.userStats.currentStreak) : 1;
  }

  getProgressPercentage(): number {
    if (this.challenges.length === 0) return 0;
    return Math.round((this.getCompletedCount() / this.challenges.length) * 100);
  }

  getTodayProgress(): DailyProgress | undefined {
    if (!this.userStats) return undefined;
    const today = new Date().toISOString().split('T')[0];
    return this.userStats.weeklyProgress.find(p => p.date === today);
  }

  switchTab(tab: 'challenges' | 'leaderboard' | 'stats'): void {
    this.activeTab = tab;
  }
}