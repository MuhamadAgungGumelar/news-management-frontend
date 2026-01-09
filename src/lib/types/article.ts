export interface Article {
  id: string;
  apiId: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  imageUrl: string | null;
  source: string | null;
  author: string | null;
  category: ArticleCategory;
  publishedAt: string; // ISO date
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ArticleCategory =
  | "business"
  | "technology"
  | "sports"
  | "entertainment"
  | "health"
  | "science";

export interface CreateArticleDto {
  title: string;
  description?: string;
  content?: string;
  url: string;
  imageUrl?: string;
  source?: string;
  author?: string;
  category: ArticleCategory;
  publishedAt: string;
}

export type UpdateArticleDto = Partial<CreateArticleDto>;

export interface ArticleFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  source?: string;
  author?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  dateFrom?: string;
  dateTo?: string;
}
