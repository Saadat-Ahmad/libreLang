import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommunityService, Group, Post, User } from '../../services/community.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerList', [
      transition(':enter', [
        query('.group-card, .post-card', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger(80, [
            animate('0.35s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class CommunityComponent implements OnInit, OnDestroy {
  groups: Group[] = [];
  posts: Post[] = [];
  currentUser: User;
  selectedGroupId: number | null = null;
  selectedGroup: Group | null = null;
  activeTab: 'groups' | 'posts' = 'groups';
  showCreatePost = false;
  
  newPost = {
    groupId: 0,
    title: '',
    content: '',
    type: 'discussion' as 'poetry' | 'discussion' | 'question' | 'resource',
    tags: [] as string[]
  };

  newTag = '';
  
  private subscriptions: Subscription[] = [];

  constructor(private communityService: CommunityService) {
    this.currentUser = this.communityService.getCurrentUser();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.communityService.getGroups().subscribe(groups => {
        this.groups = groups;
      }),
      this.communityService.getPosts().subscribe(posts => {
        this.posts = posts;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Computed properties for template
  get totalMembers(): number {
    let total = 0;
    for (const group of this.groups) {
      total += group.membersCount;
    }
    return total;
  }

  get totalPosts(): number {
    return this.posts.length;
  }

  get filteredPosts(): Post[] {
    if (this.selectedGroupId) {
      return this.posts.filter(post => post.groupId === this.selectedGroupId);
    }
    return this.posts;
  }

  get groupsByCategory(): { category: string; categoryName: string; groups: Group[] }[] {
    const categoryMap = new Map<string, Group[]>();
    const categoryNames: { [key: string]: string } = {
      poetry: 'Poetry & Shayari',
      stories: 'Stories & Fiction',
      politics: 'Socio-Political',
      culture: 'Culture & Literature',
      language: 'Language Learning'
    };

    for (const group of this.groups) {
      const existing = categoryMap.get(group.category) || [];
      existing.push(group);
      categoryMap.set(group.category, existing);
    }

    const result: { category: string; categoryName: string; groups: Group[] }[] = [];
    categoryMap.forEach((groups, category) => {
      result.push({
        category,
        categoryName: categoryNames[category] || category,
        groups
      });
    });

    return result;
  }

  get trendingPosts(): Post[] {
    const sortedPosts = [...this.posts].sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes;
      const scoreB = b.upvotes - b.downvotes;
      return scoreB - scoreA;
    });
    return sortedPosts.slice(0, 5);
  }

  // Group methods
  selectGroup(group: Group): void {
    this.selectedGroupId = group.id;
    this.selectedGroup = group;
    this.activeTab = 'posts';
  }

  toggleJoinGroup(groupId: number, event: Event): void {
    event.stopPropagation();
    this.communityService.toggleJoinGroup(groupId);
  }

  getGroupById(groupId: number): Group | undefined {
    return this.groups.find(group => group.id === groupId);
  }

  getCategoryName(category: string): string {
    const names: { [key: string]: string } = {
      poetry: 'Poetry & Shayari',
      stories: 'Stories & Fiction',
      politics: 'Socio-Political',
      culture: 'Culture & Literature',
      language: 'Language Learning'
    };
    return names[category] || category;
  }

  // Post methods
  votePost(postId: number, voteType: 'up' | 'down', event: Event): void {
    event.stopPropagation();
    this.communityService.votePost(postId, voteType);
  }

  getVoteCount(post: Post): number {
    return post.upvotes - post.downvotes;
  }

  getPostTypeIcon(type: string): string {
    switch(type) {
      case 'poetry': return '📝';
      case 'discussion': return '💭';
      case 'question': return '❓';
      case 'resource': return '📚';
      default: return '📄';
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return postDate.toLocaleDateString();
  }

  // Create post methods
  openCreatePost(groupId?: number): void {
    this.showCreatePost = true;
    this.newPost.groupId = groupId || this.selectedGroupId || 0;
  }

  closeCreatePost(): void {
    this.showCreatePost = false;
    this.newPost = {
      groupId: 0,
      title: '',
      content: '',
      type: 'discussion',
      tags: []
    };
    this.newTag = '';
  }

  addTag(): void {
    const tag = this.newTag.trim();
    if (tag && !this.newPost.tags.includes(tag)) {
      this.newPost.tags.push(tag);
      this.newTag = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.newPost.tags.indexOf(tag);
    if (index > -1) {
      this.newPost.tags.splice(index, 1);
    }
  }

  submitPost(): void {
    if (!this.newPost.title.trim() || !this.newPost.content.trim() || !this.newPost.groupId) {
      return;
    }

    this.communityService.createPost({
      groupId: this.newPost.groupId,
      author: this.currentUser,
      title: this.newPost.title.trim(),
      content: this.newPost.content.trim(),
      type: this.newPost.type,
      tags: [...this.newPost.tags]
    });

    this.closeCreatePost();
  }

  // Tab methods
  switchTab(tab: 'groups' | 'posts'): void {
    this.activeTab = tab;
    if (tab === 'groups') {
      this.selectedGroupId = null;
      this.selectedGroup = null;
    }
  }

  goBackToGroups(): void {
    this.activeTab = 'groups';
    this.selectedGroupId = null;
    this.selectedGroup = null;
  }

  // Check if user has joined a group
  isGroupJoined(groupId: number): boolean {
    const group = this.groups.find(g => g.id === groupId);
    return group ? group.isJoined : false;
  }
}