'use client';

import React from 'react';
import Image from 'next/image';
import {
  Star,
  X,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/helper/currency';
import { getOrderStatusColor, getOrderStatusText, formatDate } from '@/lib/data/profile';
import { type Order } from '@/types/profile';
import { type Product } from '@/lib/data/products';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelOrder: (orderNumber: string) => void;
  onRateReview: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onCancelOrder,
  onRateReview,
  onViewProduct,
}: OrderDetailsModalProps) {
  if (!order || !isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Order Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
              <p className="text-xs text-gray-500">{formatDate(order.orderDate)}</p>
            </div>
            <Badge className={getOrderStatusColor(order.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(order.status)}
                {getOrderStatusText(order.status)}
              </div>
            </Badge>
          </div>

          {/* Products */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Products</h4>
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
              >
                <div className="relative h-12 w-12 flex-shrink-0 cursor-pointer overflow-hidden rounded border border-gray-200 bg-gray-100">
                  <Image
                    src={item.product.imageSrc}
                    alt={item.product.imageAlt || item.product.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                    onClick={() => onViewProduct(item.product)}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {item.product.title.length > 20
                      ? `${item.product.title.substring(0, 20)}...`
                      : item.product.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRateReview(item.product)}
                    className="h-8 w-8 p-0"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Order Date</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(order.orderDate)}
              </span>
            </div>

            {order.shippedDate && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Shipped Date</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(order.shippedDate)}
                </span>
              </div>
            )}

            {order.deliveredDate && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Delivered Date</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(order.deliveredDate)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Total Amount</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>

            {order.trackingNumber && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Tracking Number</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{order.trackingNumber}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-gray-100 pt-4">
            {order.status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                className="flex h-8 items-center gap-1 border-red-200 px-3 text-xs text-red-600 hover:bg-red-50"
                onClick={() => onCancelOrder(order.orderNumber)}
              >
                <X className="h-3 w-3" />
                Cancel Order
              </Button>
            )}

            {order.status === 'delivered' && order.items.length === 1 && (
              <Button
                variant="outline"
                size="sm"
                className="flex h-8 items-center gap-1 px-3 text-xs"
                onClick={() => onRateReview(order.items[0].product)}
              >
                <Star className="h-3 w-3" />
                Rate & Review
              </Button>
            )}

            {order.status === 'delivered' && order.items.length > 1 && (
              <div className="flex gap-2">
                {order.items.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="flex h-8 items-center gap-1 px-2 text-xs"
                    onClick={() => onRateReview(item.product)}
                  >
                    <Star className="h-3 w-3" />
                    Rate {index + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
