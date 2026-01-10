'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditPhoneModalProps {
  phone: string;
  isAdding?: boolean;
  onSave: (phone: string) => void;
  onCancel: () => void;
}

export default function EditPhoneModal({
  phone,
  isAdding = false,
  onSave,
  onCancel,
}: EditPhoneModalProps) {
  const phoneValidationSchema = Yup.object({
    phone: Yup.string()
      .matches(/^\+63\d{10}$/, 'Phone number must be in format +63XXXXXXXXXX')
      .required('Phone number is required'),
  });

  const initialValues = {
    phone: isAdding ? '' : phone,
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Phone Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-phone-title"
        className="bg-background relative mx-4 w-full max-w-md rounded-lg border p-6 shadow-lg"
      >
        <h2 id="edit-phone-title" className="text-foreground mb-4 text-lg font-semibold">
          {isAdding ? 'Add Phone Number' : 'Edit Phone Number'}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={phoneValidationSchema}
          onSubmit={values => {
            onSave(values.phone);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number*</Label>
                <Field
                  as={Input}
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+63 XXX XXX XXXX"
                  className={`border-gray-900 ${
                    errors.phone && touched.phone ? 'border-red-500' : ''
                  }`}
                />
                <ErrorMessage name="phone">
                  {msg => <div className="mt-1 text-xs text-red-500">{msg}</div>}
                </ErrorMessage>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isAdding ? 'Add' : 'Save'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
