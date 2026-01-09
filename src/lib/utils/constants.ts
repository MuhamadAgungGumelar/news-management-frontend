import { ArticleCategory } from '../types/article';

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  business: 'bg-blue-500',
  technology: 'bg-purple-500',
  sports: 'bg-green-500',
  entertainment: 'bg-amber-500',
  health: 'bg-red-500',
  science: 'bg-cyan-500',
} as const;

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  business: 'Business',
  technology: 'Technology',
  sports: 'Sports',
  entertainment: 'Entertainment',
  health: 'Health',
  science: 'Science',
} as const;

export const CHART_COLORS: Record<ArticleCategory, string> = {
  business: '#3b82f6',
  technology: '#8b5cf6',
  sports: '#22c55e',
  entertainment: '#f59e0b',
  health: '#ef4444',
  science: '#06b6d4',
} as const;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 25;
