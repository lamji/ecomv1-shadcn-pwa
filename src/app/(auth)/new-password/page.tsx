"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Eye, EyeOff, Clock } from 'lucide-react';
import { useAppDispatch } from '@/lib/store';
import { showAlert } from '@/lib/features/alertSlice';
import { cn } from '@/lib/utils';

interface NewPasswordValues {
  password: string;
  confirmPassword: string;
}

export default function NewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  const email = searchParams.get('email') || '';
  const resetToken = searchParams.get('resetToken') || '';
  const expiry = searchParams.get('expiry') || '';

  // Note: resetTempToken validation is handled by middleware
  // If we reach this page, middleware has already validated the token

  // Calculate time remaining until token expires
  useEffect(() => {
    if (expiry) {
      const expiryTime = new Date(expiry).getTime();
      const currentTime = Date.now();
      const remaining = Math.max(0, Math.floor((expiryTime - currentTime) / 1000));
      setTimeLeft(remaining);
      setIsExpired(remaining === 0);
    }
  }, [expiry]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isExpired) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsExpired(true);
      // Clear expired temp token cookie
      document.cookie = 'resetTempToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }, [timeLeft, isExpired]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formik = useFormik<NewPasswordValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values: NewPasswordValues, { setSubmitting }: FormikHelpers<NewPasswordValues>) => {
      if (isExpired) {
        dispatch(showAlert({
          message: 'Reset token has expired. Please request a new password reset.',
          variant: 'error'
        }));
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password: values.password,
            token: resetToken,
          }),
        });

        const result = await response.json();

        if (result.success) {
          // Clear reset temp token cookie on successful reset
          document.cookie = 'resetTempToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          
          dispatch(showAlert({
            message: 'Password reset successfully! You can now login with your new password.',
            variant: 'success'
          }));
          
          router.push('/login');
        } else {
          dispatch(showAlert({
            message: result.message || 'Failed to reset password. Please try again.',
            variant: 'error'
          }));
        }
      } catch (error) {
        console.error('Password reset error:', error);
        dispatch(showAlert({
          message: 'Failed to reset password. Please try again.',
          variant: 'error'
        }));
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isExpired) {
    return (
      <div className="bg-background flex min-h-[100dvh] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="text-center">
            <div className="mb-4 flex flex-col items-center gap-2">
              <Image
                src="/icons/apple-touch-icon.png"
                alt="App Logo"
                width={80}
                height={80}
                className="rounded-lg"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">Token Expired</CardTitle>
            <CardDescription>
              Your password reset token has expired
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              For security reasons, password reset tokens expire after 5 minutes.
            </p>
            <Button onClick={() => router.push('/forgot-password')} className="w-full">
              Request New Reset Code
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-[100dvh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardHeader className="text-center">
          <div className="mb-4 flex flex-col items-center gap-2">
            <Image
              src="/icons/apple-touch-icon.png"
              alt="App Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
          <CardDescription>
            Create a new password for {email}
          </CardDescription>
          {timeLeft > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Expires in {formatTime(timeLeft)}</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  {...formik.getFieldProps('password')}
                  className={cn(
                    formik.touched.password &&
                      formik.errors.password &&
                      'border-destructive focus-visible:ring-destructive/30',
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-destructive text-xs">{formik.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  {...formik.getFieldProps('confirmPassword')}
                  className={cn(
                    formik.touched.confirmPassword &&
                      formik.errors.confirmPassword &&
                      'border-destructive focus-visible:ring-destructive/30',
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-destructive text-xs">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={formik.isSubmitting || isExpired}
            >
              {formik.isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
