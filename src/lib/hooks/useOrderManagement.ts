import { useState } from 'react';
import { useAlert } from './useAlert';
import { useProductNavigation } from './useProductNavigation';
import { Product } from '@/lib/data/products';

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

  return {
    // State
    confirmDialog,
    reviewModal,

    // Product actions
    handleViewProduct,
    handleRateReview,

    // Order actions
    handleCancelOrder,
    handleConfirmCancel,
    handleCancelConfirm,

    // Review actions
    handleReviewModalClose,
    handleReviewSubmit,
  };
}
