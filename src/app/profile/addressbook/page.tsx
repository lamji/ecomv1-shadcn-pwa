'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { dummyProfile } from '@/lib/data/profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import LoginPrompt from '@/components/profile/LoginPrompt';
import AddressList from '@/components/profile/ProfileNavigation';
import { useAlert } from '@/lib/hooks/useAlert';
import { Address, UserProfile } from '@/types/profile';


export default function AddressBookPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [profile] = useState<UserProfile>(dummyProfile);
  const { showSuccess } = useAlert();

 

  const handleEditAddress = (address: Address) => {
    console.log('Edit address:', address);
    // TODO: Open edit address modal/form
    showSuccess('Edit address functionality coming soon!', 'Edit Address');
  };

  const handleDeleteAddress = (addressId: string) => {
    console.log('Delete address:', addressId);
    // TODO: Show confirmation dialog and delete address
    showSuccess('Delete address functionality coming soon!', 'Delete Address');
  };

  const handleSetDefaultAddress = (addressId: string) => {
    console.log('Set default address:', addressId);
    // TODO: Update default address in backend
    showSuccess('Default address updated successfully!', 'Address Updated');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="addressbook-page">
      {/* Address Book Content */}
      <div
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        data-testid="addressbook-content"
      >
        <div className="flex flex-col gap-8 lg:flex-row" data-testid="addressbook-layout">
          {/* Left Sidebar - Profile Header */}
          <div className="lg:w-80" data-testid="addressbook-sidebar">
            {/* Profile Header */}
            <ProfileHeader profile={profile} />
          </div>

          {/* Right Content Area - Address List */}
          <div className="flex-1" data-testid="addressbook-content-area">
            <AddressList
              addresses={profile.addresses}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefaultAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
