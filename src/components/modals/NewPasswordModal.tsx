"use client";

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/lib/store';
import { showAlert } from '@/lib/features/alertSlice';

interface NewPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

interface NewPasswordValues {
  password: string;
  confirmPassword: string;
}

export default function NewPasswordModal({ isOpen, onClose, email }: NewPasswordModalProps) {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values: NewPasswordValues) => {
      try {
        // Create test reset token for WebView bypass
        const testResetToken = 'webview-reset-token-' + Date.now();
        
        // Call the reset password API with test data
        const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            token: testResetToken,
            newPassword: values.password,
          }),
        });

        const result = await response.json();

        if (result.success) {
          dispatch(showAlert({
            message: 'Password reset successfully! Redirecting to login...',
            variant: 'success'
          }));
          
          // Close modal and redirect to login after 2 seconds
          setTimeout(() => {
            onClose();
            window.location.href = '/login';
          }, 2000);
        } else {
          dispatch(showAlert({
            message: result.message || 'Failed to reset password. Please try again.',
            variant: 'error'
          }));
        }
      } catch {
        dispatch(showAlert({
          message: 'Failed to reset password. Please try again.',
          variant: 'error'
        }));
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Reset Password</DialogTitle>
          <DialogDescription>
            Enter your new password for {email}
          </DialogDescription>
        </DialogHeader>

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                {...formik.getFieldProps('confirmPassword')}
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

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex-1"
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
