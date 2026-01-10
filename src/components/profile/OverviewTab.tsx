'use client';

import React from 'react';
import Image from 'next/image';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/helper/currency';
import { getOrderStatusColor, getOrderStatusText, formatDate } from '@/lib/data/profile';
import { type Order, type UserProfile } from '@/types/profile';
import { useOrderManagement } from '@/lib/hooks/useOrderManagement';
import RateReviewModal from './RateReviewModal';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

interface OverviewTabProps {
  profile: UserProfile;
}

export default function OverviewTab({ profile }: OverviewTabProps) {
  const {
    confirmDialog,
    reviewModal,
    handleViewProduct,
    handleRateReview,
    handleCancelOrder,
    handleConfirmCancel,
    handleCancelConfirm,
    handleReviewModalClose,
    handleReviewSubmit,
  } = useOrderManagement();

  return (
    <div className="space-y-6">
      {/* Recent Orders */}
      <div data-testid="recent-orders-card" className="bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Star className="h-5 w-5" />
              Recent Orders
            </h2>
            <p className="text-sm text-gray-600">Your latest order activity</p>
          </div>
          <Button variant="outline" size="sm">
            View All Orders
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" data-testid="orders-table">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left font-semibold text-gray-900">Order</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-900">Date</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-900">Status</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-900">Total</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profile.orders.slice(0, 3).flatMap((order: Order, orderIndex: number) =>
                order.items.map((item, itemIndex: number) => (
                  <tr
                    key={`${order.id}-${itemIndex}`}
                    className={`cursor-pointer border-b transition-colors hover:bg-gray-50 ${orderIndex === 0 && itemIndex === 0 ? '' : ''}`}
                    data-testid={`order-row-${order.id}-${itemIndex}`}
                    onClick={() => handleViewProduct(item.product)}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-start gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100">
                          <Image
                            src={item.product.imageSrc}
                            alt={item.product.imageAlt || item.product.title}
                            fill
                            className="object-cover"
                            onError={e => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNDIxNmwxNC41ODYtNC41ODZhMiAyIDAgMDEyLjgyOCAwTDE2IDE2bS0yLTJ6TTE2IDE0bTEuNTg2LTEuNTg2YTIgMiAyIDAgMDEyLjgyOCAwLDIwIDE0bS02LTZoLjAxTTYgMjBoMTJhMiAyIDAgMDAyLTJWNmEyIDIgMCAwMC0yLTJINmEyIDIgMCAwMC0yIDJ2MTJhMiAyIDAgMDAyIDJ6IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
                            }}
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="truncate text-xs font-medium text-gray-900">
                            {item.product.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                          <p className="text-xs text-gray-400">{order.orderNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-sm text-gray-900">{formatDate(order.orderDate)}</p>
                    </td>
                    <td className="px-3 py-2">
                      <Badge className={getOrderStatusColor(order.status)}>
                        {getOrderStatusText(order.status)}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'ordered' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex h-7 items-center gap-1 border-red-200 px-2 text-xs text-red-600 hover:bg-red-50"
                            onClick={e => {
                              e.stopPropagation();
                              handleCancelOrder(order.orderNumber);
                            }}
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
                            onClick={e => {
                              e.stopPropagation();
                              handleRateReview(item.product);
                            }}
                          >
                            <Star className="h-3 w-3" />
                            Rate & Review
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="mt-4 border-t pt-4">
          <Button variant="link" className="w-full">
            View All Orders
          </Button>
        </div>
      </div>

      {/* Rate & Review Modal */}
      <RateReviewModal
        isOpen={reviewModal.isOpen}
        onClose={handleReviewModalClose}
        product={reviewModal.selectedProduct}
        onSubmit={handleReviewSubmit}
      />

      {/* Cancel Order Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Cancel Order"
        message={`Are you sure you want to cancel order ${confirmDialog.orderNumber}? This action cannot be undone.`}
        confirmText="Cancel Order"
        cancelText="Keep Order"
        destructive={true}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelConfirm}
      />
    </div>
  );
}
