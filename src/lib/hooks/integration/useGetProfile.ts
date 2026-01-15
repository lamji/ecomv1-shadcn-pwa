import { useGetData, useAppContext } from "plugandplay-react-query-hooks";
import { UserProfile } from "@/types/profile";
import { useEffect } from "react";
import { useAppDispatch } from '@/lib/store';
import { showAlert } from '@/lib/features/alertSlice';
import { updateProfile } from "@/lib/features/profileSlice";

interface ProfileApiResponse {
  success: boolean;
  data: UserProfile & { oneSignalUserId?: string };
  cached: boolean;
}

export function useGetProfile() {
  const { token, setToken } = useAppContext();
  const dispatch = useAppDispatch();
  
  const { data, isLoading, error, refetch } = useGetData<ProfileApiResponse>({
    baseUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "",
    endpoint: "api/profile",
    options: {
      queryKey: ["profile"],
      staleTime: 0, // Always consider data stale for immediate updates
      gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache for 1 day (React Query v5)
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: false, // Don't refetch when reconnecting
      refetchOnMount: 'always', // Always refetch when component mounts
      retry: 1, // Only retry once on failure
      enabled: !!token,
    },
  });

  // Handle auth errors (401) by logging out user
  useEffect(() => {
    if (error) {
      // Check if it's an auth error (401 or authentication related)
      const errorObj = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const isAuthError = 
        errorObj.response?.status === 401 ||
        errorObj.response?.data?.message?.toLowerCase().includes('unauthorized') ||
        errorObj.response?.data?.message?.toLowerCase().includes('authentication') ||
        errorObj.message?.toLowerCase().includes('unauthorized') ||
        errorObj.message?.toLowerCase().includes('authentication');

      if (isAuthError) {
        // Clear auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setToken(null);
        
        // Clear auth cookie
        document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        
        // Show alert to user
        dispatch(showAlert({
          title: 'Session Expired',
          message: 'Your session has expired. Please log in again.',
          variant: 'error',
        }));
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
  }, [error, setToken, dispatch]);

  useEffect(() => {
    if (data?.data) {
      dispatch(updateProfile(data.data));
    }
  }, [data, dispatch]);

  return {
    profile: data?.data,
    isLoading,
    error,
    refetch,
  };
}
