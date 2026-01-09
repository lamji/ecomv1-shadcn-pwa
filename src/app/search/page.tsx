'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import FlashSale from '@/components/home/FlashSale';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { searchProductsAsync } from '@/lib/features/searchSlice';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const searchState = useAppSelector(state => state.search);
  const dispatch = useAppDispatch();

  // Trigger search when component mounts or query changes
  useEffect(() => {
    if (searchQuery && searchQuery !== searchState.lastSearchQuery) {
      dispatch(searchProductsAsync(searchQuery));
    }
  }, [searchQuery, searchState.lastSearchQuery, dispatch]);

  const handleBack = () => {
    router.back();
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-none">
        <div className="mx-auto max-w-7xl py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Search Results
            </Button>

            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div
        className="mx-auto max-w-7xl px-0 py-8 sm:px-6 lg:px-8"
        data-testid="search-results-section"
      >
        {searchState.isLoading ? (
          <div className="py-16 text-center" data-testid="search-loading">
            <div className="mb-4">
              <div
                className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
                data-testid="search-spinner"
              ></div>
            </div>
            <p className="text-gray-600" data-testid="search-loading-text">
              Searching...
            </p>
          </div>
        ) : searchState.results.length > 0 ? (
          <div data-testid="search-results-container">
            {/* Product Grid */}
            <FlashSale
              title={`Found ${searchState.results.length} products`}
              showCountdown={false}
              showArrows={true}
              showType={true}
              productsData={searchState.results}
              limit={false}
              hideCategories={true}
              initialLimit={6}
            />
          </div>
        ) : (
          <div className="py-16 text-center" data-testid="search-no-results">
            <div className="mb-4">
              <div
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-200"
                data-testid="search-no-results-icon"
              >
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <h3
              className="mb-2 text-lg font-medium text-gray-900"
              data-testid="search-no-results-title"
            >
              No products found
            </h3>
            <p className="mb-6 text-gray-600" data-testid="search-no-results-message">
              {searchQuery
                ? `No products found matching &quot;${searchQuery}&quot;`
                : 'Try searching for products'}
            </p>
            <Button onClick={() => router.push('/')} data-testid="search-continue-shopping">
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
