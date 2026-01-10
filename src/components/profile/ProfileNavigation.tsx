'use client';

import React from 'react';
import { MapPin, Home, Building, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Address } from '@/types/profile';

interface AddressListProps {
  addresses: Address[];
  onEdit?: (address: Address) => void;
  onDelete?: (addressId: string) => void;
  onSetDefault?: (addressId: string) => void;
}

export default function AddressList({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressListProps) {
  const getAddressIcon = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getAddressTypeColor = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return 'bg-green-100 text-green-800';
      case 'work':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Shipping Addresses</h2>
          <Button size="sm">Add Address</Button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {addresses.map(address => (
            <div
              key={address.id}
              className={`relative rounded-lg border p-4 transition-colors ${
                address.isDefault
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {address.isDefault && (
                <div className="absolute -top-2 left-4">
                  <Badge className="bg-blue-600 text-white">Default</Badge>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 rounded-full p-2 ${getAddressTypeColor(address.type)}`}>
                    {getAddressIcon(address.type)}
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 capitalize">{address.type}</h3>
                      <Badge variant="outline" className="text-xs">
                        {address.type}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{address.street}</p>
                      <p>
                        {address.barangay}, {address.city}
                      </p>
                      <p>
                        {address.province}, {address.region}
                      </p>
                      <p>
                        {address.zipCode}, {address.country}
                      </p>
                      <p>{address.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!address.isDefault && onSetDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSetDefault(address.id)}
                      className="text-xs"
                    >
                      Set Default
                    </Button>
                  )}

                  {onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(address)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}

                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(address.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && (
            <div className="py-8 text-center">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No addresses yet</h3>
              <p className="mb-4 text-gray-600">Add your first shipping address to get started</p>
              <Button>Add Address</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
