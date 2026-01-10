'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/helper/currency';
import { type Product } from '@/lib/data/products';

interface AccordionOrderItemProps {
  item: {
    product: Product;
    quantity: number;
    price: number;
  };
  onViewProduct: (product: Product) => void;
  onRateReview: (product: Product) => void;
}

export default function AccordionOrderItem({
  item,
  onViewProduct,
  onRateReview,
}: AccordionOrderItemProps) {
  const handleProductClick = () => {
    onViewProduct(item.product);
  };

  const handleRateReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRateReview(item.product);
  };

  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div
        className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 transition-colors hover:opacity-80"
        onClick={handleProductClick}
      >
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-white">
          <Image
            src={item.product.imageSrc}
            alt={item.product.imageAlt || item.product.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {item.product.title.length > 20
              ? `${item.product.title.substring(0, 20)}...`
              : item.product.title}
          </p>
          <p className="text-xs text-gray-500">
            Qty: {item.quantity} × {formatCurrency(item.price)}
          </p>
        </div>
      </div>
      <div className="hidden flex-shrink-0 sm:block">
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 items-center gap-1.5 px-3 text-xs"
          onClick={handleRateReviewClick}
        >
          <Star className="h-3.5 w-3.5" />
          Rate & Review
        </Button>
      </div>
    </div>
  );
}
