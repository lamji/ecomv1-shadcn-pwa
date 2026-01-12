/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePostOtpIntegration } from './integration/usePostOtpIntegration';
import { oneSignalLogin } from './useOneSignalLogin';
import { showAlert } from '../features/alertSlice';
import { useDispatch } from 'react-redux';




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
  formatTime: (seconds: number) => string;
}

export function useOtp(): UseOtpHookReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp } = usePostOtpIntegration();
const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  
  
  // Get email from query params
  const email = searchParams.get('email') || 'your email';

  // Get temporary token from query params (for registration verification)
  const tempToken = searchParams.get('tempToken') || '';

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
      setError('Please enter all 6 digits');
      return;
    }

    if (isExpired) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result:any = await verifyOtp(otp, tempToken);

      if (result.success) {
        // Save OTP response to localStorage for SubscriptionChecker
        localStorage.setItem('otp_response', JSON.stringify(result));
        
        // Clear all OTP-related localStorage items
        localStorage.removeItem('otp_timer');
        localStorage.removeItem('otp_timestamp');
        // OneSignal login - called after successful verification
        if (result.oneSignalUserId) {
          oneSignalLogin(result.oneSignalUserId);
        }
        dispatch(showAlert({
          message: result.message || 'Verification successful',
          variant: 'success'
        }));
        
        // Redirect to intended destination
        const redirectTo = searchParams.get('redirect') || '/login';
        router.push(redirectTo);
      } else {
        setError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError('Something went wrong. Please try again.');
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
    formatTime,
  };
}
