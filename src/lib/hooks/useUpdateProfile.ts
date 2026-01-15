import { useState } from "react";
import * as Yup from 'yup';
import { useAppDispatch } from '@/lib/store';
import { showLoading, hideLoading } from '@/lib/features/loadingSlice';
import { showAlert } from '@/lib/features/alertSlice';
import { ProfileFormValues, FormErrors, AddressInput } from '@/lib/types/profile';
import { useUpdateProfile as useUpdateProfileIntegration } from './integration/useUpdateProfile';

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const { updateProfile: updateProfileAPI } = useUpdateProfileIntegration();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [collapsedAddresses, setCollapsedAddresses] = useState<Set<number>>(new Set());

  const phoneValidationSchema = Yup.object().shape({
    phones: Yup.array().of(
      Yup.object().shape({
        number: Yup.string()
          .matches(/^(\+63\d{10}|09\d{9})$/, 'Invalid Philippine phone format. Use +63XXXXXXXXXX or 09XXXXXXXXX')
          .required('Phone number is required'),
        type: Yup.string().required('Phone type is required'),
      })
    ).min(1, 'At least one phone number is required'),
  });

  const addressValidationSchema = Yup.object().shape({
    addresses: Yup.array().of(
      Yup.object().shape({
        region: Yup.string().required('Region is required'),
        province: Yup.string().required('Province is required'),
        city: Yup.string().required('City is required'),
        barangay: Yup.string().required('Barangay is required'),
        street: Yup.string().required('Street address is required'),
        zipCode: Yup.string()
          .matches(/^\d{4}$/, 'Postal code must be 4 digits')
          .required('Postal code is required'),
        country: Yup.string().required('Country is required'),
      })
    ).min(1, 'At least one complete address is required'),
  });

  const validateSingleAddress = (address: AddressInput) => {
    try {
      const singleAddressSchema = Yup.object().shape({
        addresses: Yup.array().of(
          Yup.object().shape({
            region: Yup.string().required('Region is required'),
            province: Yup.string().required('Province is required'),
            city: Yup.string().required('City is required'),
            barangay: Yup.string().required('Barangay is required'),
            street: Yup.string().required('Street address is required'),
            zipCode: Yup.string()
              .matches(/^\d{4}$/, 'Postal code must be 4 digits')
              .required('Postal code is required'),
            country: Yup.string().required('Country is required'),
          })
        ),
      });
      
      const testValues = {
        addresses: [address]
      };
      
      singleAddressSchema.validateSync(testValues, { abortEarly: false });
      return true;
    } catch (err) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return false;
    }
  };

  const validateForm = (values: ProfileFormValues, currentStep: number): FormErrors => {
    const errors: FormErrors = {};

    if (currentStep === 1) {
      // Use Yup validation for phones
      try {
        phoneValidationSchema.validateSync(values, { abortEarly: false });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach(error => {
            if (error.path) {
              errors[error.path] = error.message;
            }
          });
        }
      }
    } else {
      // Use Yup validation for addresses
      try {
        addressValidationSchema.validateSync(values, { abortEarly: false });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach(error => {
            if (error.path) {
              errors[error.path] = error.message;
            }
          });
        }
      }
    }

    return errors;
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // If starts with 0, keep as 09XXXXXXXXX format
    if (cleaned.startsWith('0')) {
      return cleaned.slice(0, 11);
    }
    // If starts with 63, format as +63XXXXXXXXXX
    else if (cleaned.startsWith('63')) {
      return '+' + cleaned.slice(0, 12);
    }
    // If starts with other digits and length is reasonable, assume local format
    else if (cleaned.length >= 9) {
      return cleaned.startsWith('09') ? cleaned.slice(0, 11) : '0' + cleaned.slice(0, 10);
    }
    
    return cleaned;
  };

  const handleSubmit = async (values: ProfileFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const validPhones = values.phones.filter(phone => phone.number.trim() !== '');
    const validAddresses = values.addresses.filter(addr => 
      validateSingleAddress(addr)
    );

    if (validPhones.length === 0 || validAddresses.length === 0) {
      dispatch(showAlert({
        title: 'Validation Error',
        message: 'Please add at least one phone number and one complete address.',
        variant: 'error',
      }));
      setSubmitting(false);
      return;
    }

    dispatch(showLoading({ message: 'Updating profile...' }));

    try {
      await updateProfileAPI({
        phones: validPhones,
        addresses: validAddresses,
      });

    } catch (error) {
      console.error('Profile update error:', error);
      dispatch(showAlert({
        title: 'Update Failed',
        message: 'Failed to update your profile. Please try again.',
        variant: 'error',
      }));
    } finally {
      setSubmitting(false);
      dispatch(hideLoading());
    }
  };

  const handleNext = async (values: ProfileFormValues) => {
    const stepErrors = validateForm(values, currentStep);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(currentStep + 1);
    }
  };

  const createHandleNext = (values: ProfileFormValues) => () => {
    return handleNext(values);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const getValidationState = (values: ProfileFormValues) => {
    const hasValidPhones = values.phones.some(phone => phone.number.trim() !== '');
    const hasValidAddresses = values.addresses.some(addr => 
      validateSingleAddress(addr)
    );
    const canProceed = currentStep === 1 ? hasValidPhones : hasValidAddresses;
    const canSubmit = hasValidPhones && hasValidAddresses;
    const canAddAddress = values.addresses.length === 0 || validateSingleAddress(values.addresses[values.addresses.length - 1]);

    return {
      hasValidPhones,
      hasValidAddresses,
      canProceed,
      canSubmit,
      canAddAddress
    };
  };

  return {
    // State
    loading,
    setLoading,
    currentStep,
    totalSteps,
    collapsedAddresses,
    setCollapsedAddresses,
    
    // Validation
    phoneValidationSchema,
    addressValidationSchema,
    validateForm,
    validateSingleAddress,
    formatPhoneNumber,
    
    // Handlers
    handleSubmit,
    handleNext,
    createHandleNext,
    handleBack,
    
    // Utilities
    getValidationState
  };
};