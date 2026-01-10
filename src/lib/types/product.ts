import type { Review } from '@/lib/hooks/useProductReviews';

export type ProductCardProps = {
  id: string; // Product ID
  imageSrc: string;
  imageAlt?: string;
  title: string;
  price?: number | string;
  originalPrice?: number | string;
  discountPercent?: number; // e.g., 50 for -50%
  rating?: number; // e.g., 4.5
  reviewCount?: number; // e.g., 24
  soldCount?: number;
  showType?: boolean;
  productType?: 'flash' | 'new' | 'regular';
  className?: string;
  // If true, load image eagerly with high fetch priority (for above-the-fold items)
  priority?: boolean;
  images?: string[];
  description?: string;
  sizes?: string[];
  onClick?: () => void;
  // Text color customization for different backgrounds
  textColor?: 'white' | 'black' | 'gray';
  priceColor?: 'white' | 'black' | 'gray';
  badgeColor?: 'yellow' | 'red' | 'blue';
  stock?: number;
  reviews?: Review[]; // Product reviews data
};

export type ProductType = 'flash' | 'new' | 'regular';
export type TextColor = 'white' | 'black' | 'gray';
export type BadgeColor = 'yellow' | 'red' | 'blue';
