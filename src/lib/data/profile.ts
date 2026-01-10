import { flashSaleProducts } from './products';
import { type Order, type UserProfile } from '../../types/profile';

// Dummy profile data
export const dummyProfile: UserProfile = {
  id: 'user_12345',
  firstName: 'Juan',
  lastName: 'Santos',
  email: 'juan.santos@example.com',
  phones: [
    {
      id: 'phone_1',
      type: 'mobile',
      number: '+6391712345678',
      isPrimary: true,
    },
    {
      id: 'phone_2',
      type: 'home',
      number: '+6392876543210',
      isPrimary: false,
    },
    {
      id: 'phone_3',
      type: 'work',
      number: '+6393456789012',
      isPrimary: false,
    },
  ],
  emailVerified: true,
  avatar: undefined,
  dateOfBirth: '1990-05-15',
  gender: 'male',
  preferences: {
    newsletter: true,
    smsNotifications: true,
    pushNotifications: true,
    language: 'en',
    currency: 'PHP',
  },
  stats: {
    totalOrders: 12,
    totalSpent: 2847.5,
    averageOrderValue: 237.29,
    favoriteCategories: ['Footwear', 'Electronics', 'Accessories'],
    loyaltyPoints: 1250,
    memberSince: '2022-03-15',
  },
  paymentMethods: [],
  orders: [
    {
      id: 'order_4',
      orderNumber: 'ORD-2024-004',
      date: '2025-01-10',
      orderDate: '2025-01-10T16:20:00Z',
      shippedDate: undefined,
      deliveredDate: undefined,
      status: 'pending',
      totalAmount: flashSaleProducts[4].price,
      items: [
        {
          product: flashSaleProducts[4],
          quantity: 1,
          price: flashSaleProducts[4].price,
        },
      ],
      shippingAddress: {
        street: '123 Main Street',
        city: 'Quezon City',
        state: 'Metro Manila',
        zipCode: '1100',
        country: 'Philippines',
      },
      paymentMethod: {
        type: 'apple_pay',
        paidAt: '2025-01-10T16:21:00Z',
        transactionId: 'apple_pay_111222333',
      },
      trackingNumber: undefined,
      carrier: undefined,
      estimatedDelivery: '2025-01-15T16:00:00Z',
    },
    {
      id: 'order_5',
      orderNumber: 'ORD-2024-005',
      date: '2025-01-12',
      orderDate: '2025-01-12T14:30:00Z',
      shippedDate: undefined,
      deliveredDate: undefined,
      status: 'pending',
      totalAmount: flashSaleProducts[0].price + flashSaleProducts[1].price,
      items: [
        {
          product: flashSaleProducts[0],
          quantity: 2,
          price: flashSaleProducts[0].price,
        },
        {
          product: flashSaleProducts[1],
          quantity: 1,
          price: flashSaleProducts[1].price,
        },
      ],
      shippingAddress: {
        street: '456 Oak Avenue',
        city: 'Makati',
        state: 'Metro Manila',
        zipCode: '1200',
        country: 'Philippines',
      },
      paymentMethod: {
        type: 'credit_card',
        lastFour: '8888',
        brand: 'Mastercard',
        paidAt: '2025-01-12T14:32:00Z',
        transactionId: 'txn_888999000',
      },
      trackingNumber: undefined,
      carrier: undefined,
      estimatedDelivery: '2025-01-17T16:00:00Z',
    },
    {
      id: 'order_6',
      orderNumber: 'ORD-2024-006',
      date: '2025-01-08',
      orderDate: '2025-01-08T11:20:00Z',
      shippedDate: undefined,
      deliveredDate: undefined,
      status: 'cancelled',
      totalAmount: flashSaleProducts[2].price,
      items: [
        {
          product: flashSaleProducts[2],
          quantity: 1,
          price: flashSaleProducts[2].price,
        },
      ],
      shippingAddress: {
        street: '789 Pine Street',
        city: 'Pasig',
        state: 'Metro Manila',
        zipCode: '1600',
        country: 'Philippines',
      },
      paymentMethod: {
        type: 'credit_card',
        lastFour: '3333',
        brand: 'Visa',
        paidAt: '2025-01-08T11:22:00Z',
        transactionId: 'txn_333444555',
      },
      trackingNumber: undefined,
      carrier: undefined,
      estimatedDelivery: '2025-01-13T16:00:00Z',
    },
    {
      id: 'order_1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      orderDate: '2024-01-15T10:30:00Z',
      shippedDate: '2024-01-16T14:00:00Z',
      deliveredDate: '2024-01-18T16:45:00Z',
      status: 'delivered',
      totalAmount: flashSaleProducts[0].price,
      items: [
        {
          product: flashSaleProducts[0],
          quantity: 1,
          price: flashSaleProducts[0].price,
        },
      ],
      shippingAddress: {
        street: '123 Main Street',
        city: 'Quezon City',
        state: 'Metro Manila',
        zipCode: '1100',
        country: 'Philippines',
      },
      paymentMethod: {
        type: 'credit_card',
        lastFour: '4242',
        brand: 'Visa',
        paidAt: '2024-01-15T10:32:00Z',
        transactionId: 'txn_123456789',
      },
      trackingNumber: 'TRK123456789',
      carrier: 'FedEx',
      estimatedDelivery: '2024-01-18T16:00:00Z',
    },
    {
      id: 'order_2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-20',
      orderDate: '2024-01-20T09:15:00Z',
      shippedDate: '2024-01-21T11:30:00Z',
      deliveredDate: undefined,
      status: 'shipped',
      totalAmount: flashSaleProducts[1].price + flashSaleProducts[2].price,
      items: [
        {
          product: flashSaleProducts[1],
          quantity: 1,
          price: flashSaleProducts[1].price,
        },
        {
          product: flashSaleProducts[2],
          quantity: 1,
          price: flashSaleProducts[2].price,
        },
      ],
      shippingAddress: {
        street: '123 Main Street',
        city: 'Quezon City',
        state: 'Metro Manila',
        zipCode: '1100',
        country: 'Philippines',
      },
      paymentMethod: {
        type: 'paypal',
        email: 'juan.santos@example.com',
        paidAt: '2024-01-20T09:16:00Z',
        transactionId: 'paypal_987654321',
      },
      trackingNumber: 'TRK987654321',
      carrier: 'UPS',
      estimatedDelivery: '2024-01-25T14:00:00Z',
    },
    {
      id: 'order_3',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-25',
      orderDate: '2024-01-25T14:45:00Z',
      shippedDate: undefined,
      deliveredDate: undefined,
      status: 'processing',
      totalAmount: flashSaleProducts[3].price,
      items: [
        {
          product: flashSaleProducts[3],
          quantity: 1,
          price: flashSaleProducts[3].price,
        },
      ],
      shippingAddress: {
        street: '123 Main Street',
        city: 'Quezon City',
        state: 'Metro Manila',
        zipCode: '1100',
        country: 'Philippines',
      },
      paymentMethod: {
        type: 'credit_card',
        lastFour: '5555',
        brand: 'Mastercard',
        paidAt: '2024-01-25T14:46:00Z',
        transactionId: 'txn_555666777',
      },
      trackingNumber: undefined,
      carrier: undefined,
      estimatedDelivery: '2024-01-30T16:00:00Z',
    },
  ],
  addresses: [
    {
      id: 'addr_1',
      type: 'home',
      isDefault: true,
      street: '123 Main Street, Phase 2',
      barangay: 'Barangay 123',
      city: 'Quezon City',
      province: 'Metro Manila',
      region: 'National Capital Region (NCR)',
      zipCode: '1100',
      country: 'Philippines',
      phone: '09172345678',
    },
    {
      id: 'addr_2',
      type: 'work',
      isDefault: false,
      street: '456 Business Avenue, 25th Floor',
      barangay: 'Barangay 456',
      city: 'Makati City',
      province: 'Metro Manila',
      region: 'National Capital Region (NCR)',
      zipCode: '1200',
      country: 'Philippines',
      phone: '09283456789',
    },
    {
      id: 'addr_3',
      type: 'other',
      isDefault: false,
      street: '789 Vacation Road',
      barangay: 'Barangay 789',
      city: 'Cebu City',
      province: 'Cebu',
      region: 'Central Visayas (Region VII)',
      zipCode: '6000',
      country: 'Philippines',
      phone: '09334567890',
    },
  ],
  wishlist: [
    {
      id: 'wish_1',
      product: flashSaleProducts[0],
      addedDate: '2024-01-10T10:15:00Z',
    },
    {
      id: 'wish_2',
      product: flashSaleProducts[1],
      addedDate: '2024-01-12T14:20:00Z',
    },
    {
      id: 'wish_3',
      product: flashSaleProducts[2],
      addedDate: '2024-01-14T09:45:00Z',
    },
  ],
  reviews: [
    {
      id: 'rev_1',
      product: flashSaleProducts[0],
      rating: 5,
      title: 'Great product!',
      content: 'Very satisfied with my purchase. Highly recommended!',
      date: '2024-01-16T11:30:00Z',
      helpful: 12,
      verified: true,
    },
    {
      id: 'rev_2',
      product: flashSaleProducts[1],
      rating: 4,
      title: 'Good quality',
      content: 'Product as described. Fast shipping.',
      date: '2024-01-18T16:20:00Z',
      helpful: 8,
      verified: true,
    },
    {
      id: 'rev_3',
      product: flashSaleProducts[2],
      rating: 5,
      title: 'Excellent service',
      content: 'Customer service was very helpful and responsive.',
      date: '2024-01-20T13:45:00Z',
      helpful: 15,
      verified: true,
    },
  ],
  recentlyViewed: [flashSaleProducts[0], flashSaleProducts[1], flashSaleProducts[2]],
};

// Helper functions
export const getOrderStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getOrderStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'shipped':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

export const formatCurrency = (amount: number, currency: string = 'PHP') => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
