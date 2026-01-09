'use client';

import { Product } from '@/lib/data/products';

export const useAddToCart = () => {
  const addToCart = (product: Product, quantity: number = 1) => {
    console.log('Product added to cart:', {
      product,
      quantity,
      timestamp: new Date(),
    });
  };

  return {
    addToCart,
  };
};
