'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Address } from '@/types/profile';

interface EditAddressFormProps {
  addresses?: Address[];
  address?: Address;
  isFirstAddress?: boolean;
  onSave: (address: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}

const philippineRegions = [
  'National Capital Region (NCR)',
  'Cordillera Administrative Region (CAR)',
  'Ilocos Region (Region I)',
  'Cagayan Valley (Region II)',
  'Central Luzon (Region III)',
  'CALABARZON (Region IV-A)',
  'MIMAROPA (Region IV-B)',
  'Bicol Region (Region V)',
  'Western Visayas (Region VI)',
  'Central Visayas (Region VII)',
  'Eastern Visayas (Region VIII)',
  'Zamboanga Peninsula (Region IX)',
  'Northern Mindanao (Region X)',
  'Davao Region (Region XI)',
  'SOCCSKSARGEN (Region XII)',
  'Caraga (Region XIII)',
  'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)',
];

export default function EditAddressForm({
  addresses,
  address,
  isFirstAddress = false,
  onSave,
  onCancel,
}: EditAddressFormProps) {
  const [showRegions, setShowRegions] = useState(false);
  const [filteredRegions, setFilteredRegions] = useState(philippineRegions);
  const regionInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formik = useFormik({
    initialValues: {
      region: address?.region || '',
      province: address?.province || '',
      city: address?.city || '',
      barangay: address?.barangay || '',
      street: address?.street || '',
      zipCode: address?.zipCode || '',
      country: address?.country || 'Philippines',
      nearestLandmark: address?.nearestLandmark || '',
      makeDefault: isFirstAddress ? true : Boolean(address?.isDefault || false),
    },
    validationSchema: Yup.object({
      region: Yup.string().required('Region is required'),
      province: Yup.string().required('Province is required'),
      city: Yup.string().required('City/Municipality is required'),
      barangay: Yup.string().required('Barangay is required'),
      street: Yup.string().required('Street address is required'),
      zipCode: Yup.string()
        .matches(/^\d{4}$/, 'Postal code must be 4 digits')
        .required('Postal code is required'),
      country: Yup.string().required('Country is required'),
    }),
    onSubmit: values => {
      onSave({
        type: address?.type || 'other', // Keep original type or default to 'other'
        region: values.region.trim(),
        province: values.province.trim(),
        city: values.city.trim(),
        barangay: values.barangay.trim(),
        street: values.street.trim(),
        zipCode: values.zipCode.trim(),
        country: values.country.trim(),
        phone: address?.phone || '', // Keep original phone
        nearestLandmark: values.nearestLandmark?.trim() || '',
        isDefault: values.makeDefault,
      });
    },
  });

  // Handle region input change
  const handleRegionChange = (value: string) => {
    formik.setFieldValue('region', value);
    const filtered = philippineRegions.filter(region =>
      region.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredRegions(filtered);
    setShowRegions(true);
  };

  // Handle region selection
  const handleRegionSelect = (region: string) => {
    formik.setFieldValue('region', region);
    setShowRegions(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        regionInputRef.current &&
        !regionInputRef.current.contains(event.target as Node)
      ) {
        setShowRegions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-h-[80vh] space-y-4 overflow-y-auto"
      data-testid="edit-address-form"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Region */}
        <div className="space-y-2" data-testid="region-field">
          <Label htmlFor="region" data-testid="region-label">
            Region *
          </Label>
          <div className="relative" data-testid="region-input-container">
            <Input
              ref={regionInputRef}
              id="region"
              name="region"
              type="text"
              placeholder="Type to search regions..."
              value={formik.values.region}
              onChange={e => handleRegionChange(e.target.value)}
              onFocus={() => setShowRegions(true)}
              onBlur={() => setTimeout(() => setShowRegions(false), 200)}
              className={formik.errors.region ? 'border-red-500' : ''}
              data-testid="region-input"
            />
            {showRegions && filteredRegions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 left-0 z-[120] mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
                data-testid="region-dropdown"
              >
                {filteredRegions.map(region => (
                  <div
                    key={region}
                    onClick={() => handleRegionSelect(region)}
                    className="cursor-pointer px-3 py-2 text-left text-sm hover:bg-gray-100"
                    data-testid={`region-option-${region.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  >
                    {region}
                  </div>
                ))}
              </div>
            )}
          </div>
          {formik.errors.region && (
            <p className="text-sm text-red-500" data-testid="region-error">
              {formik.errors.region}
            </p>
          )}
        </div>

        {/* Province */}
        <div className="space-y-2" data-testid="province-field">
          <Label htmlFor="province" data-testid="province-label">
            Province *
          </Label>
          <Input
            id="province"
            name="province"
            placeholder="Province name"
            value={formik.values.province}
            onChange={formik.handleChange}
            className={formik.errors.province ? 'border-red-500' : ''}
            data-testid="province-input"
          />
          {formik.errors.province && (
            <p className="text-sm text-red-500" data-testid="province-error">
              {formik.errors.province}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* City/Municipality */}
        <div className="space-y-2" data-testid="city-field">
          <Label htmlFor="city" data-testid="city-label">
            City/Municipality *
          </Label>
          <Input
            id="city"
            name="city"
            placeholder="City or Municipality"
            value={formik.values.city}
            onChange={formik.handleChange}
            className={formik.errors.city ? 'border-red-500' : ''}
            data-testid="city-input"
          />
          {formik.errors.city && (
            <p className="text-sm text-red-500" data-testid="city-error">
              {formik.errors.city}
            </p>
          )}
        </div>

        {/* Barangay */}
        <div className="space-y-2" data-testid="barangay-field">
          <Label htmlFor="barangay" data-testid="barangay-label">
            Barangay *
          </Label>
          <Input
            id="barangay"
            name="barangay"
            placeholder="Barangay name"
            value={formik.values.barangay}
            onChange={formik.handleChange}
            className={formik.errors.barangay ? 'border-red-500' : ''}
            data-testid="barangay-input"
          />
          {formik.errors.barangay && (
            <p className="text-sm text-red-500" data-testid="barangay-error">
              {formik.errors.barangay}
            </p>
          )}
        </div>
      </div>

      {/* Street Address */}
      <div className="space-y-2" data-testid="street-field">
        <Label htmlFor="street" data-testid="street-label">
          Street Address *
        </Label>
        <Input
          id="street"
          name="street"
          placeholder="House/Unit Number, Building Name, Street Name"
          value={formik.values.street}
          onChange={formik.handleChange}
          className={formik.errors.street ? 'border-red-500' : ''}
          data-testid="street-input"
        />
        {formik.errors.street && (
          <p className="text-sm text-red-500" data-testid="street-error">
            {formik.errors.street}
          </p>
        )}
      </div>

      {/* Nearest Landmark */}
      <div className="space-y-2" data-testid="landmark-field">
        <Label htmlFor="nearestLandmark" data-testid="landmark-label">
          Nearest Landmark (Optional)
        </Label>
        <Input
          id="nearestLandmark"
          name="nearestLandmark"
          placeholder="e.g., Behind SM Mall, Across from Park, Near Building"
          value={formik.values.nearestLandmark || ''}
          onChange={formik.handleChange}
          data-testid="landmark-input"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Postal Code */}
        <div className="space-y-2" data-testid="zipcode-field">
          <Label htmlFor="zipCode" data-testid="zipcode-label">
            Postal Code *
          </Label>
          <Input
            id="zipCode"
            name="zipCode"
            type="text"
            placeholder="XXXX"
            maxLength={4}
            value={formik.values.zipCode}
            onChange={e => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              formik.setFieldValue('zipCode', value);
            }}
            className={formik.errors.zipCode ? 'border-red-500' : ''}
            data-testid="zipcode-input"
          />
          {formik.errors.zipCode && (
            <p className="text-sm text-red-500" data-testid="zipcode-error">
              {formik.errors.zipCode}
            </p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-2" data-testid="country-field">
          <Label htmlFor="country" data-testid="country-label">
            Country
          </Label>
          <Input
            id="country"
            name="country"
            placeholder="Country"
            value={formik.values.country}
            onChange={formik.handleChange}
            disabled
            data-testid="country-input"
          />
        </div>
      </div>

      {/* Make Default Checkbox - Only show when addresses array is empty */}
      {addresses && addresses.length === 0 && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="makeDefault"
            name="makeDefault"
            disabled={true}
            checked={true}
            onChange={formik.handleChange}
            className="h-4 w-4 rounded border-blue-600 bg-blue-600 text-white focus:ring-blue-500 disabled:border-blue-600 disabled:bg-blue-600 disabled:opacity-75"
          />
          <Label htmlFor="makeDefault" className="text-sm text-gray-700">
            Make this my default address (Default for new address)
          </Label>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4" data-testid="form-actions">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="cancel-button">
          Cancel
        </Button>
        <Button type="submit" data-testid="submit-button">
          {address ? 'Update Address' : 'Add Address'}
        </Button>
      </div>
    </form>
  );
}
