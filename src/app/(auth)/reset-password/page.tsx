'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { cn } from '@/lib/utils';
import useAppConfig from '@/lib/hooks/useAppConfig';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useResetPassword } from '@/lib/hooks/integration/useResetPassword';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { appName, appLogo } = useAppConfig();
  const { resetPassword, isLoading: resetLoading } = useResetPassword();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get email and token from query params
  const email = searchParams?.get('email') || '';
  const token = searchParams?.get('token') || '';

  type ResetPasswordValues = { 
    password: string; 
    confirmPassword: string;
  };

  const formik = useFormik<ResetPasswordValues>({
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
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values: ResetPasswordValues, { setSubmitting }: FormikHelpers<ResetPasswordValues>) => {
      setFormError(null);

      try {
        // Call the reset password API with token
        const result = await resetPassword(email, values.password, token);
        
        if (result.success) {
          setIsSuccess(true);
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          setFormError(result.message || 'Failed to reset password. Please try again.');
        }
        
      } catch {
        setFormError('Failed to reset password. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Redirect if no email is provided
  useEffect(() => {
    if (!email && typeof window !== 'undefined') {
      router.push('/forgot-password');
    }
  }, [email, router]);

  if (isSuccess) {
    return (
      <div className="bg-background flex min-h-[100dvh] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-sm border-0 shadow-none">
          <CardHeader className="text-center">
            <div className="mb-2 flex flex-col items-center gap-2">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Password Reset!</CardTitle>
            <CardDescription>
              Your password has been successfully reset
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              You will be redirected to the login page...
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Go to Login Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-[100dvh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm border-0 shadow-none">
        <CardHeader className="text-center">
          <div className="mb-2 flex flex-col items-center gap-2">
            <Image
              src={appLogo}
              alt={appName}
              width={100}
              height={100}
              priority
            />
          </div>
          <CardTitle className="text-2xl">New Password</CardTitle>
          <CardDescription>
            Create a new password for {email}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {formError ? (
            <div className="border-destructive/40 bg-destructive/5 text-destructive mb-4 rounded-md border px-3 py-2 text-sm">
              {formError}
            </div>
          ) : null}

          <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className={cn(
                    'pr-10',
                    formik.touched.password &&
                      formik.errors.password &&
                      'border-destructive focus-visible:ring-destructive/30',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-destructive text-xs">{formik.errors.password}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className={cn(
                    'pr-10',
                    formik.touched.confirmPassword &&
                      formik.errors.confirmPassword &&
                      'border-destructive focus-visible:ring-destructive/30',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-destructive text-xs">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <div className="bg-muted/50 rounded-md p-3 text-xs">
              <p className="font-medium mb-1">Password requirements:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li className={cn(formik.values.password.length >= 8 && "text-green-600")}>
                  • At least 8 characters
                </li>
                <li className={cn(/[A-Z]/.test(formik.values.password) && "text-green-600")}>
                  • One uppercase letter
                </li>
                <li className={cn(/[a-z]/.test(formik.values.password) && "text-green-600")}>
                  • One lowercase letter
                </li>
                <li className={cn(/[0-9]/.test(formik.values.password) && "text-green-600")}>
                  • One number
                </li>
              </ul>
            </div>

            <Button 
              type="submit" 
              disabled={formik.isSubmitting || resetLoading} 
              className="w-full"
            >
              {formik.isSubmitting || resetLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link href="/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
