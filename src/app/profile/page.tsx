'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { dummyProfile, type UserProfile } from '@/lib/data/profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import LoginPrompt from '@/components/profile/LoginPrompt';
import OverviewTab from '@/components/profile/OverviewTab';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(dummyProfile);

  const handleBack = () => {
    router.back();
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="profile-page">
      {/* Profile Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" data-testid="profile-content">
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
