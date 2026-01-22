'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import PhoneNumbersSection from '@/components/profile/PhoneNumbersSection';
import AddressesSection from '@/components/profile/AddressesSection';
import NavigationButtons from '@/components/profile/NavigationButtons';
import { ProfileFormValues } from '@/lib/types/profile';
import { useUpdateProfile } from '@/lib/hooks/useUpdateProfile';
import { useRouter } from 'next/navigation';

const initialValues: ProfileFormValues = {
  phones: [{ id: '1', number: '', type: 'mobile', isPrimary: true, isVerified: false }],
  addresses: [
    {
      id: '1',
      type: 'home',
      isDefault: true,
      street: '',
      barangay: '',
      city: '',
      province: '',
      region: '',
      zipCode: '',
      country: '',
      nearestLandmark: '',
    },
  ],
};

export default function UpdateProfilePage() {
  const router = useRouter();
  const {
    currentStep,
    totalSteps,
    collapsedAddresses,
    setCollapsedAddresses,
    phoneValidationSchema,
    addressValidationSchema,
    validateForm,
    formatPhoneNumber,
    handleSubmit,
    createHandleNext,
    handleBack,
    getValidationState,
  } = useUpdateProfile();

  return (
    <div className="min-h-screen bg-white py-8">
      {/* Back to Home Button */}
      <div className="mt-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 transition-colors hover:cursor-pointer hover:text-gray-900"
        >
          <ArrowLeft className="h-6 w-6" />
          Home
        </button>
      </div>
      <div className="mx-auto max-w-4xl px-0 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-orange-100 p-3">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-gray-600">
            Add your phone number and address to enable shopping cart functionality
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  currentStep >= 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Phone className="h-5 w-5" />
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep >= 1 ? 'text-primary' : 'text-gray-500'
                }`}
              >
                Phone Number
              </span>
            </div>
            <div className={`h-0.5 w-16 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  currentStep >= 2
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <MapPin className="h-5 w-5" />
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep >= 2 ? 'text-primary' : 'text-gray-500'
                }`}
              >
                Address
              </span>
            </div>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={currentStep === 1 ? phoneValidationSchema : addressValidationSchema}
          validate={values => validateForm(values, currentStep)}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue, touched, errors }) => {
            const { hasValidPhones, hasValidAddresses, canProceed, canSubmit, canAddAddress } =
              getValidationState(values);

            return (
              <Form className="space-y-8">
                {/* Step 1: Phone Numbers */}
                {currentStep === 1 && (
                  <Card className="border-0 shadow-none">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone className="text-primary h-5 w-5" />
                          <CardTitle>Phone Numbers</CardTitle>
                          {hasValidPhones && <CheckCircle className="h-5 w-5 text-green-600" />}
                        </div>
                      </div>
                      <CardDescription>
                        Add at least one phone number for order notifications and delivery updates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 border-0 shadow-none">
                      <PhoneNumbersSection
                        values={values}
                        setFieldValue={setFieldValue}
                        formatPhoneNumber={formatPhoneNumber}
                        touched={touched}
                        errors={errors}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Addresses */}
                {currentStep === 2 && (
                  <Card className="border-0 shadow-none">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="text-primary h-5 w-5" />
                          <CardTitle>Addresses</CardTitle>
                          {hasValidAddresses && <CheckCircle className="h-5 w-5 text-green-600" />}
                        </div>
                      </div>
                      <CardDescription>
                        Add at least one complete address for delivery
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 border-0 shadow-none">
                      <AddressesSection
                        values={values}
                        collapsedAddresses={collapsedAddresses}
                        setCollapsedAddresses={setCollapsedAddresses}
                        canAddAddress={canAddAddress}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Navigation Buttons */}
                <NavigationButtons
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  canProceed={canProceed}
                  canSubmit={canSubmit}
                  isSubmitting={isSubmitting}
                  onBack={handleBack}
                  onNext={createHandleNext(values)}
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
