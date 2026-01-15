import { Product } from '../lib/data/products';

// Enums for type values
export enum ContactType {
  MOBILE = 'mobile',
  HOME = 'home',
  WORK = 'work'
}

export enum AddressType {
  HOME = 'home',
  WORK = 'work',
  OTHER = 'other'
}

export enum PaymentType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  GCASH = 'gcash'
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// Base interfaces for reusability
export interface BaseItem {
  id: string;
}

export interface BaseContact {
  type: ContactType;
}

export interface BaseAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Specific interfaces extending base interfaces
export interface Phone extends BaseContact, BaseItem {
  number: string;
  isPrimary: boolean;
}

export interface Address extends BaseItem {
  type: AddressType;
  isDefault: boolean;
  street: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  zipCode: string;
  country: string;
  phone: string;
  nearestLandmark?: string;
}

export interface PaymentMethod extends BaseItem {
  type: PaymentType;
  isDefault: boolean;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string;
  number?: string;
}

export interface UpdateProfileData {
  phones: Omit<Phone, keyof BaseItem>[]; // Remove id from Phone for update
  addresses: Omit<Address, keyof BaseItem>[]; // Remove id from Address for update
}

export interface Order extends BaseItem {
  orderNumber: string;
  date: string;
  orderDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  status: OrderStatus;
  totalAmount: number;
  items: {
    product: Product;
    quantity: number;
    price: number;
  }[];
  shippingAddress: BaseAddress;
  paymentMethod: {
    type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
    lastFour?: string;
    brand?: string;
    email?: string;
    paidAt: string;
    transactionId: string;
  };
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

export interface WishlistItem extends BaseItem {
  product: Product;
  addedDate: string;
}

export interface Review extends BaseItem {
  product: Product;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
}

export interface ProfileStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteCategories: string[];
  loyaltyPoints: number;
  memberSince: string;
}

export interface UserProfile extends BaseItem {
  firstName: string;
  lastName: string;
  email: string;
  phones: Phone[];
  emailVerified: boolean;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  oneSignalUserId?: string;
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    currency: string;
  };
  stats: ProfileStats;
  orders: Order[];
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  wishlist: WishlistItem[];
  reviews: Review[];
  recentlyViewed: Product[];
}
