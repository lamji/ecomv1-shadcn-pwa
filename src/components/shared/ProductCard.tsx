import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/helper/currency';
import { StarRating } from './StarRating';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import { useProductReviews } from '@/lib/hooks/useProductReviews';
import type { Review } from '@/lib/hooks/useProductReviews';

type ProductCardProps = {
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
  // If true, load image eagerly with high fetch priority (use for above-the-fold items)
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

export default function ProductCard({
  id,
  imageSrc,
  imageAlt = '',
  title,
  price,
  originalPrice,
  discountPercent,
  rating,
  reviewCount,
  soldCount,
  showType,
  productType,
  priority = false,

  textColor = 'black',
  priceColor = 'black',
  badgeColor = 'red',
  stock,
  reviews,
}: ProductCardProps) {
  const { addToCart } = useAddToCart();
  const router = useRouter();
  const hasDiscount = typeof discountPercent === 'number' && discountPercent > 0;
  const isOutOfStock = stock === 0;

  // Get reviews data using the hook
  const reviewsData = useProductReviews(reviews || []);

  const formatSoldCount = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}m`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
    return String(count);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      // Create product object for the cart
      const product = {
        id, // Use the actual product ID
        title,
        price: Number(originalPrice || price || 0),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        discountPercent,
        rating: rating || 0,
        reviewCount: reviewCount || 0,
        soldCount: soldCount || 0,
        imageSrc,
        imageAlt,
        stock: stock || 0,
        description: '',
        categoryId: '',
        category: '',
        type: productType || 'regular',
        images: [],
        sizes: [],
      };

      console.log('handleAddToCart', { product, id });

      addToCart(product, 1);
    }
  };

  const handleProductClick = () => {
    // Extract product ID from the data or generate it
    const productId = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Navigate to product page
    router.push(`/product/${productId}`);
  };

  // Color classes for different backgrounds
  const colorClasses = {
    white: {
      title: 'text-white',
      price: 'text-white',
      originalPrice: 'text-gray-300',
      badge: 'bg-yellow-600 text-white',
      typeBadge: 'bg-white/20 text-white',
    },
    black: {
      title: 'text-gray-900',
      price: 'text-gray-900',
      originalPrice: 'text-gray-500',
      badge: 'bg-red-600 text-white',
      typeBadge: 'bg-gray-100 text-gray-700',
    },
    gray: {
      title: 'text-gray-700',
      price: 'text-gray-700',
      originalPrice: 'text-gray-400',
      badge: 'bg-red-600 text-white',
      typeBadge: 'bg-gray-100 text-gray-700',
    },
  };

  return (
    <div
      className={`group relative rounded-lg shadow-none transition`}
      // role={onClick ? 'button' : undefined}
      // onClick={isOutOfStock ? undefined : handleProductClick}
      data-testid="product-card"
    >
      <div
        className="group relative overflow-hidden rounded-lg bg-gray-100 p-3"
        data-testid="product-card-media"
      >
        {/* Hover Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/50 p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            className="flex w-full max-w-[180px] items-center justify-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-medium text-gray-900 shadow-lg hover:bg-gray-100"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <Button
            variant="outline"
            className={`w-full max-w-[180px] border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white ${
              isOutOfStock ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={e => {
              e.stopPropagation();
              if (!isOutOfStock) {
                handleProductClick();
              }
            }}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : 'View Product'}
          </Button>
        </div>
        {hasDiscount && productType === 'flash' && (
          <div
            className={`absolute top-2 left-2 z-20 rounded-sm px-2 py-1 text-xs font-semibold ${
              badgeColor === 'yellow'
                ? 'bg-yellow-600 text-white'
                : badgeColor === 'blue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-red-600 text-white'
            }`}
            aria-label={`Discount ${discountPercent}%`}
            data-testid="product-card-badge"
          >
            -{discountPercent}%
          </div>
        )}
        {showType && productType && productType !== 'regular' && (
          <div
            className={`absolute top-2 right-2 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
              productType === 'flash'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
            }`}
            data-testid="product-card-type"
          >
            <Star className="h-3 w-3 fill-current" />
            {productType === 'flash' ? 'sale' : productType}
          </div>
        )}

        <div className="flex items-center justify-center">
          <div
            className="relative h-40 w-full overflow-hidden rounded-md bg-white transition-transform duration-200 group-hover:scale-105"
            data-testid="product-card-image"
          >
            <Image
              src={imageSrc}
              alt={imageAlt || title}
              fill
              className="object-cover"
              priority={priority}
              sizes="(max-width: 768px) 160px, (max-width: 1200px) 160px, 160px"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1" data-testid="product-card-details">
        <h3
          className={`line-clamp-2 truncate text-sm font-medium ${colorClasses[textColor].title}`}
          data-testid="product-card-title"
          title={title}
        >
          {title}
        </h3>
        <div
          className={`text-xs ${textColor === 'white' ? 'text-gray-200' : 'text-gray-500'}`}
          data-testid="product-card-sold-count"
        >
          Sold: {formatSoldCount(soldCount || 0)}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-base font-bold ${colorClasses[priceColor].price}`}
            data-testid="product-card-price"
          >
            {productType === 'regular'
              ? formatCurrency(Number(originalPrice || price || 0))
              : productType === 'flash'
                ? formatCurrency(
                    Number(originalPrice || price || 0) * (1 - (discountPercent || 0) / 100),
                  )
                : formatCurrency(Number(originalPrice || price || 0))}
          </span>
          {originalPrice && productType === 'flash' && (
            <span
              className={`text-sm ${colorClasses[priceColor].originalPrice} line-through`}
              data-testid="product-card-original-price"
            >
              {formatCurrency(Number(originalPrice))}
            </span>
          )}
        </div>
        {/* Rating Display */}
        <div className="flex items-center gap-1">
          {reviewsData && reviewsData.count > 0 ? (
            <>
              <StarRating rating={reviewsData.rating} size={14} />
              <span className="text-xs text-gray-500">({reviewsData.count})</span>
            </>
          ) : (
            <>
              <StarRating rating={0} size={14} />
              <span className="text-xs text-gray-500">(0)</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
