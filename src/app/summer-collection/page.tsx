'use client';

import React, { useState, useMemo } from 'react';
import FlashSale from '@/components/home/FlashSale';
import { flashSaleProducts, Product } from '@/lib/data/products';

import SummerCategorySidebar from '@/components/home/SummerCategorySidebar';

// Filter products for summer collection
const summerCollectionProducts = flashSaleProducts.filter(
  (product: Product) => product.isSummerCollection,
);

export default function SummerCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter summer products based on selected category
  const filteredSummerProducts = useMemo(() => {
    if (!selectedCategory) {
      return summerCollectionProducts;
    }
    return summerCollectionProducts.filter(product => product.categoryId === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };
  return (
    <div className="min-h-screen bg-gray-50" data-testid="summer-collection-page">
      {/* Main Content */}
      <div
        className="mx-auto max-w-7xl px-4 py-0 sm:px-6 lg:px-8"
        data-testid="summer-main-content"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8" data-testid="summer-grid">
          {/* Category Sidebar */}
          <div className="lg:col-span-1" data-testid="section-category-sidebar">
            <SummerCategorySidebar
              summerProducts={summerCollectionProducts}
              onCategoryFilter={handleCategoryFilter}
              selectedCategory={selectedCategory}
              data-testid="summer-category-sidebar"
            />
          </div>

          {/* Products Section */}
          <div className="-mt-4 lg:col-span-3" data-testid="section-products">
            <FlashSale
              title=" Summer Essentials"
              showCountdown={false}
              showArrows={false}
              showType={true}
              productsData={filteredSummerProducts}
              limit={false}
              data-testid="summer-flash-sale"
            />

            {filteredSummerProducts.length === 0 && (
              <div className="py-12 text-center" data-testid="no-summer-products">
                <div className="mb-4 text-gray-400" data-testid="no-products-icon">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3
                  className="mb-2 text-lg font-medium text-gray-900"
                  data-testid="no-products-title"
                >
                  No summer products yet
                </h3>
                <p className="text-gray-500" data-testid="no-products-message">
                  Check back soon for our summer collection!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
