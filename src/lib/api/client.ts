import axios, { AxiosError } from 'axios';
import useLoadingStore from '@/store/loadingStore';

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Use JWT Bearer token, not cookies
});

// Request interceptor - add JWT token and start loading
apiClient.interceptors.request.use(
  (config) => {
    // Start global loading
    if (typeof window !== 'undefined') {
      useLoadingStore.getState().startLoading();

      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Stop loading on request error
    if (typeof window !== 'undefined') {
      useLoadingStore.getState().stopLoading();
    }
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and stop loading
apiClient.interceptors.response.use(
  (response) => {
    // Stop loading on successful response
    if (typeof window !== 'undefined') {
      useLoadingStore.getState().stopLoading();
    }
    return response;
  },
  (error: AxiosError) => {
    // Stop loading on error response
    if (typeof window !== 'undefined') {
      useLoadingStore.getState().stopLoading();
    }

    // Only handle 401 for auto logout
    // Other errors should be handled by the calling code
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Clear zustand persisted auth state
        localStorage.removeItem('news-auth-storage');
        // Redirect to login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Log errors for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
