export interface User {
  id: number;
  username: string;
  email: string;
  displayName?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Entry {
  id: number;
  userId: number;
  date: string; // YYYY-MM-DD
  content: string;
  title?: string;
  mood?: number; // 1-5
  tags: Tag[];
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
  userId: number;
}

export interface PaginatedResponse<T> {
  entries: T[];
  total: number;
  page: number;
  limit: number;
}

export interface MoodTrend {
  date: string;
  mood: number;
}

export interface Distribution {
  mood: number;
  count: number;
}

export interface TopTag {
  name: string;
  color?: string;
  count: number;
}

export interface Analytics {
  totalEntries: number;
  recentEntries: number;
  avgMood: number;
  streak: number;
  trends: MoodTrend[];
  distribution: Distribution[];
  topTags: TopTag[];
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface CreateEntryRequest {
  date: string;
  content: string;
  title?: string;
  mood?: number;
  tagIds?: number[];
}

export interface UpdateEntryRequest {
  content?: string;
  title?: string;
  mood?: number;
  tagIds?: number[];
}
