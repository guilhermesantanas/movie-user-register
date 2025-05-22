
export interface ForumTopic {
  id: number;
  title: string;
  author: string;
  authorType: 'user' | 'moderator' | 'admin';
  replies: number;
  lastActivity: string;
  isPinned: boolean;
  isRules?: boolean;
  avatar_url?: string;
  category?: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  topics: ForumTopic[];
}

export interface OnlineUser {
  id: number;
  name: string;
  avatar_url?: string;
  userType: 'user' | 'moderator' | 'admin';
  lastActive: string;
}

export interface RecentPost {
  id: number;
  content: string;
  author: string;
  avatar_url?: string;
  topic: string;
  timestamp: string;
}
