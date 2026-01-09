import apiClient from './client';
import { User } from '../types/common';
import { ApiResponse } from '../types/api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  admin: User;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const authApi = {
  login: async (data: LoginDto): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  changePassword: async (data: ChangePasswordDto): Promise<ApiResponse<void>> => {
    const response = await apiClient.put('/auth/change-password', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
