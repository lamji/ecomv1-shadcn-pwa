'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/store';
import { showLoading, hideLoading } from '@/lib/features/loadingSlice';
import { useAppContext } from "plugandplay-react-query-hooks";

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setToken } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      dispatch(showLoading({ message: 'Logging out...' }));
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Clear token only after successful API call
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setToken(null); // Clear token from app context
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('auth-changed'));
        
        // Hide loader and redirect
        dispatch(hideLoading());
        router.push('/login');
      }
      
      
    } catch (error) {
      console.error('Logout API call failed:', error);
      
      // Still clear local state on error and redirect anyway
      localStorage.removeItem('auth_token');
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setToken(null);
      setIsAuthenticated(false);
      window.dispatchEvent(new Event('auth-changed'));
      
      // Hide loader and redirect even on error
      dispatch(hideLoading());
      router.push('/login');
    }
  }, [dispatch, setToken, router]);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const token =
        localStorage.getItem('auth_token') ||
        document.cookie
          .split(';')
          .find(cookie => cookie.trim().startsWith('auth_token='))
          ?.split('=')[1];

      setIsAuthenticated(!!token);
      
      // Set token in app context for usePostData to work
      if (token) {
        setToken(`Bearer ${token}`);
      }
      
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes (for login/logout)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-changed', handleStorageChange);
    window.addEventListener('auth-logout', logout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleStorageChange);
      window.removeEventListener('auth-logout', logout);
    };
  }, [setToken, logout]);

  const login = (token: string) => {
    const bearerToken = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
    document.cookie = `auth_token=${token}; path=/; max-age=86400`; // 24 hours
    setToken(bearerToken); // Set token with Bearer prefix in app context
    setIsAuthenticated(true);
    window.dispatchEvent(new Event('auth-changed'));
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
