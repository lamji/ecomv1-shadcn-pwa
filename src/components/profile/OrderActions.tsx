'use client';

import React from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Order } from '@/types/profile';
import { type Product } from '@/lib/data/products';

interface OrderActionsProps {
  order: Order;
  onCancelOrder: (orderNumber: string) => void;
  onRateReview: (product: Product) => void;
}

export default function OrderActions({ order, onCancelOrder, onRateReview }: OrderActionsProps) {
  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancelOrder(order.orderNumber);
  };

  const handleRateReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRateReview(order.items[0].product);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Conditional Action: Cancel button for pending multi-item orders, no action for other statuses */}
      {order.items.length > 1 && order.status === 'pending' && (
        <Button
          variant="outline"
          size="sm"
          className="flex h-7 items-center gap-1 border-red-200 px-2 text-xs text-red-600 hover:bg-red-50"
          onClick={handleCancelClick}
        >
          <X className="h-3 w-3" />
          Cancel
        </Button>
      )}
      {order.items.length === 1 && order.status === 'pending' && (
        <Button
          variant="outline"
          size="sm"
          className="flex h-7 items-center gap-1 border-red-200 px-2 text-xs text-red-600 hover:bg-red-50"
          onClick={handleCancelClick}
        >
          <X className="h-3 w-3" />
          Cancel
        </Button>
      )}
      {order.status === 'delivered' && (
        <Button
          variant="outline"
          size="sm"
          className="flex h-7 items-center gap-1 px-2 text-xs"
          onClick={handleRateReviewClick}
        >
          <Star className="h-3 w-3" />
          Rate & Review
        </Button>
      )}
    </div>
  );
}
