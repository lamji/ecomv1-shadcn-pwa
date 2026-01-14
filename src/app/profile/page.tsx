'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { dummyProfile } from '@/lib/data/profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import OverviewTab from '@/components/profile/OverviewTab';
import { type UserProfile } from '@/types/profile';
import { showLoading, hideLoading } from '@/lib/features/loadingSlice';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { profile: reduxProfile, isLoading: profileLoading } = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<UserProfile>(dummyProfile);

  useEffect(() => {
    if (reduxProfile) {
      setProfile(reduxProfile);
    }
  }, [reduxProfile]);

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
      <div className="mx-auto max-w-7xl px-0 py-8 sm:px-6 lg:px-8" data-testid="profile-content">
        <div className="flex flex-col gap-8 lg:flex-row" data-testid="profile-layout">
          {/* Left Sidebar - Profile Header */}
          <div className="lg:w-80" data-testid="profile-sidebar">
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
