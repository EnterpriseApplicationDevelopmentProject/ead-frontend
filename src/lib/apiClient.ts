import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Create single axios instance with default config
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // Don't set default Content-Type here - let it be set per request
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set Content-Type based on request data
    if (config.data instanceof FormData) {
      // Don't set Content-Type for FormData - browser will set it with boundary
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      // Set to application/json for regular requests
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: async <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get(endpoint, config);
    return response.data;
  },

  post: async <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.post(endpoint, data, config);
    return response.data;
  },

  put: async <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.put(endpoint, data, config);
    return response.data;
  },

  patch: async <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.patch(endpoint, data, config);
    return response.data;
  },

  delete: async <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete(endpoint, config);
    return response.data;
  },
};

export default api;
