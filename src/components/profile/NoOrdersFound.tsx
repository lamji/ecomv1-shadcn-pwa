'use client';

import React from 'react';

interface NoOrdersFoundProps {
  selectedStatus: string;
}

export default function NoOrdersFound({ selectedStatus }: NoOrdersFoundProps) {
  return (
    <tr>
      <td colSpan={3} className="h-[100px] px-3 py-8 text-center align-middle sm:col-span-5">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-sm font-medium text-gray-900">
            {selectedStatus === 'all'
              ? 'No orders found'
              : `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} status not found`}
          </p>
          <p className="text-xs text-gray-500">
            {selectedStatus === 'all'
              ? "You haven't placed any orders yet"
              : `No orders with ${selectedStatus} status found`}
          </p>
        </div>
      </td>
    </tr>
  );
}
