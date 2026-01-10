import { useState } from 'react';
import { useAlert } from './useAlert';
import { useProductNavigation } from './useProductNavigation';
import { Product } from '@/lib/data/products';
import { type Order } from '@/types/profile';

interface ConfirmDialogState {
  open: boolean;
  orderNumber?: string;
}

interface ReviewModalState {
  isOpen: boolean;
  selectedProduct: Product | null;
}

export function useOrderManagement() {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ open: false });
  const [reviewModal, setReviewModal] = useState<ReviewModalState>({
    isOpen: false,
    selectedProduct: null,
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { showSuccess, showWarning } = useAlert();
  const { navigateToProduct } = useProductNavigation();

  const handleViewProduct = (product: Product) => {
    console.log('View product details:', product.title);
    navigateToProduct(product.title);
  };

  const handleCancelOrder = (orderNumber: string) => {
    setConfirmDialog({
      open: true,
      orderNumber,
    });
  };

  const handleConfirmCancel = () => {
    const orderNumber = confirmDialog.orderNumber;
    if (!orderNumber) return;

    setConfirmDialog({ open: false });

    showWarning(
      `Order ${orderNumber} cancellation requested. This action cannot be undone.`,
      'Cancel Order',
    );

    console.log('Cancel order:', orderNumber);

    setTimeout(() => {
      showSuccess(`Order ${orderNumber} has been successfully cancelled.`, 'Order Cancelled');
    }, 1000);
  };

  const handleCancelConfirm = () => {
    setConfirmDialog({ open: false });
  };

  const handleRateReview = (product: Product) => {
    setReviewModal({
      isOpen: true,
      selectedProduct: product,
    });
  };

  const handleReviewModalClose = () => {
    setReviewModal({
      isOpen: false,
      selectedProduct: null,
    });
  };

  const handleReviewSubmit = (rating: number, feedback: string) => {
    console.log('Review submitted:', {
      product: reviewModal.selectedProduct?.title,
      rating,
      feedback,
    });

    showSuccess(
      `Your review for ${reviewModal.selectedProduct?.title} has been submitted successfully!`,
      'Review Submitted',
    );
  };

  // Toggle order expansion
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Handle order row click for mobile/tablet view
  const handleOrderClick = (order: Order) => {
    // Only open modal on mobile and tablet (width < 1024px)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSelectedOrder(order);
    }
  };

  // Close order details modal
  const closeOrderModal = () => {
    setSelectedOrder(null);
  };

  return {
    // State
    confirmDialog,
    reviewModal,
    selectedStatus,
    setSelectedStatus,
    showAllOrders,
    setShowAllOrders,
    expandedOrders,
    selectedOrder,
    setSelectedOrder,

    // Product actions
    handleViewProduct,
    handleRateReview,

    // Order actions
    handleCancelOrder,
    handleConfirmCancel,
    handleCancelConfirm,
    toggleOrderExpansion,
    handleOrderClick,
    closeOrderModal,

    // Review actions
    handleReviewModalClose,
    handleReviewSubmit,
  };
}
