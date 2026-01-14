/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePostOtpIntegration } from './integration/usePostOtpIntegration';
import { useResetPassword } from './integration/useResetPassword';
import { showAlert } from '../features/alertSlice';
import { useDispatch } from 'react-redux';
import useNativeFunc from '../native/useNativeFunc';



interface UseOtpHookReturn {
  isLoading: boolean;
  isResending: boolean;
  error: string | null;
  otpValues: string[];
  timeLeft: number;
  isExpired: boolean;
  email: string;
  handleInputChange: (index: number, value: string) => void;
  handleKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleResend: () => void;
  handleTestNewPassword: () => void;
  showNewPasswordModal: boolean;
  setShowNewPasswordModal: (show: boolean) => void;
  formatTime: (seconds: number) => string;
}

export function useOtp(): UseOtpHookReturn {
  const {setExternalUserId, getPlayerId} = useNativeFunc()
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp } = usePostOtpIntegration();
  const { resetPasswordVerify } = useResetPassword();
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  
  
  // Get email from query params
  const email = searchParams.get('email') || 'your email';

  // Get temporary token from query params (for registration verification)
  const tempToken = searchParams.get('tempToken') || '';

  // Get redirect path to determine OTP purpose
  const redirectPath = searchParams.get('redirect') || '';
  const isPasswordReset = redirectPath === '/reset-password';
  
  // Fallback: Check if tempToken is missing (indicates password reset vs registration)
  const isPasswordResetFallback = !tempToken && email;
  const finalIsPasswordReset = isPasswordReset || isPasswordResetFallback;
  
  // Debug logging for WebView issues
  useEffect(() => {
    console.log('🔍 OTP Debug - WebView Detection:', {
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
      redirectPath,
      isPasswordReset,
      isPasswordResetFallback,
      finalIsPasswordReset,
      email,
      tempToken,
      searchParams: Object.fromEntries(searchParams.entries())
    });
  }, [redirectPath, isPasswordReset, isPasswordResetFallback, finalIsPasswordReset, email, tempToken, searchParams]);

  // Test function to bypass middleware and go to new-password directly
  const handleTestNewPassword = useCallback(() => {
    console.log('🧪 Testing direct navigation to new-password page');
    
    // Create sample data for testing
    const testEmail = email || 'test@example.com';
    const testResetToken = 'test-reset-token-' + Date.now();
    const testExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes from now
    const testResetTempToken = 'test-temp-token-' + Date.now();
    
    // Store the resetTempToken in both cookie and localStorage manually (bypassing middleware)
    const timestamp = Date.now();
    const tokenData = `${testResetTempToken}:${timestamp}`;
    
    // Store in cookie
    document.cookie = `resetTempToken=${tokenData}; path=/; max-age=300; SameSite=Lax`;
    
    // Store in localStorage as backup for WebView
    localStorage.setItem('resetTempToken', tokenData);
    
    // Navigate to new-password page with test data
    const params = new URLSearchParams();
    params.set('email', testEmail);
    params.set('resetToken', testResetToken);
    params.set('expiry', testExpiry);
    
    console.log('🧪 Navigating to:', `/new-password?${params.toString()}`);
    console.log('🧪 Token data stored:', tokenData);
    router.push(`/new-password?${params.toString()}`);
  }, [email, router]);

  // Auto-bypass for WebView if it's a password reset
  useEffect(() => {
    if (finalIsPasswordReset && email && process.env.NODE_ENV === 'development') {
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
      const isWebView = userAgent.includes('wv') || userAgent.includes('WebView') || 
                       (userAgent.includes('Mobile') && userAgent.includes('wv'));
      
      if (isWebView) {
        console.log('🔍 WebView detected for password reset - showing modal instead of redirect');
        // Show modal after 1 second delay instead of redirecting
        const timer = setTimeout(() => {
          setShowNewPasswordModal(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [finalIsPasswordReset, email]);

  // Initialize timer from localStorage immediately
  const getInitialTimer = () => {
    if (typeof window !== 'undefined') {
      const storedTimer = localStorage.getItem('otp_timer');
      const storedTimestamp = localStorage.getItem('otp_timestamp');
      
      if (storedTimer && storedTimestamp) {
        const elapsed = Math.floor((Date.now() - parseInt(storedTimestamp)) / 1000);
        const remaining = Math.max(0, parseInt(storedTimer) - elapsed);
        
        if (remaining > 0) {
          return remaining;
        }
      }
    }
    return 600; // Default 10 minutes
  };
  
  const [timeLeft, setTimeLeft] = useState(getInitialTimer());
  const [isExpired, setIsExpired] = useState(timeLeft === 0);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (timeLeft > 0 && !isExpired) {
      localStorage.setItem('otp_timer', timeLeft.toString());
      localStorage.setItem('otp_timestamp', Date.now().toString());
    } else if (isExpired) {
      // Clear timer when expired
      localStorage.removeItem('otp_timer');
      localStorage.removeItem('otp_timestamp');
    }
  }, [timeLeft, isExpired]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isExpired) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsExpired(true);
    }
  }, [timeLeft, isExpired]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }

    // Clear error when user starts typing
    if (error) setError(null);
  };

  // Handle key press
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtpValues = ['', '', '', '', '', ''];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newOtpValues[i] = pastedData[i];
      }
    }
    
    setOtpValues(newOtpValues);
    
    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5);
    const lastInput = document.getElementById(`otp-${lastIndex}`) as HTMLInputElement;
    lastInput?.focus();
  };

  /**
   * handle otp api integration
   * @param e 
   * @returns 
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otp = otpValues.join('');

    if (otp.length !== 6) {
      dispatch(showAlert({
        message: 'Please enter all 6 digits',
        variant: 'error'
      }));
      return;
    }

    if (isExpired) {
      dispatch(showAlert({
        message: 'OTP has expired. Please request a new one.',
        variant: 'error'
      }));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result: any;
      
      if (finalIsPasswordReset) {
        console.log('🔍 OTP Debug - Using password reset verification API');
        // Use password reset verification API
        result = await resetPasswordVerify(otp, email);
      } else {
        console.log('🔍 OTP Debug - Using regular OTP verification API');
        // Use regular OTP verification API
        result = await verifyOtp(otp, tempToken);
      }

      if (result.success) {
        // Save OTP response to localStorage for SubscriptionChecker
        localStorage.setItem('otp_response', JSON.stringify(result));
        
        // Clear all OTP-related localStorage items
        localStorage.removeItem('otp_timer');
        localStorage.removeItem('otp_timestamp');
        
        // For password reset, don't set OneSignal - just redirect
        if (!isPasswordReset) {
          // Set OneSignal external ID using WebToNative - prevent duplication
          if (result.createdAtKey) {
            try {
              // Detect platform - only set OneSignal for mobile and webview, not web
              const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
              const isMobile = userAgent.includes('Mobile') || userAgent.includes('Android') || 
                              userAgent.includes('iPhone') || userAgent.includes('iPad');
              const isWebView = userAgent.includes('wv') || userAgent.includes('WebView') || 
                               (userAgent.includes('Mobile') && userAgent.includes('wv'));
              const shouldSetOneSignal = isMobile || isWebView; // Skip for web browsers
              
              if (shouldSetOneSignal) {
                // Check if we already set this external ID for this device
                const lastSetExternalId = localStorage.getItem('last_onesignal_external_id');
                
                if (lastSetExternalId === result.createdAtKey) {
                  console.log('External ID already set, skipping duplicate...');
                } else {
                  // First check current player ID for info
                  const currentPlayerId = await getPlayerId();
                  console.log('Current OneSignal player ID:', currentPlayerId);
                  
                  // Only set external ID if player ID is available
                  if (currentPlayerId) {
                    // Set the new external ID
                    setExternalUserId(result.createdAtKey);
                    localStorage.setItem('last_onesignal_external_id', result.createdAtKey);
                  
                  } else {
                    console.log('⚠️ No player ID available, skipping external ID setting');
                  }
                }
              } else {
                console.log('🌐 Web browser detected - skipping OneSignal external ID setup');
              }
            } catch (error) {
              console.error('Error with OneSignal external ID:', error);
              // Still try to set on error (only for mobile/webview)
              setExternalUserId(result.createdAtKey);
              localStorage.setItem('last_onesignal_external_id', result.createdAtKey);
            }
          }
        }
        
        // Show success alert
        dispatch(showAlert({
          message: result.message || 'Verification successful',
          variant: 'success'
        }));
        
        // Redirect to intended destination
        if (finalIsPasswordReset && result.resetToken && result.resetTempToken) {
          console.log('🔍 OTP Debug - Redirecting to new-password (password reset flow)');
          // Store resetTempToken with timestamp in both cookie and localStorage for middleware validation
          // Format: token:timestamp
          const timestamp = Date.now();
          const tokenData = `${result.resetTempToken}:${timestamp}`;
          
          // Store in cookie
          document.cookie = `resetTempToken=${tokenData}; path=/; max-age=300; SameSite=Lax`; // 5 minutes
          
          // Store in localStorage as backup for WebView
          localStorage.setItem('resetTempToken', tokenData);
          
          // Redirect to new password page with resetToken in URL for API use
          const params = new URLSearchParams();
          params.set('email', email);
          params.set('resetToken', result.resetToken);
          params.set('expiry', result.resetTokenExpiry || '');
          router.push(`/new-password?${params.toString()}`);
        } else {
          console.log('🔍 OTP Debug - Redirecting to login (regular flow)', { finalIsPasswordReset, hasResetToken: !!result.resetToken, hasResetTempToken: !!result.resetTempToken });
          // Regular flow - redirect to login or other destination
          const redirectTo = searchParams.get('redirect') || '/login';
          router.push(redirectTo);
        }
      } else {
        dispatch(showAlert({
          message: result.message || 'Invalid OTP. Please try again.',
          variant: 'error'
        }));
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      
      // Extract the actual API response message
      const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
      
      dispatch(showAlert({
        message: errorMessage,
        variant: 'error'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setIsResending(true);
    setError(null);

    try {
      const result:any = await resendOtp(email);

      if (result.success) {
        // Reset timer
        setTimeLeft(600);
        setIsExpired(false);
        setOtpValues(['', '', '', '', '', '']);
        
        // Focus first input
        const firstInput = document.getElementById('otp-0') as HTMLInputElement;
        firstInput?.focus();
      } else {
        setError(result.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP failed:', error);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return {
    isLoading,
    isResending,
    error,
    otpValues,
    timeLeft,
    isExpired,
    email,
    handleInputChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleResend,
    handleTestNewPassword,
    showNewPasswordModal,
    setShowNewPasswordModal,
    formatTime,
  };
}

