import { Product } from './products';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
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
  paymentMethod: string;
  trackingNumber?: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  isDefault: boolean;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string;
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
  phone: string;
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

// Dummy profile data
export const dummyProfile: UserProfile = {
  id: 'user_123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: '/images/avatar.jpg',
  dateOfBirth: '1990-05-15',
  gender: 'male',
  bio: 'Fashion enthusiast and tech lover. Always looking for the latest trends and best deals.',
  preferences: {
    newsletter: true,
    smsNotifications: false,
    pushNotifications: true,
    language: 'en',
    currency: 'USD',
  },
  stats: {
    totalOrders: 12,
    totalSpent: 2847.5,
    averageOrderValue: 237.29,
    favoriteCategories: ['Footwear', 'Electronics', 'Accessories'],
    loyaltyPoints: 1250,
    memberSince: '2022-03-15',
  },
  orders: [
    {
      id: 'order_1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      totalAmount: 299.99,
      items: [
        {
          product: {
            id: 'p1',
            title: "Classic Men's Leather Shoes",
            price: 299.99,
            imageSrc: '/images/products/shoes-1.jpg',
            imageAlt: "Classic Men's Leather Shoes",
            description: 'Premium leather shoes for formal occasions',
            category: 'Footwear',
            type: 'regular',
            rating: 4.5,
            reviewCount: 128,
            soldCount: 456,
            discountPercent: 0,
            originalPrice: 399.99,
            sizes: ['7', '8', '9', '10', '11'],
            images: ['/images/products/shoes-1.jpg', '/images/products/shoes-2.jpg'],
            stock: 15,
            reviews: [],
          },
          quantity: 1,
          price: 299.99,
        },
      ],
      shippingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      paymentMethod: 'Credit Card ending in 4242',
      trackingNumber: 'TRK123456789',
    },
    {
      id: 'order_2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      totalAmount: 189.99,
      items: [
        {
          product: {
            id: 'p2',
            title: 'Wireless Bluetooth Headphones',
            price: 189.99,
            imageSrc: '/images/products/headphones-1.jpg',
            imageAlt: 'Wireless Bluetooth Headphones',
            description: 'High-quality wireless headphones with noise cancellation',
            category: 'Electronics',
            type: 'flash',
            rating: 4.8,
            reviewCount: 89,
            soldCount: 234,
            discountPercent: 20,
            originalPrice: 239.99,
            sizes: [],
            images: ['/images/products/headphones-1.jpg', '/images/products/headphones-2.jpg'],
            stock: 8,
            reviews: [],
          },
          quantity: 1,
          price: 189.99,
        },
      ],
      shippingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      paymentMethod: 'PayPal',
      trackingNumber: 'TRK987654321',
    },
  ],
  addresses: [
    {
      id: 'addr_1',
      type: 'home',
      isDefault: true,
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
    },
    {
      id: 'addr_2',
      type: 'work',
      isDefault: false,
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      phone: '+1 (555) 987-6543',
    },
  ],
  paymentMethods: [
    {
      id: 'pm_1',
      type: 'credit_card',
      isDefault: true,
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
    },
    {
      id: 'pm_2',
      type: 'paypal',
      isDefault: false,
      email: 'john.doe@example.com',
    },
  ],
  wishlist: [
    {
      id: 'wish_1',
      product: {
        id: 'p3',
        title: 'Smart Watch Series 5',
        price: 349.99,
        imageSrc: '/images/products/watch-1.jpg',
        imageAlt: 'Smart Watch Series 5',
        description: 'Advanced smartwatch with health tracking',
        category: 'Electronics',
        type: 'new',
        rating: 4.7,
        reviewCount: 156,
        soldCount: 89,
        discountPercent: 0,
        originalPrice: 399.99,
        sizes: [],
        images: ['/images/products/watch-1.jpg', '/images/products/watch-2.jpg'],
        stock: 12,
        reviews: [],
      },
      addedDate: '2024-01-10',
    },
  ],
  reviews: [
    {
      id: 'review_1',
      product: {
        id: 'p1',
        title: "Classic Men's Leather Shoes",
        price: 299.99,
        imageSrc: '/images/products/shoes-1.jpg',
        imageAlt: "Classic Men's Leather Shoes",
        description: 'Premium leather shoes for formal occasions',
        category: 'Footwear',
        type: 'regular',
        rating: 4.5,
        reviewCount: 128,
        soldCount: 456,
        discountPercent: 0,
        originalPrice: 399.99,
        sizes: ['7', '8', '9', '10', '11'],
        images: ['/images/products/shoes-1.jpg', '/images/products/shoes-2.jpg'],
        stock: 15,
        reviews: [],
      },
      rating: 5,
      title: 'Excellent Quality!',
      content: 'These shoes are amazing! Perfect fit and great quality. Highly recommend!',
      date: '2024-01-16',
      helpful: 12,
      verified: true,
    },
  ],
  recentlyViewed: [
    {
      id: 'p4',
      title: 'Designer Sunglasses',
      price: 159.99,
      imageSrc: '/images/products/sunglasses-1.jpg',
      imageAlt: 'Designer Sunglasses',
      description: 'Stylish designer sunglasses with UV protection',
      category: 'Accessories',
      type: 'regular',
      rating: 4.6,
      reviewCount: 67,
      soldCount: 123,
      discountPercent: 0,
      originalPrice: 199.99,
      sizes: [],
      images: ['/images/products/sunglasses-1.jpg', '/images/products/sunglasses-2.jpg'],
      stock: 25,
      reviews: [],
    },
  ],
};

// Helper functions
export const getOrderStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
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

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
