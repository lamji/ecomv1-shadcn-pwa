'use client';

import { useEffect } from 'react';
import { useGetProfile } from '@/lib/hooks/integration/useGetProfile';
import { useAppContext } from 'plugandplay-react-query-hooks';

interface ProfileProviderProps {
  children: React.ReactNode;
}

export default function ProfileProvider({ children }: ProfileProviderProps) {
  const { token } = useAppContext();
  const { refetch } = useGetProfile();

  // Fetch profile data when auth token changes
  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  // Listen for auth token changes (login/logout)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        if (e.newValue) {
          // Token added (login) - refetch profile
          refetch();
        }
        // Token removed (logout) - React Query will handle automatically
        // since the query is enabled: !!token
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refetch]);

  return <>{children}</>;
}
