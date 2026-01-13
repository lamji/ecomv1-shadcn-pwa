"use client";

import { useUnauthenticatedPostData } from "plugandplay-react-query-hooks";
import { useAppDispatch } from '@/lib/store';
import { showAlert } from '@/lib/features/alertSlice';

export function useResetPassword() {
  const dispatch = useAppDispatch();

  const { mutateAsync: resetPasswordMutateAsync, isPending } = useUnauthenticatedPostData({
    baseUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "",
    endpoint: 'api/auth/reset-password'
  });

  const { mutateAsync: resetPasswordVerifyMutateAsync } = useUnauthenticatedPostData({
    baseUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "",
    endpoint: 'api/auth/reset-password-verify'
  });

  const resetPassword = async (email: string, password: string, token?: string) => {
    try {
      const response = await resetPasswordMutateAsync({ email, password, token }) as { success: boolean; message?: string };
      
      if (response.success) {
      
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Failed to reset password' };
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'Failed to reset password';
      
      dispatch(showAlert({
        message: errorMessage,
        variant: 'error'
      }));
      
      return { success: false, message: errorMessage };
    }
  };

  const resetPasswordVerify = async (otp: string, email: string) => {
    try {
      const response = await resetPasswordVerifyMutateAsync({ otp, email }) as { 
        success: boolean; 
        message?: string;
        resetToken?: string;
        resetTempToken?: string;
        resetTokenExpiry?: string;
      };
      
      if (response.success) {
        return { 
          success: true, 
          message: response.message,
          resetToken: response.resetToken, // For API calls
          resetTempToken: response.resetTempToken, // For localStorage page access
          resetTokenExpiry: response.resetTokenExpiry
        };
      } else {
        return { success: false, message: response.message || 'Invalid OTP' };
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'OTP verification failed';
      
      dispatch(showAlert({
        message: errorMessage,
        variant: 'error'
      }));
      
      return { success: false, message: errorMessage };
    }
  };

  return {
    resetPassword,
    resetPasswordVerify,
    isLoading: isPending,
  };
}
