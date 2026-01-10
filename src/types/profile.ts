import { Product } from '../lib/data/products';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  orderDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: {
    product: Product;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
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

export interface Address {
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
  phone: string;
  nearestLandmark?: string;
}

export interface Phone {
  id: string;
  type: 'mobile' | 'home' | 'work';
  number: string;
  isPrimary: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'gcash';
  isDefault: boolean;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string;
  number?: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedDate: string;
}

export interface Review {
  id: string;
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

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phones: Phone[];
  emailVerified: boolean;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
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
