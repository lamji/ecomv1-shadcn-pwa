'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/helper/currency';
import { getOrderStatusColor, getOrderStatusText, formatDate } from '@/lib/data/profile';
import { type Order, type UserProfile } from '@/types/profile';
import OrderDetailsModal from './OrderDetailsModal';
import OrderStatusFilter from './OrderStatusFilter';
import NoOrdersFound from './NoOrdersFound';
import SingleOrderItem from './SingleOrderItem';
import OrderActions from './OrderActions';
import AccordionOrderItem from './AccordionOrderItem';
import OrderBundle from './OrderBundle';
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
    selectedStatus,
    setSelectedStatus,
    showAllOrders,
    setShowAllOrders,
    expandedOrders,
    selectedOrder,
    handleViewProduct,
    handleRateReview,
    handleCancelOrder,
    handleConfirmCancel,
    handleCancelConfirm,
    toggleOrderExpansion,
    handleOrderClick,
    closeOrderModal,
    handleReviewModalClose,
    handleReviewSubmit,
  } = useOrderManagement();

  // Filter orders based on selected status and sort by date (latest first)
  const filteredOrders = profile.orders
    .filter((order: Order) => {
      const matches = selectedStatus === 'all' ? true : order.status === selectedStatus;
      return matches;
    })
    .sort((a: Order, b: Order) => {
      // Sort by date descending (latest first)
      return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Recent Orders */}
      <div data-testid="recent-orders-card" className="bg-white py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Star className="h-5 w-5" />
              Recent Orders
            </h2>
            <p className="text-sm text-gray-600">Your latest order activity</p>
          </div>
        </div>

        {/* Order Status Filter */}
        <OrderStatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />

        <div className="overflow-x-auto">
          <table
            className={`${filteredOrders.length > 0 ? '' : 'h-[80vh]'} w-full`}
            data-testid="orders-table"
          >
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left font-semibold text-gray-900">Order</th>
                <th className="hidden px-3 py-2 text-left font-semibold text-gray-900 sm:table-cell">
                  Date
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-900">Status</th>
                <th className="hidden px-3 py-2 text-left font-semibold text-gray-900 sm:table-cell">
                  Total
                </th>
                <th className="hidden px-3 py-2 text-right font-semibold text-gray-900 sm:table-cell">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                (showAllOrders ? filteredOrders : filteredOrders.slice(0, 3)).map(
                  (order: Order, orderIndex: number) => (
                    <React.Fragment key={order.id}>
                      <tr
                        className={`border-b transition-colors hover:bg-gray-50 ${orderIndex === 0 ? '' : ''} cursor-pointer sm:cursor-default lg:cursor-default lg:hover:bg-transparent`}
                        data-testid={`order-row-${order.id}`}
                        onClick={() => {
                          handleOrderClick(order);
                        }}
                      >
                        <td className="px-3 py-3 align-top sm:cursor-default">
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-400">{order.orderNumber}</p>
                            <div className="space-y-2">
                              {/* Conditional Rendering: Bundle icon for multi-item, product image for single-item */}
                              {order.items.length > 1 ? (
                                <OrderBundle
                                  order={order}
                                  isExpanded={expandedOrders.has(order.id)}
                                  onToggleExpansion={toggleOrderExpansion}
                                />
                              ) : (
                                <SingleOrderItem
                                  product={order.items[0].product}
                                  quantity={order.items[0].quantity}
                                  price={order.items[0].price}
                                  onViewProduct={handleViewProduct}
                                />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-3 py-3 align-top sm:table-cell">
                          <p className="text-sm text-gray-900">{formatDate(order.orderDate)}</p>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <Badge className={getOrderStatusColor(order.status)}>
                            {getOrderStatusText(order.status)}
                          </Badge>
                        </td>
                        <td className="hidden px-3 py-3 align-top sm:table-cell">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </td>
                        <td className="hidden px-3 py-3 align-top sm:table-cell">
                          <OrderActions
                            order={order}
                            onCancelOrder={handleCancelOrder}
                            onRateReview={handleRateReview}
                          />
                        </td>
                      </tr>

                      {/* Accordion Row - Spans all columns */}
                      {order.items.length > 1 && expandedOrders.has(order.id) && (
                        <tr className="bg-gray-50/50">
                          <td colSpan={3} className="px-3 py-4 sm:col-span-5">
                            <div className="space-y-4 pl-12">
                              {order.items.map((item, itemIndex) => (
                                <AccordionOrderItem
                                  key={itemIndex}
                                  item={item}
                                  onViewProduct={handleViewProduct}
                                  onRateReview={handleRateReview}
                                />
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ),
                )
              ) : (
                <NoOrdersFound selectedStatus={selectedStatus} />
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredOrders.length > 3 && (
          <div className="mt-4 border-t pt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllOrders(!showAllOrders)}
              data-testid="view-all-orders-link"
            >
              {showAllOrders
                ? 'Show less orders'
                : `View more orders (+${filteredOrders.length - 3} more)`}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={closeOrderModal}
        onCancelOrder={handleCancelOrder}
        onRateReview={handleRateReview}
        onViewProduct={handleViewProduct}
      />

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
