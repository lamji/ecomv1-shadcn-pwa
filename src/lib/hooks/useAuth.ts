'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes (for login/logout)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-changed', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleStorageChange);
    };
  }, []);

  const login = (token: string) => {
    localStorage.setItem('auth_token', token);
    document.cookie = `auth_token=${token}; path=/; max-age=86400`; // 24 hours
    setIsAuthenticated(true);
    window.dispatchEvent(new Event('auth-changed'));
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('auth-changed'));
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
