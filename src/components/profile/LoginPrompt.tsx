'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function LoginPrompt() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
   

      {/* Login Prompt */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Welcome to Your Profile</h2>
          <p className="mb-8 text-gray-600">
            Please log in to access your profile, order history, and personalized features.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button onClick={() => router.push('/login')} className="flex-1 sm:flex-initial">
              Log In
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/register')}
              className="flex-1 sm:flex-initial"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
