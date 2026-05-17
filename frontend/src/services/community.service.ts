import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  avatar: string;
  joinDate: Date;
}

export interface Post {
  id: number;
  groupId: number;
  author: User;
  title: string;
  content: string;
  type: 'poetry' | 'discussion' | 'question' | 'resource';
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  commentsCount: number;
  createdAt: Date;
  tags: string[];
}

export interface Group {
  id: number;
  name: string;
  nameUrdu: string;
  description: string;
  icon: string;
  coverImage: string;
  membersCount: number;
  postsCount: number;
  isJoined: boolean;
  category: 'poetry' | 'stories' | 'politics' | 'culture' | 'language';
}

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private currentUser: User = {
    id: 1,
    name: 'Ahmed Khan',
    avatar: 'assets/avatars/user1.jpg',
    joinDate: new Date('2024-01-15')
  };

  private groupsSubject = new BehaviorSubject<Group[]>([
    {
      id: 1,
      name: 'Urdu Poetry Circle',
      nameUrdu: 'اردو شاعری حلقہ',
      description: 'A community for Urdu poetry lovers. Share your poetry, discuss famous poets, and learn about different forms of Urdu poetry.',
      icon: '📝',
      coverImage: 'assets/covers/poetry.jpg',
      membersCount: 2340,
      postsCount: 456,
      isJoined: true,
      category: 'poetry'
    },
    {
      id: 2,
      name: 'Afsana Aur Kahaniyan',
      nameUrdu: 'افسانہ اور کہانیاں',
      description: 'Explore the world of Urdu short stories and narratives. Share your stories and discover new voices in Urdu fiction.',
      icon: '📖',
      coverImage: 'assets/covers/stories.jpg',
      membersCount: 1890,
      postsCount: 320,
      isJoined: true,
      category: 'stories'
    },
    {
      id: 3,
      name: 'Socio-Political Discourse',
      nameUrdu: 'سماجی و سیاسی مباحث',
      description: 'Discuss socio-political issues affecting Urdu-speaking communities. Share articles, opinions, and engage in meaningful debate.',
      icon: '🗣️',
      coverImage: 'assets/covers/politics.jpg',
      membersCount: 1560,
      postsCount: 678,
      isJoined: false,
      category: 'politics'
    },
    {
      id: 4,
      name: 'Urdu Adab Aur Culture',
      nameUrdu: 'اردو ادب اور ثقافت',
      description: 'Celebrate Urdu literature, culture, and traditions. Discuss classical works, contemporary writing, and cultural events.',
      icon: '🎭',
      coverImage: 'assets/covers/culture.jpg',
      membersCount: 3120,
      postsCount: 890,
      isJoined: false,
      category: 'culture'
    },
    {
      id: 5,
      name: 'Learn Urdu Together',
      nameUrdu: 'مل کر اردو سیکھیں',
      description: 'A supportive community for Urdu learners. Practice speaking, get feedback, and share learning resources.',
      icon: '📚',
      coverImage: 'assets/covers/language.jpg',
      membersCount: 4230,
      postsCount: 1234,
      isJoined: true,
      category: 'language'
    },
    {
      id: 6,
      name: 'Classical Literature',
      nameUrdu: 'کلاسیکی ادب',
      description: 'Dive deep into classical Urdu literature. Study Ghalib, Iqbal, Faiz, and other legendary poets and writers.',
      icon: '🏛️',
      coverImage: 'assets/covers/classical.jpg',
      membersCount: 980,
      postsCount: 234,
      isJoined: false,
      category: 'culture'
    }
  ]);

  private postsSubject = new BehaviorSubject<Post[]>([
    {
      id: 1,
      groupId: 1,
      author: {
        id: 2,
        name: 'Fatima Zaidi',
        avatar: 'assets/avatars/user2.jpg',
        joinDate: new Date('2023-06-20')
      },
      title: 'My Latest Ghazal - दिल की बात',
      content: 'دل में बसी है एक तस्वीर तेरी\nआँखों में है इक सपना तेरा\nसाँसों में घुली है खुशबू तेरी\nहर जगह है बस निशान तेरा',
      type: 'poetry',
      upvotes: 45,
      downvotes: 2,
      userVote: 'up',
      commentsCount: 12,
      createdAt: new Date('2024-01-20T10:30:00'),
      tags: ['ghazal', 'love', 'personal']
    },
    {
      id: 2,
      groupId: 1,
      author: {
        id: 3,
        name: 'Raza Ahmed',
        avatar: 'assets/avatars/user3.jpg',
        joinDate: new Date('2023-11-05')
      },
      title: 'Discussion: Modern Urdu Poetry vs Classical',
      content: 'What are your thoughts on the evolution of Urdu poetry? Do you prefer classical ghazals or modern nazm?',
      type: 'discussion',
      upvotes: 28,
      downvotes: 5,
      userVote: null,
      commentsCount: 34,
      createdAt: new Date('2024-01-21T14:15:00'),
      tags: ['discussion', 'modern-poetry', 'classical']
    },
    {
      id: 3,
      groupId: 2,
      author: {
        id: 4,
        name: 'Zainab Khalid',
        avatar: 'assets/avatars/user4.jpg',
        joinDate: new Date('2024-01-10')
      },
      title: 'Short Story: The Last Letter - آخری خط',
      content: 'ایک چھوٹی سی کہانی جو میں نے لکھی ہے۔ امید ہے آپ کو پسند آئے گی۔\n\nوہ خط جو کبھی بھیجا نہیں گیا...',
      type: 'resource',
      upvotes: 67,
      downvotes: 1,
      userVote: 'up',
      commentsCount: 23,
      createdAt: new Date('2024-01-22T09:00:00'),
      tags: ['short-story', 'fiction', 'emotional']
    },
    {
      id: 4,
      groupId: 3,
      author: {
        id: 5,
        name: 'Imran Shah',
        avatar: 'assets/avatars/user5.jpg',
        joinDate: new Date('2023-08-15')
      },
      title: 'The Role of Urdu in Modern Politics',
      content: 'How can we promote Urdu language in political discourse while maintaining inclusivity?',
      type: 'discussion',
      upvotes: 34,
      downvotes: 12,
      userVote: 'down',
      commentsCount: 56,
      createdAt: new Date('2024-01-22T16:45:00'),
      tags: ['politics', 'language-rights', 'education']
    },
    {
      id: 5,
      groupId: 5,
      author: {
        id: 6,
        name: 'Sarah Thomas',
        avatar: 'assets/avatars/user6.jpg',
        joinDate: new Date('2024-01-01')
      },
      title: 'Need Help: Understanding Urdu Script',
      content: 'I am a beginner learning Urdu. Can someone explain the difference between similar looking letters?',
      type: 'question',
      upvotes: 15,
      downvotes: 0,
      userVote: null,
      commentsCount: 28,
      createdAt: new Date('2024-01-23T11:20:00'),
      tags: ['learning', 'script', 'beginner']
    }
  ]);

  constructor() {}

  getGroups(): Observable<Group[]> {
    return this.groupsSubject.asObservable();
  }

  getPosts(): Observable<Post[]> {
    return this.postsSubject.asObservable();
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  getPostsByGroup(groupId: number): Post[] {
    return this.postsSubject.value.filter(post => post.groupId === groupId);
  }

  getGroupById(groupId: number): Group | undefined {
    return this.groupsSubject.value.find(group => group.id === groupId);
  }

  toggleJoinGroup(groupId: number): void {
    const groups = this.groupsSubject.value;
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex !== -1) {
      groups[groupIndex] = {
        ...groups[groupIndex],
        isJoined: !groups[groupIndex].isJoined,
        membersCount: groups[groupIndex].isJoined 
          ? groups[groupIndex].membersCount - 1 
          : groups[groupIndex].membersCount + 1
      };
      this.groupsSubject.next([...groups]);
    }
  }

  votePost(postId: number, voteType: 'up' | 'down'): void {
    const posts = this.postsSubject.value;
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
      const post = posts[postIndex];
      
      // Remove previous vote if exists
      if (post.userVote === 'up') {
        post.upvotes--;
      } else if (post.userVote === 'down') {
        post.downvotes--;
      }
      
      // Add new vote
      if (post.userVote === voteType) {
        // Un-vote
        post.userVote = null;
      } else {
        post.userVote = voteType;
        if (voteType === 'up') {
          post.upvotes++;
        } else {
          post.downvotes++;
        }
      }
      
      posts[postIndex] = { ...post };
      this.postsSubject.next([...posts]);
    }
  }

  createPost(post: Omit<Post, 'id' | 'upvotes' | 'downvotes' | 'userVote' | 'commentsCount' | 'createdAt'>): void {
    const newPost: Post = {
      ...post,
      id: this.postsSubject.value.length + 1,
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      commentsCount: 0,
      createdAt: new Date()
    };
    
    this.postsSubject.next([newPost, ...this.postsSubject.value]);
    
    // Update group post count
    const groups = this.groupsSubject.value;
    const groupIndex = groups.findIndex(g => g.id === post.groupId);
    if (groupIndex !== -1) {
      groups[groupIndex] = {
        ...groups[groupIndex],
        postsCount: groups[groupIndex].postsCount + 1
      };
      this.groupsSubject.next([...groups]);
    }
  }
}