import apiClient from './client';
import { CategoryDistribution, TimelineData, AnalyticsSummary } from '../types/analytics';
import { ApiResponse } from '../types/api';

export const analyticsApi = {
  getCategoryDistribution: async (params: {
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<CategoryDistribution[]>> => {
    const response = await apiClient.get('/analytics/category-distribution', { params });
    return response.data;
  },

  getTimeline: async (params: {
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<TimelineData[]>> => {
    const response = await apiClient.get('/analytics/timeline', { params });
    return response.data;
  },

  getSummary: async (params: {
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<AnalyticsSummary>> => {
    const response = await apiClient.get('/analytics/summary', { params });
    return response.data;
  },
};
