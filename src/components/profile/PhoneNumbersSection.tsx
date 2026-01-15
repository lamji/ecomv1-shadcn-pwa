/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React from 'react';
import { Field, FieldArray, ErrorMessage } from 'formik';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import { PhoneInput } from '@/lib/types/profile';


interface PhoneNumbersSectionProps {
  values: { phones: PhoneInput[] };
  setFieldValue: (field: string, value: any) => void;
  formatPhoneNumber: (value: string) => string;
  touched: any;
  errors: any;
}

const phoneTypeOptions = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'home', label: 'Home' },
  { value: 'work', label: 'Work' }
];

export default function PhoneNumbersSection({
  values,
  setFieldValue,
  formatPhoneNumber,
  touched,
  errors
}: PhoneNumbersSectionProps) {
  return (
    <div className="space-y-4">
      <FieldArray name="phones">
        {({ push, remove }) => (
          <>
            {values.phones.map((phone, index) => (
              <div key={phone.id} className="rounded-lg border-0 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <Label className="text-sm font-medium">Phone {index + 1}</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`phones.${index}.isPrimary`} className="text-xs">Primary</Label>
                      <Field name={`phones.${index}.isPrimary`}>
                        {({ field, form }: { field: any; form: any }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              // If setting this phone as primary, unset all others
                              if (checked) {
                                values.phones.forEach((p, i) => {
                                  form.setFieldValue(`phones.${i}.isPrimary`, i === index);
                                });
                              } else {
                                form.setFieldValue(field.name, false);
                              }
                            }}
                          />
                        )}
                      </Field>
                    </div>
                    {values.phones.length > 1 && !phone.isPrimary && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Cannot delete primary phone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {phone.isPrimary && (
                      <div className="h-8 w-8 p-0 flex items-center justify-center" title="Primary phone cannot be deleted">
                        <Trash2 className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="mb-2" htmlFor={`phones.${index}.number`}>Phone Number *</Label>
                    <Field name={`phones.${index}.number`}>
                      {({ field, form }: { field: any; form: any }) => (
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+639123456789 or 09123456789"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            form.setFieldValue(field.name, formatted);
                          }}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            field.onBlur(e);
                            form.setFieldTouched(field.name, true);
                            form.validateForm();
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name={`phones.${index}.number`} component="div" className="mt-1 text-xs text-destructive" />
                    {touched.phones?.[index]?.number && (errors as any)[`phones.${index}.number`] && (
                      <div className="mt-1 text-xs text-destructive">
                        {(errors as any)[`phones.${index}.number`]}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor={`phones.${index}.type`}>Type</Label>
                    <Field name={`phones.${index}.type`}>
                      {({ field, form }: { field: any; form: any }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => form.setFieldValue(field.name, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {phoneTypeOptions.map(option => (
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
                
                {!phone.isPrimary && values.phones.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Set all phones to non-primary, then set this one as primary
                      values.phones.forEach((p, i) => {
                        setFieldValue(`phones.${i}.isPrimary`, i === index);
                      });
                    }}
                    className="mt-2 text-xs"
                  >
                    Set as primary
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => push({
                id: Date.now().toString(),
                number: '',
                type: 'mobile',
                isPrimary: values.phones.length === 0
              })}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Phone
            </Button>
          </>
        )}
      </FieldArray>
    </div>
  );
}
