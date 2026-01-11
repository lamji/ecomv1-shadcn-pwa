"use client";

import { useAppContext, useUnauthenticatedPostData } from "plugandplay-react-query-hooks";
import { useAppDispatch } from '@/lib/store';
import { showAlert } from '@/lib/features/alertSlice';
import { useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

export function useLogin() {
  const { setToken } = useAppContext();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const baseUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || ""

  // Use unauthenticated mutation for login endpoint
  const { mutateAsync: loginMutateAsync, isPending} = useUnauthenticatedPostData({
    baseUrl,
    endpoint: 'api/auth/login'
  });

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setToken(token);
    }
  }, [setToken]);

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await loginMutateAsync({ email, password });
      
      if (result && typeof result === 'object') {
        const apiResult = result as { success?: boolean; token?: string; user?: Record<string, unknown> };
        
        if (apiResult.success && apiResult.token) {
          const token = apiResult.token;
          const user = apiResult.user || {};
          
          // Persist token and user data
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(user));
          setToken(token);
          
          /**
           * Use cookie for server-side auth
           * You can see this usage in middleware.ts
           */
          const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax` + (location.protocol === 'https:' ? '; Secure' : '');
          
          // Redirect
          const redirectTo = searchParams.get('redirect') || '/';
          router.replace(redirectTo);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      // Simple error message extraction
      let errorMessage = 'Login failed. Please try again.';
      if (error && typeof error === 'object') {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      }
      
      dispatch(showAlert({
        title: 'Login failed',
        message: errorMessage,
        variant: 'error',
      }));
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setToken(null);
  };

  return { handleLogin, handleLogout, isLoading: isPending };
}
