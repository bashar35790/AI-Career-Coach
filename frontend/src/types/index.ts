export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface Item {
  _id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  category: string;
  image?: string;
  rating: number;
  createdBy: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Skill {
  _id: string;
  userId: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  createdAt: string;
}

export interface Resume {
  _id: string;
  userId: string;
  content: string;
  fileUrl?: string;
  aiScore?: number;
  suggestions?: string[];
  createdAt: string;
}

export interface UserProfile {
  user: AuthUser & { role: string; createdAt: string };
  skills: Skill[];
  resume: Resume | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
