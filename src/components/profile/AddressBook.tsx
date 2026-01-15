'use client';

import React from 'react';
import { MapPin, Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Address } from '@/types/profile';

interface AddressBookProps {
  addresses: Address[];
  showAllAddresses: boolean;
  onAddAddress: () => void;
  onEditAddress: (addressId: string) => void;
  onDeleteAddress: (addressId: string) => void;
  onToggleDefault: (addressId: string) => void;
  onToggleShowAll: () => void;
}

export default function AddressBook({
  addresses,
  showAllAddresses,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onToggleDefault,
  onToggleShowAll,
}: AddressBookProps) {
  const getAddressIcon = () => {
    return <MapPin className="h-3 w-3" />;
  };

  return (
    <div className="w-full border-t px-2 pt-4" data-testid="address-book">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900" data-testid="address-book-title">
          Shipping Addresses
        </h3>
        {addresses.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddAddress}
            className="h-7 w-7 p-0"
            data-testid="add-address-button"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      {addresses.length > 0 ? (
        <div className="space-y-2">
          {(showAllAddresses ? addresses : addresses.slice(0, 2)).map((address,id) => (
            <div
              key={id}
              className="flex items-start gap-2 rounded-lg bg-gray-50 p-2 text-left"
              data-testid={`address-item-${id}`}
            >
              <div className="mt-0.5 text-gray-400">{getAddressIcon()}</div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-900" data-testid="address-label">
                    Address
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500" data-testid="default-label">
                      Default
                    </span>
                    <button
                      onClick={() => onToggleDefault(address.id)}
                      disabled={address.isDefault}
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                        address.isDefault
                          ? 'bg-primary cursor-not-allowed'
                          : 'cursor-pointer bg-gray-200 hover:bg-gray-300'
                      }`}
                      data-testid={`default-toggle-${address.id}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          address.isDefault ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600" data-testid={`address-text-${address.id}`}>
                  {address.street}, {address.city}, {address.zipCode}, {address.country}
                </p>
                {address.nearestLandmark && (
                  <>
                    <div className="my-3 border-t border-gray-200"></div>
                    <p
                      className="text-xs text-gray-500"
                      data-testid={`address-landmark-${address.id}`}
                    >
                      📍 {address.nearestLandmark}
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onEditAddress(address.id)}
                  className="h-6 w-6 p-0"
                  data-testid={`edit-address-${address.id}`}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteAddress(address.id)}
                  className="h-6 w-6 p-0"
                  data-testid={`delete-address-${address.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}

          {addresses.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleShowAll}
              className="text-primary hover:text-primary w-full pt-1 text-xs"
              data-testid="toggle-show-all-addresses"
            >
              {showAllAddresses ? 'Show less addresses' : `+${addresses.length - 2} more addresses`}
            </Button>
          )}
        </div>
      ) : (
        <div className="py-3 text-center">
          <MapPin className="mx-auto mb-2 h-6 w-6 text-gray-300" data-testid="no-addresses-icon" />
          <p className="mb-3 text-xs text-gray-500" data-testid="no-addresses-text">
            No addresses saved
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={onAddAddress}
            className="mx-auto h-8 px-4 text-xs"
            data-testid="add-first-address-button"
          >
            Add Your First Address
          </Button>
        </div>
      )}
    </div>
  );
}
