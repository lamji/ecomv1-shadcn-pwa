'use client';

import React from 'react';
import ProfileInfo from '@/components/profile/ProfileInfo';
import PhoneBook from '@/components/profile/PhoneBook';
import AddressBook from '@/components/profile/AddressBook';
import EditProfileModal from '@/components/profile/EditProfileModal';
import EditPhoneModal from '@/components/profile/EditPhoneModal';
import { type Address, type Phone } from '@/types/profile';
import { type ProfileHeaderProps } from '@/lib/types/confirmation';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import EditAddressForm from '@/components/profile/EditAddressForm';
import { useProfile } from '@/lib/hooks/useProfile';

export default function ProfileHeader({ profile, onProfileUpdate }: ProfileHeaderProps) {
  const profileHook = useProfile(profile, onProfileUpdate);

  return (
    <div className="mb-6 rounded-lg bg-white p-0 sm:bg-gray-200 sm:p-5">
      <div className="flex flex-col items-center text-center">
        {/* profile */}
        <ProfileInfo
          profile={profile}
          currentBadge={profileHook.currentBadge}
          onEditProfile={profileHook.handleEditProfile}
          onUpdateEmail={profileHook.handleUpdateEmail}
          onLogout={profileHook.handleLogout}
        />
        
        <PhoneBook
          profile={profile}
          onAddPhone={profileHook.handleAddPhone}
          onEditPhone={profileHook.handleEditPhone}
          onDeletePhone={profileHook.handleDeletePhone}
          onTogglePrimaryPhone={profileHook.handleTogglePrimaryPhone}
          showAllPhones={profileHook.showAllPhones}
          onToggleShowAll={() => profileHook.setShowAllPhones(!profileHook.showAllPhones)}
        />
        <AddressBook
          addresses={profile.addresses}
          showAllAddresses={profileHook.showAllAddresses}
          onAddAddress={profileHook.handleAddAddress}
          onEditAddress={profileHook.handleEditAddress}
          onDeleteAddress={profileHook.handleDeleteAddress}
          onToggleDefault={profileHook.handleToggleDefault}
          onToggleShowAll={() => profileHook.setShowAllAddresses(!profileHook.showAllAddresses)}
        />
      </div>

      {/* Confirmation Dialog */}
      {profileHook.confirmDialog && (
        <ConfirmDialog
          open={profileHook.confirmDialog.open}
          title={profileHook.confirmDialog.title}
          message={profileHook.confirmDialog.message}
          confirmText={profileHook.confirmDialog.confirmText}
          cancelText={profileHook.confirmDialog.cancelText}
          destructive={profileHook.confirmDialog.destructive}
          onConfirm={profileHook.confirmDialog.onConfirm}
          onCancel={profileHook.confirmDialog.onCancel}
          hideConfirm={profileHook.confirmDialog.hideConfirm}
        />
      )}

      {/* Edit Address Form */}
      {profileHook.editingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={profileHook.handleCancelEdit} />

          {/* Form Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-address-title"
            className="bg-background relative z-50 mx-4 w-full max-w-2xl rounded-lg border p-6 shadow-lg"
          >
            <h2 id="edit-address-title" className="text-foreground mb-4 text-lg font-semibold">
              {profileHook.editingAddress === 'new' ? 'Add New Address' : 'Edit Address'}
            </h2>

            <EditAddressForm
              address={
                profileHook.editingAddress === 'new'
                  ? undefined
                  : profile.addresses.find(
                      (addr: Address) => addr.id === profileHook.editingAddress,
                    )
              }
              onSave={profileHook.handleSaveAddress}
              onCancel={profileHook.handleCancelEdit}
            />
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {profileHook.editingProfile && (
        <EditProfileModal
          profile={profile}
          editMode={profileHook.editMode}
          onSave={profileHook.handleSaveProfile}
          onCancel={profileHook.handleCancelEditProfile}
        />
      )}

      {/* Edit Phone Modal */}
      {profileHook.editingPhone && (
        <EditPhoneModal
          phone={
            profileHook.editingPhone === 'new'
              ? ''
              : profile.phones.find((p: Phone) => p.id === profileHook.editingPhone)?.number || ''
          }
          isAdding={profileHook.editingPhone === 'new'}
          onSave={profileHook.handleSavePhone}
          onCancel={profileHook.handleCancelEditPhone}
        />
      )}
    </div>
  );
}
