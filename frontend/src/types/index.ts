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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
