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

export default function SignupPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  type SignupValues = {
    name: string;
    email: string;
    password: string;
    confirm: string;
  };

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
      setFormError(null);
      try {
        // TODO: call your signup API here with values
        await new Promise(r => setTimeout(r, 900));
        router.push('/login');
      } catch {
        setFormError('Signup failed. Please try again.');
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
          {formError ? (
            <div className="border-destructive/40 bg-destructive/5 text-destructive mb-4 rounded-md border px-3 py-2 text-sm">
              {formError}
            </div>
          ) : null}

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
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                placeholder="At least 8 chars, letters and numbers"
                minLength={8}
                className={cn(
                  formik.touched.password &&
                    formik.errors.password &&
                    'border-destructive focus-visible:ring-destructive/30',
                )}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-destructive text-xs">{formik.errors.password}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                name="confirm"
                value={formik.values.confirm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                placeholder="Repeat your password"
                minLength={8}
                className={cn(
                  formik.touched.confirm &&
                    formik.errors.confirm &&
                    'border-destructive focus-visible:ring-destructive/30',
                )}
              />
              {formik.touched.confirm && formik.errors.confirm && (
                <p className="text-destructive text-xs">{formik.errors.confirm}</p>
              )}
            </div>

            <Button type="submit" disabled={formik.isSubmitting} className="w-full">
              {formik.isSubmitting ? 'Creating account…' : 'Create account'}
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
