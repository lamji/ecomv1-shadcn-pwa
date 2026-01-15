'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAppDispatch } from '@/lib/store';
import { dummyProfile } from '@/lib/data/profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import OverviewTab from '@/components/profile/OverviewTab';
import { type UserProfile } from '@/types/profile';
import { showLoading, hideLoading } from '@/lib/features/loadingSlice';
import { useRouter } from 'next/navigation';
import { useGetProfile } from '@/lib/hooks/integration/useGetProfile';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { profile: queryProfile, isLoading: profileLoading } = useGetProfile();
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<UserProfile>(dummyProfile);

  useEffect(() => {
    if (queryProfile) {
      setProfile(queryProfile);
    }
  }, [queryProfile]);

  useEffect(() => {
    if (profileLoading) {
      dispatch(showLoading({ message: 'Fetching profile...' }));
    } else {
      dispatch(hideLoading());
    }
  }, [profileLoading, dispatch]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 sm:bg-white" data-testid="profile-page">
      {/* Profile Content */}
      <div className="mt-6" data-testid="profile-content">
        <div className="flex flex-col gap-6 lg:flex-row" data-testid="profile-layout">
          {/* Left Sidebar - Profile Header */}
          <div className="w-full lg:w-1/2" data-testid="profile-sidebar">
            {/* Profile Header */}
            <ProfileHeader profile={profile} onProfileUpdate={setProfile} />
          </div>
          {/* Right Content Area */}
          <div className="flex-1" data-testid="profile-content-area">
            {/* Overview Tab */}
            <OverviewTab profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}
