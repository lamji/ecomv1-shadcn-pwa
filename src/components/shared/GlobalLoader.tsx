'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAppSelector } from '@/lib/store';

export default function GlobalLoader() {
  const loading = useAppSelector(state => state.loading);

  if (!loading.isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-lg">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-sm font-medium text-gray-900">{loading.message || 'Loading...'}</p>
      </div>
    </div>
  );
}
