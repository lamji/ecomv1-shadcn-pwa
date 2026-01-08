import React from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/helper/currency';
import { StarRating } from './StarRating';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';

type ProductCardProps = {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  price: number | string;
  originalPrice?: number | string;
  discountPercent?: number; // e.g., 50 for -50%
  rating?: number; // e.g., 4.5
  reviewCount?: number; // e.g., 24
  className?: string;
  // If true, load image eagerly with high fetch priority (use for above-the-fold items)
  priority?: boolean;
  onClick?: () => void;
};

export default function ProductCard({
  imageSrc,
  imageAlt = '',
  title,
  price,
  originalPrice,
  discountPercent,
  rating,
  reviewCount,
  priority = false,
  onClick,
}: ProductCardProps) {
  const hasDiscount = typeof discountPercent === 'number' && discountPercent > 0;

  return (
    <div
      className={`group relative rounded-lg shadow-none transition`}
      role={onClick ? 'button' : undefined}
      onClick={onClick}
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
            onClick={e => {
              e.stopPropagation();
              // TODO: Add to cart functionality
              console.log('Added to cart:', title);
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="w-full max-w-[180px] border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={e => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
          >
            View Product
          </Button>
        </div>
        {hasDiscount && (
          <div
            className="absolute top-2 left-2 rounded-sm bg-red-600 px-2 py-1 text-xs font-semibold text-white"
            aria-label={`Discount ${discountPercent}%`}
            data-testid="product-card-badge"
          >
            -{discountPercent}%
          </div>
        )}

        <div className="flex items-center justify-center">
          <div
            className="flex h-40 w-full items-center justify-center overflow-hidden rounded-md bg-white transition-transform duration-200 group-hover:scale-105"
            data-testid="product-card-image"
          >
            <Image
              src={imageSrc}
              alt={imageAlt || title}
              width={160}
              height={160}
              className="object-contain"
              priority={priority}
              sizes="(max-width: 768px) 160px, (max-width: 1200px) 160px, 160px"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1" data-testid="product-card-details">
        <h3
          className="line-clamp-2 text-sm font-medium text-gray-900"
          data-testid="product-card-title"
        >
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900" data-testid="product-card-price">
            {formatCurrency(Number(price))}
          </span>
          {originalPrice && (
            <span
              className="text-sm text-gray-500 line-through"
              data-testid="product-card-original-price"
            >
              {formatCurrency(Number(originalPrice))}
            </span>
          )}
        </div>
        {rating !== undefined && (
          <div className="flex items-center gap-1">
            <StarRating rating={rating} size={14} />
            {reviewCount !== undefined && (
              <span className="text-xs text-gray-500">({reviewCount})</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
