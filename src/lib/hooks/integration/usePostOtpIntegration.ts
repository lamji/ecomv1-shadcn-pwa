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
    endpoint: '/api/auth/opt-resend'
  });

  const verifyOtp = async (otp: string, tempToken?: string) => {
    try {
      const payload = tempToken ? { otp, tempToken } : { otp };
      const response = await verifyOtpMutateAsync(payload) as ApiResponse;
      
      if (response.success && response.token) {
        // Store token in context (similar to useLogin)
        setToken(`Bearer ${response.token}`);
        
        // Send welcome notification if oneSignalUserId is available
        if (response.oneSignalUserId) {
          dispatch(showAlert({
            message: response.message || 'Verification successful',
            variant: 'success'
          }));
        }
      }
      
      // Return the full response including oneSignalUserId
      return response;
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      
      // Don't show alert here - let useOtp handle it with proper message
      throw error;
    }
  };

  const resendOtp = async (email: string) => {
    try {
      const response = await resendOtpMutateAsync({ email }) as ApiResponse;
      
      if (response.success) {
        dispatch(showAlert({
          message: response.message || 'OTP sent successfully',
          variant: 'success'
        }));
      }
      
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