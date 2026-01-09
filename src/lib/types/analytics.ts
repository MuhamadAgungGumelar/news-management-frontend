import { ArticleCategory, Article } from './article';

export interface CategoryDistribution {
  category: ArticleCategory;
  count: number;
  percentage: number;
}

export interface TimelineData {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface AnalyticsSummary {
  totalArticles: number;
  totalCategories: number;
  topCategory: {
    name: ArticleCategory;
    count: number;
  };
  latestArticle: Article | null;
  lastSyncAt: string | null;
  dateRange: {
    from: string;
    to: string;
  };
}
