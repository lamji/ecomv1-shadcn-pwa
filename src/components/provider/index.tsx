'use client'; // For next js
import React, { useEffect, useState } from 'react';
import { Providers } from 'plugandplay-react-query-hooks';
import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader';
import Footer from '../layout/Footer';
import GlobalLoader from '@/components/shared/GlobalLoader';

const queryClient = {
  queries: {
    // Default settings for react-query
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1, // Retry failed queries once
  },
};

export default function ReactProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * In this case we use localStorage to persist the token
   * This allows the token to be available even after a page refresh
   * You can use whatever storage mechanism you prefer (e.g., sessionStorage, cookies)
   */
  const [initialToken, setInitialToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setInitialToken(token);
  }, [initialToken]);

  const pathname = usePathname();
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/product/') ||
    pathname === '/search';

  return (
    <Providers bearer={false} queryClient={queryClient}>
      <GlobalLoader />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {!isAuthRoute && <AppHeader />}
            {!isAuthRoute && <div className="border-b border-gray-200" />}
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
