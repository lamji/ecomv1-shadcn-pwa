import { useMemo } from 'react';
import { Product } from '@/lib/data/products';

export interface SimilarProductsOptions {
  maxProducts?: number;
  sameCategory?: boolean;
  priceRange?: number; // Percentage variance allowed
  excludeCurrent?: boolean;
}

export const useSimilarProducts = (
  currentProduct: Product | null,
  allProducts: Product[],
  options: SimilarProductsOptions = {},
) => {
  const {
    maxProducts = 6,
    sameCategory = true,
    priceRange = 30, // 30% price variance
    excludeCurrent = true,
  } = options;

  const similarProducts = useMemo(() => {
    if (!currentProduct) return [];

    let filtered = allProducts.filter(product => {
      // Exclude current product
      if (excludeCurrent && product.id === currentProduct.id) return false;

      // Filter by same category if enabled
      if (sameCategory && product.categoryId !== currentProduct.categoryId) return false;

      // Filter by price range (within specified percentage)
      const priceVariance = (product.price - currentProduct.price) / currentProduct.price;
      if (Math.abs(priceVariance * 100) > priceRange) return false;

      // Ensure product has stock
      if (product.stock <= 0) return false;

      return true;
    });

    // Sort by similarity score
    filtered = filtered.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Same category bonus
      if (a.categoryId === currentProduct.categoryId) scoreA += 2;
      if (b.categoryId === currentProduct.categoryId) scoreB += 2;

      // Same type bonus
      if (a.type === currentProduct.type) scoreA += 1;
      if (b.type === currentProduct.type) scoreB += 1;

      // Price similarity bonus (closer price = higher score)
      const priceDiffA = Math.abs(a.price - currentProduct.price);
      const priceDiffB = Math.abs(b.price - currentProduct.price);
      scoreA += Math.max(0, 100 - priceDiffA) / 50;
      scoreB += Math.max(0, 100 - priceDiffB) / 50;

      // Rating bonus
      scoreA += a.rating * 0.1;
      scoreB += b.rating * 0.1;

      return scoreB - scoreA;
    });

    // Return limited number of products
    return filtered.slice(0, maxProducts);
  }, [currentProduct, allProducts, maxProducts, sameCategory, priceRange, excludeCurrent]);

  return {
    similarProducts,
    hasSimilarProducts: similarProducts.length > 0,
  };
};
