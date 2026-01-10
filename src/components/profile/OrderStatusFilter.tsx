'use client';

import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface OrderStatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export default function OrderStatusFilter({
  selectedStatus,
  onStatusChange,
}: OrderStatusFilterProps) {
  return (
    <div
      className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
      data-testid="order-status-filter"
    >
      <span className="text-sm font-medium text-gray-700">Filter by status:</span>
      <RadioGroup
        value={selectedStatus}
        onValueChange={onStatusChange}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" data-testid="status-filter-all" />
          <Label htmlFor="all" className="cursor-pointer text-sm text-gray-600">
            All
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pending" id="pending" data-testid="status-filter-pending" />
          <Label htmlFor="pending" className="cursor-pointer text-sm text-gray-600">
            Pending
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="processing"
            id="processing"
            data-testid="status-filter-processing"
          />
          <Label htmlFor="processing" className="cursor-pointer text-sm text-gray-600">
            Processing
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="shipped" id="shipped" data-testid="status-filter-shipped" />
          <Label htmlFor="shipped" className="cursor-pointer text-sm text-gray-600">
            Shipped
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="delivered" id="delivered" data-testid="status-filter-delivered" />
          <Label htmlFor="delivered" className="cursor-pointer text-sm text-gray-600">
            Delivered
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cancelled" id="cancelled" data-testid="status-filter-cancelled" />
          <Label htmlFor="cancelled" className="cursor-pointer text-sm text-gray-600">
            Cancelled
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
