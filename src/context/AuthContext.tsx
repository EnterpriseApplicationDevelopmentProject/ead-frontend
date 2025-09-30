'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType, LoginRequest, SignUpRequest } from '@/lib/types';
import { authApi, getStoredUser, getStoredToken, clearAuthData } from '@/lib/api';
import { isTokenExpired, STORAGE_KEYS } from '@/lib/utils';
import Cookies from 'js-cookie';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();
        const tokenExpires = Cookies.get(STORAGE_KEYS.TOKEN_EXPIRES);

        if (storedToken && storedUser && tokenExpires) {
          // Check if token is expired
          if (isTokenExpired(parseInt(tokenExpires))) {
            // Try to refresh token
            try {
              await authApi.refreshToken();
              const newToken = getStoredToken();
              const newUser = getStoredUser();
              setToken(newToken);
              setUser(newUser);
            } catch {
              // Refresh failed, clear auth data
              clearAuthData();
              setToken(null);
              setUser(null);
            }
          } else {
            // Token is still valid
            setToken(storedToken);
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: SignUpRequest): Promise<void> => {
    try {
      setLoading(true);
      const response = await authApi.signUp(userData);
      
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setLoading(false);
      
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  const isAuthenticated = !!(user && token);

  const contextValue: AuthContextType = {
    user,
    token,
    loading,
    login,
    signUp,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};