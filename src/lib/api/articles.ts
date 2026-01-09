import apiClient from './client';
import { Article, CreateArticleDto, UpdateArticleDto, ArticleFilters } from '../types/article';
import { PaginatedResponse, ApiResponse } from '../types/api';

export const articlesApi = {
  getArticles: async (params: ArticleFilters): Promise<PaginatedResponse<Article>> => {
    const response = await apiClient.get('/articles', { params });
    return response.data;
  },

  getArticle: async (id: string): Promise<ApiResponse<Article>> => {
    const response = await apiClient.get(`/articles/${id}`);
    return response.data;
  },

  createArticle: async (data: CreateArticleDto): Promise<ApiResponse<Article>> => {
    const response = await apiClient.post('/articles', data);
    return response.data;
  },

  updateArticle: async (id: string, data: UpdateArticleDto): Promise<ApiResponse<Article>> => {
    const response = await apiClient.put(`/articles/${id}`, data);
    return response.data;
  },

  deleteArticle: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/articles/${id}`);
    return response.data;
  },
};
