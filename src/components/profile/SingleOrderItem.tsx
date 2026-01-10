'use client';

import React from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/helper/currency';
import { type Product } from '@/lib/data/products';

interface SingleOrderItemProps {
  product: Product;
  quantity: number;
  price: number;
  onViewProduct: (product: Product) => void;
}

export default function SingleOrderItem({
  product,
  quantity,
  price,
  onViewProduct,
}: SingleOrderItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (window.innerWidth >= 640) {
      e.stopPropagation();
      onViewProduct(product);
    }
  };

  return (
    <div
      className="flex items-start gap-2 rounded p-1"
      onClick={handleClick}
      data-testid={`product-${product.id}`}
    >
      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt || product.title}
          fill
          className="object-cover"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNDIxNmwxNC41ODYtNC41ODZhMiAyIDAgMDEyLjgyOCAwTDE2IDE2bS0yLTJ6TTE2IDE0bTEuNTg2LTEuNTg2YTIgMiAyIDAgMDEyLjgyOCAwLDIwIDE0bS02LTZoLjAxTTYgMjBoMTJhMiAyIDAwMDAyLTJWNmEyIDIgMCAwMC0yLTJINmEyIDIgMCAwMC0yIDJ2MTJhMiAyIDAwMDAyIDJ6IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
          }}
          sizes="40px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-900">
          {product.title.length > 20 ? `${product.title.substring(0, 20)}...` : product.title}
        </p>
        <p className="text-xs text-gray-500">
          Qty: {quantity} × {formatCurrency(price)}
        </p>
      </div>
    </div>
  );
}
