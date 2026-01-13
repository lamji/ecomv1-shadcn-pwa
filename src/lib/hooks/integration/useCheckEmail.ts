"use client";

import { useUnauthenticatedPostData } from "plugandplay-react-query-hooks";
import { useAppDispatch } from '@/lib/store';
import { showAlert } from '@/lib/features/alertSlice';

export function useCheckEmail() {
  const dispatch = useAppDispatch();
  
  const { mutateAsync: checkEmailMutateAsync, isPending } = useUnauthenticatedPostData({
    baseUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "",
    endpoint: 'api/auth/check-email'
  });

  const checkEmail = async (email: string) => {
    try {
      const response = await checkEmailMutateAsync({ email }) as { 
        success: boolean; 
        exists: boolean; 
        email?: string; 
        message?: string;
        otp?: string; // Development only
      };
      
      return response;
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'Failed to check email';
      
      // Show error alert (centralized like login)
      dispatch(showAlert({
        message: errorMessage,
        variant: 'error'
      }));
      
      throw new Error(errorMessage);
    }
  };

  return {
    checkEmail,
    isLoading: isPending,
  };
}
