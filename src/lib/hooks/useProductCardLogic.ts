import { useMemo, useCallback } from 'react';
import type { CreateCartProductParams, CartProduct } from '@/lib/types/cart';

// Single comprehensive hook for all product card logic
export const useProductCardLogic = (
  discountPercent?: number,
  stock?: number,
  addToCart?: (product: CartProduct, quantity: number) => void,
  navigateToProduct?: (title: string) => void,
) => {
  // Product calculations and validations
  const hasDiscount = useMemo(
    () => typeof discountPercent === 'number' && discountPercent > 0,
    [discountPercent],
  );

  const isOutOfStock = useMemo(() => stock === 0, [stock]);

  // Format sold count function
  const formatSoldCount = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}m`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
    return String(count);
  };

  // Color classes configuration
  const colorClasses = useMemo(
    () => ({
      white: {
        title: 'text-white',
        price: 'text-white',
        originalPrice: 'text-gray-300',
        badge: 'bg-yellow-600 text-white',
        typeBadge: 'bg-white/20 text-white',
      },
      black: {
        title: 'text-gray-900',
        price: 'text-gray-900',
        originalPrice: 'text-gray-500',
        badge: 'bg-red-600 text-white',
        typeBadge: 'bg-gray-100 text-gray-700',
      },
      gray: {
        title: 'text-gray-700',
        price: 'text-gray-700',
        originalPrice: 'text-gray-400',
        badge: 'bg-red-600 text-white',
        typeBadge: 'bg-gray-100 text-gray-700',
      },
    }),
    [],
  );

  // Create product object for cart
  const createCartProduct = (params: CreateCartProductParams): CartProduct => {
    const {
      id,
      title,
      price,
      originalPrice,
      discountPercent,
      rating,
      reviewCount,
      soldCount,
      imageSrc,
      imageAlt,
      stock,
      productType,
    } = params;

    return {
      id,
      title,
      price: Number(originalPrice || price || 0),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountPercent,
      rating: rating || 0,
      reviewCount: reviewCount || 0,
      soldCount: soldCount || 0,
      imageSrc: imageSrc || '',
      imageAlt: imageAlt || '',
      stock: stock || 0,
      description: '',
      categoryId: '',
      category: '',
      type: productType || 'regular',
      images: [],
      sizes: [],
    };
  };

  // Handle add to cart functionality
  const handleAddToCart = useCallback(
    (params: CreateCartProductParams) => {
      if (!isOutOfStock && addToCart) {
        const product = createCartProduct(params);
        console.log('handleAddToCart', { product, id: params.id });
        addToCart(product, 1);
      }
    },
    [isOutOfStock, addToCart],
  );

  // Handle product click functionality
  const handleProductClick = useCallback(
    (title: string) => {
      if (navigateToProduct) {
        navigateToProduct(title);
      }
    },
    [navigateToProduct],
  );

  // Return all functionalities
  return {
    hasDiscount,
    isOutOfStock,
    formatSoldCount,
    colorClasses,
    createCartProduct,
    handleAddToCart,
    handleProductClick,
  };
};
