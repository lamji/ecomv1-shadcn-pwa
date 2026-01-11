/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePostData, useAppContext } from "plugandplay-react-query-hooks";
import { useAppDispatch } from '@/lib/store';
import { showAlert } from '@/lib/features/alertSlice';
import { ApiResponse } from '@/types/auth';

export function usePostOtpIntegration() {
  const { setToken } = useAppContext();
  const dispatch = useAppDispatch();

  const { mutateAsync: verifyOtpMutateAsync } = usePostData({
    baseUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "",
    endpoint: '/api/auth/verify-email' // Use auth endpoint for registration verification
  });

  const { mutateAsync: resendOtpMutateAsync } = usePostData({
    baseUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "",
    endpoint: '/api/auth/resend-otp'
  });

  const verifyOtp = async (otp: string, tempToken?: string) => {
    try {
      const payload = tempToken ? { otp, tempToken } : { otp };
      const response = await verifyOtpMutateAsync(payload) as ApiResponse;
      
      if (response.success && response.token) {
        // Store token in context (similar to useLogin)
        setToken(response.token);
        
        dispatch(showAlert({
          message: response.message || 'Verification successful',
          variant: 'success'
        }));
      }
      
      return response;
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Verification failed';
      
      dispatch(showAlert({
        message: errorMessage,
        variant: 'error'
      }));
      
      throw error;
    }
  };

  const resendOtp = async (email: string) => {
    try {
      const response = await resendOtpMutateAsync({ email });
      return response;
    } catch (error) {
      console.error('Resend OTP failed:', error);
      throw error;
    }
  };

  return {
    verifyOtp,
    resendOtp
  };
}