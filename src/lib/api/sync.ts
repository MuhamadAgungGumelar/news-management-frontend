import apiClient from './client';
import { SyncResult, ApiResponse, PaginatedResponse } from '../types/api';

export interface SyncParams {
  categories?: string[];
  country?: string;
  pageSize?: number;
}

export interface SyncStatus {
  isRunning: boolean;
  lastSync: {
    syncedAt: string;
    syncedCount: number;
    status: string;
  } | null;
  canSync: boolean;
  cooldownRemaining: number;
}

export interface SyncLog {
  id: string;
  status: 'success' | 'partial' | 'failed';
  syncedCount: number;
  updatedCount: number;
  skippedCount: number;
  startedAt: string;
  completedAt: string;
  duration: number;
  triggeredBy: {
    id: string;
    name: string;
  };
}

export const syncApi = {
  syncArticles: async (params?: SyncParams): Promise<ApiResponse<SyncResult>> => {
    const response = await apiClient.post('/sync', params || {});
    return response.data;
  },

  getSyncStatus: async (): Promise<ApiResponse<SyncStatus>> => {
    const response = await apiClient.get('/sync/status');
    return response.data;
  },

  getSyncLogs: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<SyncLog>> => {
    const response = await apiClient.get('/sync/logs', { params });
    return response.data;
  },
};
