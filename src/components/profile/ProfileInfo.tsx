'use client';

import React from 'react';
import Image from 'next/image';
import { User, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/data/profile';
import { type UserProfile } from '@/types/profile';

interface ProfileInfoProps {
  profile: UserProfile;
  currentBadge: {
    className: string;
    text: string;
  };
  onEditProfile: () => void;
  onUpdateEmail: () => void;
}

export default function ProfileInfo({
  profile,
  currentBadge,
  onEditProfile,
  onUpdateEmail,
}: ProfileInfoProps) {
  return (
    <div className={`mb-2 p-2`}>
      {/* Avatar */}
      <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full bg-gray-200">
        {profile.avatar ? (
          <Image
            src={profile.avatar}
            alt={`${profile.firstName} ${profile.lastName}`}
            fill
            className="object-cover"
          />
        ) : (
          <User className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
        )}
      </div>

      {/* Name */}
      <div className="mb-1 flex items-center justify-center gap-1">
        <h1 className="text-xl font-bold text-gray-900">
          {profile.firstName} {profile.lastName}
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="h-2 w-2 p-0 hover:bg-gray-100"
          onClick={onEditProfile}
        >
          <Pencil className="h-1 w-1 text-gray-500" style={{ fontSize: '10px !important' }} />
        </Button>
      </div>

      {/* Email */}
      <p className="mb-2 flex items-center justify-center gap-1 text-sm text-gray-600">
        {profile.email}
      
      </p>

      {/* Email Verification Helper */}
      <div className="mb-4 text-center">
          <Badge variant="default" className={currentBadge.className}>
          {currentBadge.text}
        </Badge>
        {profile.emailVerified ? (
          <p className="mx-auto mb-2 max-w-xs text-xs text-green-600">
            Your email is verified and secure
          </p>
        ) : (
          <p className="mx-auto mb-2 max-w-xs text-xs text-gray-400">
            Verify your email to secure your account
          </p>
        )}
        <div className="mb-4 flex justify-center gap-2">
          {!profile.emailVerified && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 py-0.5 text-xs"
              onClick={() => console.log('Send verification email')}
            >
              Verify Email
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 py-0.5 text-xs"
            onClick={onUpdateEmail}
          >
            Update Email
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mb-4 space-y-1">
        {profile.dateOfBirth && (
          <p className="text-xs text-gray-500">Born: {formatDate(profile.dateOfBirth)}</p>
        )}
        {profile.gender && (
          <p className="text-xs text-gray-500">
            Gender: {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
          </p>
        )}
        {/* Member Since */}
        <p className="mb-2 text-xs text-gray-500">
          Member since {formatDate(profile.stats.memberSince)}
        </p>
        <p className="mb-2 text-xs text-gray-500">
          Notif id: {profile.oneSignalUserId}
        </p>
      </div>
    </div>
  );
}
