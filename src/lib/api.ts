import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { LoginRequest, SignUpRequest, LoginResponse, User, ApiError } from './types';
import { STORAGE_KEYS } from './utils';

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (config) => {
      const token = Cookies.get(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid - clear auth data
        clearAuthData();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

// Clear authentication data from storage
const clearAuthData = (): void => {
  Cookies.remove(STORAGE_KEYS.TOKEN);
  Cookies.remove(STORAGE_KEYS.REFRESH_TOKEN);
  Cookies.remove(STORAGE_KEYS.USER);
  Cookies.remove(STORAGE_KEYS.TOKEN_EXPIRES);
};

// Save authentication data to storage
const saveAuthData = (loginResponse: LoginResponse): void => {
  const expiresAt = Date.now() + (loginResponse.expiresIn * 1000);
  
  Cookies.set(STORAGE_KEYS.TOKEN, loginResponse.token, { 
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  Cookies.set(STORAGE_KEYS.REFRESH_TOKEN, loginResponse.refreshToken, { 
    expires: 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  Cookies.set(STORAGE_KEYS.USER, JSON.stringify(loginResponse.user), { 
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  Cookies.set(STORAGE_KEYS.TOKEN_EXPIRES, expiresAt.toString(), { 
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

// Get stored user data
const getStoredUser = (): User | null => {
  try {
    const userStr = Cookies.get(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Get stored token
const getStoredToken = (): string | null => {
  return Cookies.get(STORAGE_KEYS.TOKEN) || null;
};

// Authentication API functions
export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await apiClient.post(
        '/auth/login',
        credentials
      );
      
      // Save auth data to storage
      saveAuthData(response.data);
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    }
  },

  // Sign up user
  async signUp(userData: SignUpRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await apiClient.post(
        '/auth/register',
        userData
      );
      
      // Save auth data to storage (auto-login after signup)
      saveAuthData(response.data);
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      clearAuthData();
    }
  },

  // Refresh token
  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = Cookies.get(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response: AxiosResponse<LoginResponse> = await apiClient.post(
        '/auth/refresh',
        { refreshToken }
      );

      saveAuthData(response.data);
      return response.data;
    } catch (error: any) {
      clearAuthData();
      throw new Error(
        error.response?.data?.message || 'Failed to refresh token'
      );
    }
  },

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get user profile'
      );
    }
  },

  // Verify token validity
  async verifyToken(): Promise<boolean> {
    try {
      await apiClient.get('/auth/verify');
      return true;
    } catch {
      return false;
    }
  },
};

// Export utility functions
export { getStoredUser, getStoredToken, clearAuthData };

// Export configured axios instance for other API calls
export { apiClient };