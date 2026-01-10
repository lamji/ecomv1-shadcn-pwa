'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type UserProfile } from '@/types/profile';

interface EditProfileModalProps {
  profile: UserProfile;
  editMode: 'name' | 'email';
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
}

export default function EditProfileModal({
  profile,
  editMode,
  onSave,
  onCancel,
}: EditProfileModalProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Profile Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="bg-background relative mx-4 w-full max-w-md rounded-lg border p-6 shadow-lg"
      >
        <h2 id="edit-profile-title" className="text-foreground mb-4 text-lg font-semibold">
          Edit Profile
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">{`${editMode === 'name' ? 'Full Name' : 'Email'}`}*</Label>
            <Input
              id={editMode === 'name' ? 'fullName' : 'email'}
              name={editMode === 'name' ? 'fullName' : 'email'}
              type={editMode === 'name' ? 'text' : 'email'}
              defaultValue={
                editMode === 'name' ? `${profile.firstName} ${profile.lastName}` : profile.email
              }
              className="border-gray-900"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={() => onSave(profile)}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
