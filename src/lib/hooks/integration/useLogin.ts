"use client";

import { useAppContext, useUnauthenticatedPostData } from "plugandplay-react-query-hooks";
import { useAppDispatch } from '@/lib/store';
import { showAlert } from '@/lib/features/alertSlice';
import { useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import useNativeFunc from '@/lib/native/useNativeFunc';
import { fetchProfile } from '@/lib/features/profileSlice';

export function useLogin() {
  const { setToken } = useAppContext();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setExternalUserId, getPlayerId, removeExternalUserId } = useNativeFunc();
  
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
          const signupPlatform = user.signupPlatform as string || 'web';
          const oneSignalUserId = user.createdAtKey as string;
          
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
          
          // Set OneSignal external ID for non-web platforms
          if (oneSignalUserId && signupPlatform !== 'web') {
            try {
              // Get the previously logged in user's email from localStorage
              const previousUserData = localStorage.getItem('user_data');
              const previousEmail = previousUserData ? JSON.parse(previousUserData).email : null;
              const currentEmail = user.email as string;
              
              // If different user is logging in, remove old external ID first
              if (previousEmail && previousEmail !== currentEmail) {
                console.log(`Switching users: removing external ID for ${previousEmail}, setting for ${currentEmail}`);
                await removeExternalUserId();
                localStorage.removeItem('last_onesignal_external_id');
              }
              
              // Check if we already set this external ID for this device
              const lastSetExternalId = localStorage.getItem('last_onesignal_external_id');
              
              if (lastSetExternalId === oneSignalUserId) {
                console.log('External ID already set, skipping duplicate...');
              } else {
                // First check current player ID for info
                const currentPlayerId = await getPlayerId();
                console.log('Current OneSignal player ID:', currentPlayerId);
                
                // Only set external ID if player ID is available
                if (currentPlayerId) {
                  // Set the new external ID
                  await setExternalUserId(oneSignalUserId);
                  localStorage.setItem('last_onesignal_external_id', oneSignalUserId);
                  console.log('✅ External ID set successfully on login:', oneSignalUserId);
                } else {
                  console.log('⚠️ No player ID available, skipping external ID setting');
                }
              }
            } catch (error) {
              console.error('Error with OneSignal external ID on login:', error);
              // Still try to set on error (only for mobile/webview)
              try {
                await setExternalUserId(oneSignalUserId);
                localStorage.setItem('last_onesignal_external_id', oneSignalUserId);
              } catch (fallbackError) {
                console.log('OneSignal fallback failed:', fallbackError);
              }
            }
          }
          
          // Fetch profile data after successful login
          dispatch(fetchProfile());
          
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
