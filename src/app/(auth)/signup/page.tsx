/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
import Image from 'next/image';
import { useUnauthenticatedPostData } from "plugandplay-react-query-hooks";
import { SignupValues } from '@/types/auth';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '@/lib/store';
import { showAlert } from '@/lib/features/alertSlice';

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  console.log("Socket URL",process.env.NEXT_PUBLIC_SOCKET_URL)
  console.log("API Base URL",process.env.NEXT_PUBLIC_API_BASE_URL)

  // Use unauthenticated mutation for signup endpoint
  const { mutateAsync: signupMutateAsync, isPending } = useUnauthenticatedPostData({
    baseUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "",
    endpoint: 'api/auth/register'
  });

  const formik = useFormik<SignupValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirm: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required('Name is required'),
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      password: Yup.string()
        .min(8, 'Min 8 characters')
        .matches(/[A-Za-z]/, 'Use letters and numbers')
        .matches(/\d/, 'Use letters and numbers')
        .required('Password is required'),
      confirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Confirm your password'),
    }),
    onSubmit: async (values: SignupValues, { setSubmitting }: FormikHelpers<SignupValues>) => {
      try {
        // Call signup API with form values
        const result = await signupMutateAsync({
          name: values.name,
          email: values.email,
          password: values.password
        }) as { 
          success?: boolean; 
          email?: string; 
          tempToken?: string; 
          message?: string;
          errors?: Array<{
            type: string;
            value: string;
            msg: string;
            path: string;
            location: string;
          }>;
        };

        if (result.success) {
          // Redirect to OTP page with email and tempToken
          const params = new URLSearchParams();
          params.set('email', result.email || '');
          if (result.tempToken) {
            params.set('tempToken', result.tempToken);
          }
          
          router.push(`/otp?${params.toString()}`);
        } else {
          // Handle field validation errors from API
          if (result.errors && Array.isArray(result.errors)) {
            // API returns array of field validation errors
            const fieldErrors = result.errors as Array<{
              type: string;
              value: string;
              msg: string;
              path: string;
              location: string;
            }>;
            
            // Set field errors in formik
            fieldErrors.forEach(error => {
              formik.setFieldError(error.path, error.msg);
            });
            
            // Show general alert for first error
            dispatch(showAlert({
              message: fieldErrors[0]?.msg || 'Please check your input and try again.',
              variant: 'error'
            }));
          } else {
            // Handle general error message
            dispatch(showAlert({
              message: result.message || 'Signup failed. Please try again.',
              variant: 'error'
            }));
          }
        }
      } catch (error: unknown) {
        console.error('Signup error:', error);
        const errorMessage = (error as any)?.response?.data?.errors?.[0]?.msg || (error as any)?.message || 'Signup failed. Please try again.';
        
        // Show centralized alert for API errors
        dispatch(showAlert({
          message: errorMessage,
          variant: 'error'
        }));
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-background flex min-h-[100dvh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm border-0 shadow-none">
        <CardHeader className="text-center">
          <div className="mb-2 flex flex-col items-center gap-2">
            <Image
              src="/icons/apple-touch-icon.png"
              alt="Loan Management logo"
              width={100}
              height={100}
              priority
            />
          </div>
          <CardTitle className="text-2xl">Create account</CardTitle>
          <CardDescription>Start managing your loans</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                placeholder="Jane Doe"
                className={cn(
                  formik.touched.name &&
                    formik.errors.name &&
                    'border-destructive focus-visible:ring-destructive/30',
                )}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-destructive text-xs">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                placeholder="you@example.com"
                className={cn(
                  formik.touched.email &&
                    formik.errors.email &&
                    'border-destructive focus-visible:ring-destructive/30',
                )}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-destructive text-xs">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
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
                  placeholder="At least 8 chars, letters and numbers"
                  minLength={8}
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
              <Label htmlFor="confirm">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  name="confirm"
                  value={formik.values.confirm}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  placeholder="Repeat your password"
                  minLength={8}
                  className={cn(
                    'pr-10',
                    formik.touched.confirm &&
                      formik.errors.confirm &&
                      'border-destructive focus-visible:ring-destructive/30',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formik.touched.confirm && formik.errors.confirm && (
                <p className="text-destructive text-xs">{formik.errors.confirm}</p>
              )}
            </div>

            <Button type="submit" disabled={isPending || formik.isSubmitting} className="w-full">
              {isPending || formik.isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
