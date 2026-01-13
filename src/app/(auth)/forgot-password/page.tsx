'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { useCheckEmail } from '@/lib/hooks/integration/useCheckEmail';
import { useAppDispatch } from '@/lib/store';
import { showAlert } from '@/lib/features/alertSlice';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { appName, appLogo } = useAppConfig();
  const { checkEmail, isLoading: checkLoading } = useCheckEmail();
  const dispatch = useAppDispatch();
  const [formError, setFormError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  type ForgotPasswordValues = { email: string };

  const formik = useFormik<ForgotPasswordValues>({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Enter a valid email').required('Email is required'),
    }),
    onSubmit: async (values: ForgotPasswordValues, { setSubmitting }: FormikHelpers<ForgotPasswordValues>) => {
      setFormError(null);

      try {
        // Call the check email API
        const result = await checkEmail(values.email);
        
        if (result.success) {
          if (result.exists) {
            // Email exists and OTP was sent
            setEmailSent(true);
            setSentEmail(result.email || values.email);
            
            // In development, show OTP for testing
            if (process.env.NODE_ENV === 'development' && result.otp) {
              console.log('Development OTP:', result.otp);
            }
          } else {
            // Email doesn't exist - show centralized alert only
            dispatch(showAlert({
              message: 'No account found with this email address.',
              variant: 'error'
            }));
          }
        } else {
          setFormError(result.message || 'Failed to process request. Please try again.');
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send reset code. Please try again.';
        setFormError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleContinueToOtp = () => {
    router.push(`/otp?email=${encodeURIComponent(sentEmail)}&redirect=/reset-password`);
  };

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
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            {emailSent 
              ? `We've sent a code to ${sentEmail}`
              : 'Enter your email to receive a reset code'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!emailSent ? (
            <>
              {formError ? (
                <div className="border-destructive/40 bg-destructive/5 text-destructive mb-4 rounded-md border px-3 py-2 text-sm">
                  {formError}
                </div>
              ) : null}

              <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                        'pl-10',
                        formik.touched.email &&
                          formik.errors.email &&
                          'border-destructive focus-visible:ring-destructive/30',
                      )}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-destructive text-xs">{formik.errors.email}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={formik.isSubmitting || checkLoading} 
                  className="w-full"
                >
                  {formik.isSubmitting || checkLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    'Send Reset Code'
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Check your email for a 6-digit verification code
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleContinueToOtp}
                  className="w-full"
                >
                  Continue to Verification
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEmailSent(false);
                    setSentEmail('');
                    formik.resetForm();
                  }}
                  className="w-full"
                >
                  Use different email
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                <p>Didn&apos;t receive the code?</p>
                <p>Check your spam folder or try again later</p>
              </div>
            </div>
          )}
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
