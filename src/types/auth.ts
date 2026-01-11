// Authentication related types

export interface SignupValues {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface OtpValues {
  otp: string;
  tempToken?: string;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  token?: string;
  user?: Record<string, unknown>;
  email?: string;
  tempToken?: string;
}
