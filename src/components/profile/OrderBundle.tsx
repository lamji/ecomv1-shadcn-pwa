'use client';

import React from 'react';
import { Package } from 'lucide-react';
import { type Order } from '@/types/profile';

interface OrderBundleProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpansion: (orderId: string) => void;
}

export default function OrderBundle({ order, isExpanded, onToggleExpansion }: OrderBundleProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (window.innerWidth >= 640) {
      e.stopPropagation();
      onToggleExpansion(order.id);
    }
  };

  return (
    <div
      className="flex items-start gap-2 rounded p-1 transition-colors sm:cursor-pointer"
      onClick={handleClick}
      data-testid={`order-bundle-${order.id}`}
    >
      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded border border-gray-200 bg-blue-50">
        <Package className="h-6 w-6 text-blue-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-gray-900">
          Order Bundle ({order.items.length} items)
        </p>
        <p className="text-xs text-gray-500">
          {isExpanded ? 'Click to hide products' : 'Click to view products'}
        </p>
      </div>
    </div>
  );
}
