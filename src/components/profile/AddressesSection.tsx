/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React from 'react';
import { Field, FieldArray, ErrorMessage } from 'formik';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';
import { AddressInput } from '@/lib/types/profile';


interface AddressesSectionProps {
  values: { addresses: AddressInput[] };
  collapsedAddresses: Set<number>;
  setCollapsedAddresses: React.Dispatch<React.SetStateAction<Set<number>>>;
  canAddAddress: boolean;
}

const addressTypeOptions = [
  { value: 'home', label: 'Home' },
  { value: 'work', label: 'Work' },
  { value: 'other', label: 'Other' }
];

export default function AddressesSection({
  values,
  collapsedAddresses,
  setCollapsedAddresses,
  canAddAddress
}: AddressesSectionProps) {
  const toggleAddressCollapse = (index: number) => {
    setCollapsedAddresses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        // If already collapsed, expand it
        newSet.delete(index);
      } else {
        // Collapse this one and expand others
        // Clear all and only collapse this one
        newSet.clear();
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      <FieldArray name="addresses">
        {({ push, remove }) => (
          <>
            {values.addresses.map((address, index) => {
              const isCollapsed = collapsedAddresses.has(index);
              
              return (
                <div key={address.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Address {index + 1}</Label>
                      {values.addresses.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAddressCollapse(index)}
                          className="h-6 w-6 p-0"
                        >
                          {isCollapsed ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`addresses.${index}.isDefault`} className="text-xs">Primary</Label>
                        <Field name={`addresses.${index}.isDefault`}>
                          {({ field, form }: { field: any; form: any }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                // If setting this address as primary, unset all others
                                if (checked) {
                                  values.addresses.forEach((a, i) => {
                                    form.setFieldValue(`addresses.${i}.isDefault`, i === index);
                                  });
                                } else {
                                  form.setFieldValue(field.name, false);
                                }
                              }}
                            />
                          )}
                        </Field>
                      </div>
                      {values.addresses.length > 1 && !address.isDefault && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="Cannot delete primary address"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {address.isDefault && (
                        <div className="h-8 w-8 p-0 flex items-center justify-center" title="Primary address cannot be deleted">
                          <Trash2 className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!isCollapsed && (
                    <div className="space-y-3">
                      <div>
                        <Label className="mb-2" htmlFor={`addresses.${index}.region`}>Region *</Label>
                        <Field name={`addresses.${index}.region`}>
                          {({ field }: { field: any; form: any }) => (
                            <Input
                              {...field}
                              placeholder="Region Name"
                            />
                          )}
                        </Field>
                        <ErrorMessage name={`addresses.${index}.region`} component="div" className="mt-1 text-xs text-destructive" />
                      </div>
                      
                      <div>
                        <Label className="mb-2" htmlFor={`addresses.${index}.province`}>Province *</Label>
                        <Field name={`addresses.${index}.province`}>
                          {({ field }: { field: any; form: any }) => (
                            <Input
                              {...field}
                              placeholder="Province Name"
                            />
                          )}
                        </Field>
                        <ErrorMessage name={`addresses.${index}.province`} component="div" className="mt-1 text-xs text-destructive" />
                      </div>
                      
                      <div>
                        <Label className="mb-2" htmlFor={`addresses.${index}.city`}>City *</Label>
                        <Field name={`addresses.${index}.city`}>
                          {({ field }: { field: any; form: any }) => (
                            <Input
                              {...field}
                              placeholder="City Name"
                            />
                          )}
                        </Field>
                        <ErrorMessage name={`addresses.${index}.city`} component="div" className="mt-1 text-xs text-destructive" />
                      </div>
                      
                      <div>
                        <Label className="mb-2" htmlFor={`addresses.${index}.barangay`}>Barangay *</Label>
                        <Field name={`addresses.${index}.barangay`}>
                          {({ field }: { field: any; form: any }) => (
                            <Input
                              {...field}
                              placeholder="Barangay Name"
                            />
                          )}
                        </Field>
                        <ErrorMessage name={`addresses.${index}.barangay`} component="div" className="mt-1 text-xs text-destructive" />
                      </div>
                      
                      <div>
                        <Label className="mb-2" htmlFor={`addresses.${index}.street`}>Street Address *</Label>
                        <Field name={`addresses.${index}.street`}>
                          {({ field }: { field: any; form: any }) => (
                            <Input
                              {...field}
                              placeholder="123 Main Street"
                            />
                          )}
                        </Field>
                        <ErrorMessage name={`addresses.${index}.street`} component="div" className="mt-1 text-xs text-destructive" />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <Label className="mb-2" htmlFor={`addresses.${index}.zipCode`}>ZIP Code *</Label>
                          <Field name={`addresses.${index}.zipCode`}>
                            {({ field }: { field: any; form: any }) => (
                              <Input
                                {...field}
                                placeholder="10001"
                              />
                            )}
                          </Field>
                          <ErrorMessage name={`addresses.${index}.zipCode`} component="div" className="mt-1 text-xs text-destructive" />
                        </div>
                        <div>
                          <Label className="mb-2" htmlFor={`addresses.${index}.country`}>Country *</Label>
                          <Field name={`addresses.${index}.country`}>
                            {({ field }: { field: any; form: any }) => (
                              <Input
                                {...field}
                                placeholder="Philippines"
                              />
                            )}
                          </Field>
                          <ErrorMessage name={`addresses.${index}.country`} component="div" className="mt-1 text-xs text-destructive" />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="mb-2" htmlFor={`addresses.${index}.nearestLandmark`}>Nearest Landmark</Label>
                        <Field name={`addresses.${index}.nearestLandmark`}>
                          {({ field }: { field: any; form: any }) => (
                            <Input
                              {...field}
                              placeholder="Near mall, church, etc."
                            />
                          )}
                        </Field>
                        <ErrorMessage name={`addresses.${index}.nearestLandmark`} component="div" className="mt-1 text-xs text-destructive" />
                      </div>
                      
                      <div>
                        <Label className="mb-2" htmlFor={`addresses.${index}.type`}>Type</Label>
                        <Field name={`addresses.${index}.type`}>
                          {({ field, form }: { field: any; form: any }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => form.setFieldValue(field.name, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {addressTypeOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (canAddAddress) {
                  push({
                    id: Date.now().toString(),
                    region: '',
                    province: '',
                    city: '',
                    barangay: '',
                    street: '',
                    zipCode: '',
                    country: '',
                    nearestLandmark: '',
                    type: 'home',
                    isDefault: values.addresses.length === 0
                  });
                  // Auto-collapse all previous addresses except the new one
                  setCollapsedAddresses(new Set(values.addresses.map((_, i) => i).slice(0, -1)));
                }
              }}
              disabled={!canAddAddress}
              className={`flex items-center gap-2 ${!canAddAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={!canAddAddress ? 'Please complete the current address before adding a new one' : 'Add new address'}
            >
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </>
        )}
      </FieldArray>
    </div>
  );
}
