import { type ClassValue, clsx } from "clsx";

// Utility function for conditional class names (similar to clsx but simpler)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format user display name
export function formatUserName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Format error message for display
export function formatErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred. Please try again.';
}

// Check if token is expired
export function isTokenExpired(expirationTime: number): boolean {
  return Date.now() >= expirationTime * 1000;
}

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'auth_user',
  TOKEN_EXPIRES: 'token_expires',
} as const;