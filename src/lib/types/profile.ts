export interface PhoneInput {
  id: string;
  number: string;
  type: 'mobile' | 'home' | 'work';
  isPrimary: boolean;
  isVerified?: boolean;
}

export interface AddressInput {
  id: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  street: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  zipCode: string;
  country: string;
  nearestLandmark?: string;
}

export interface ProfileFormValues {
  phones: PhoneInput[];
  addresses: AddressInput[];
}

export interface FormErrors {
  phones?: string;
  addresses?: string;
  [key: string]: string | undefined;
}

export interface FormikHelpers {
  setSubmitting: (isSubmitting: boolean) => void;
}
