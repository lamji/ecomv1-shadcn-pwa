'use client';

import React from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type UserProfile } from '@/types/profile';

interface PhoneBookProps {
  profile: UserProfile;
  onAddPhone: () => void;
  onEditPhone: (phoneId: string) => void;
  onDeletePhone: (phoneId: string) => void;
  onTogglePrimaryPhone: (phoneId: string) => void;
  showAllPhones?: boolean;
  onToggleShowAll?: () => void;
}

export default function PhoneBook({
  profile,
  onAddPhone,
  onEditPhone,
  onDeletePhone,
  onTogglePrimaryPhone,
  showAllPhones = false,
  onToggleShowAll,
}: PhoneBookProps) {
  const PhoneIcon = ({ className = '' }: { className?: string }) => (
    <svg className={`h-3 w-3 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );

  const displayPhones = showAllPhones ? profile.phones : profile.phones.slice(0, 2);
  const remainingCount = profile.phones.length - 2;

  return (
    <div className="w-full border-t px-2 pt-4" data-testid="phone-book">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Phone Numbers</h3>
        {profile.phones.length > 0 && (
          <Button variant="outline" size="sm" onClick={onAddPhone} className="h-7 w-7 p-0">
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      {profile.phones.length > 0 ? (
        <div className="space-y-2">
          {displayPhones.map(phone => (
            <div
              key={phone.id}
              className="flex items-start gap-2 rounded-lg bg-gray-50 p-2 text-left"
            >
              <div className="mt-0.5 text-gray-400">
                <PhoneIcon />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  {/* <p className="text-xs font-medium text-gray-900 capitalize">{phone.type}</p> */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Primary</span>
                    <button
                      onClick={() => onTogglePrimaryPhone(phone.id)}
                      disabled={phone.isPrimary}
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                        phone.isPrimary
                          ? 'bg-primary cursor-not-allowed'
                          : 'cursor-pointer bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          phone.isPrimary ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <p className="truncate text-xs text-gray-600">{phone.number}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onEditPhone(phone.id)}
                  className="h-6 w-6 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeletePhone(phone.id)}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}

          {profile.phones.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleShowAll}
              className="text-primary hover:text-primary w-full pt-1 text-xs"
            >
              {showAllPhones ? 'Show less' : `+${remainingCount} more`}
            </Button>
          )}
        </div>
      ) : (
        <div className="py-3 text-center">
          <PhoneIcon className="mx-auto mb-2 h-6 w-6 text-gray-300" />
          <p className="mb-3 text-xs text-gray-500">No phone numbers saved</p>
          <Button
            variant="default"
            size="sm"
            onClick={onAddPhone}
            className="mx-auto h-8 px-4 text-xs"
          >
            Add Your First Phone Number
          </Button>
        </div>
      )}
    </div>
  );
}
