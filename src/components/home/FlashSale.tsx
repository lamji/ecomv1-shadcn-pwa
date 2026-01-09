import React, { useState } from 'react';

import { cn } from '@/lib/utils';
import { useFlashSalesHooks } from '@/lib/hooks/useFlashSalesHooks';
import { flashSaleProducts, Product } from '@/lib/data/products';
import ProductCard from '../shared/ProductCard';
import { Button } from '../ui/button';
import { ArrowRight, Filter, X } from 'lucide-react';
import FilterModal, { FilterOptions } from './FilterModal';

// Routes that should display grid view instead of swipeable on mobile/tablet
const GRID_VIEW_ROUTES = ['/new-arrivals', '/view-all', '/category/'];

type FlashSaleProps = {
  title?: string;
  className?: string;
  showCountdown?: boolean;
  showArrows?: boolean;
  showType?: boolean;
  productsData?: Product[];
  limit?: boolean;
  showFilter?: boolean;
  defaultFilter?: Partial<FilterOptions>;
  hideCategories?: boolean;
};

export default function Products({
  title = 'FLASH SALE',
  className,
  showCountdown = true,
  showArrows = true,
  productsData,
  showType = false,
  limit = false,
  showFilter = false,
  defaultFilter,
  hideCategories = false,
}: FlashSaleProps) {
  // Check if current route should display grid view instead of swipeable
  const shouldShowGrid =
    typeof window !== 'undefined' &&
    GRID_VIEW_ROUTES.some(route => window.location.pathname.includes(route));

  // Helper function to get default filter options
  const getDefaultFilterOptions = (): FilterOptions => ({
    priceRange: { min: 0, max: 1000 },
    inStockOnly: false,
    sortBy: 'price-low',
    categories: [],
    types: [],
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions | null>(
    defaultFilter ? { ...getDefaultFilterOptions(), ...defaultFilter } : null,
  );

  // Use custom productsData if provided, otherwise use default flashSaleProducts
  const products = productsData || flashSaleProducts;

  const {
    days,
    hours,
    minutes,
    seconds,
    itemsPerView,
    startIndex,
    canPrev,
    canNext,
    handlePrev,
    handleNext,
    filteredProducts,
  } = useFlashSalesHooks(products.length, products, appliedFilters);

  // Apply limit if enabled
  const displayProducts = limit ? filteredProducts.slice(0, 8) : filteredProducts;

  const handleApplyFilters = (filters: FilterOptions) => {
    setAppliedFilters(filters);
  };

  const total = displayProducts.length;

  // Compute visible slice without wrap-around
  const visibleProducts =
    showArrows && !limit
      ? displayProducts.slice(startIndex, Math.min(total, startIndex + itemsPerView))
      : displayProducts;

  return (
    <section
      className={cn(
        'bg-white p-0 md:mt-0 md:px-4 md:py-3',
        // 'pt-[calc(50px+env(safe-area-inset-top,0px))]',
        'md:pt-3',
        className,
      )}
      aria-label={`Flash sale products count ${products.length}`}
      data-testid="flashsale-section"
    >
      {/* <h2
        className="border-primary text-primary mb-3 border-l-[10px] pl-3 text-lg font-semibold"
        data-testid="flashsale-title"
      >
        {title}
      </h2> */}
      <div
        className="border-l-primary mt-5 flex items-center justify-between border-l-[10px] p-2"
        data-testid="flashsale-header-wrapper"
      >
        <div className="mr-5 flex items-center gap-4" data-testid="flashsale-left-section">
          <h1
            className="mb-3 pl-3 text-lg font-bold font-semibold text-gray-900 md:mr-10 md:text-xl"
            data-testid="flashsale-main-title"
          >
            {title}
          </h1>
          {showCountdown && (
            <div
              className="flex items-center font-mono text-sm font-bold text-gray-800 md:text-base"
              data-testid="flashsale-countdown"
            >
              <div className="flex flex-col items-center" data-testid="flashsale-days">
                <span className="mb-1 text-xs text-gray-500">Days</span>
                <span className="text-sm md:text-base">{String(days).padStart(2, '0')}</span>
              </div>
              <span className="mx-0.5 md:mx-1">:</span>
              <div className="flex flex-col items-center" data-testid="flashsale-hours">
                <span className="mb-1 text-xs text-gray-500">Hours</span>
                <span className="text-sm md:text-base">{String(hours).padStart(2, '0')}</span>
              </div>
              <span className="mx-0.5 md:mx-1">:</span>
              <div className="flex flex-col items-center" data-testid="flashsale-minutes">
                <span className="mb-1 text-xs text-gray-500">Minutes</span>
                <span className="text-sm md:text-base">{String(minutes).padStart(2, '0')}</span>
              </div>
              <span className="mx-0.5 md:mx-1">:</span>
              <div className="flex flex-col items-center" data-testid="flashsale-seconds">
                <span className="mb-1 text-xs text-gray-500">Seconds</span>
                <span className="text-sm md:text-base">{String(seconds).padStart(2, '0')}</span>
              </div>
            </div>
          )}
        </div>

        {showArrows && !limit && (
          <div className="hidden gap-2 md:flex" data-testid="flashsale-arrows">
            <button
              className={`rounded-full p-2 transition-colors ${canPrev ? 'bg-gray-200 hover:bg-gray-300' : 'cursor-not-allowed bg-gray-100 text-gray-400'}`}
              data-testid="flashsale-prev-btn"
              onClick={handlePrev}
              aria-label="Previous products"
              disabled={!canPrev}
              aria-disabled={!canPrev}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className={`rounded-full p-2 transition-colors ${canNext ? 'bg-gray-200 hover:bg-gray-300' : 'cursor-not-allowed bg-gray-100 text-gray-400'}`}
              data-testid="flashsale-next-btn"
              onClick={handleNext}
              aria-label="Next products"
              disabled={!canNext}
              aria-disabled={!canNext}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        {showFilter && (
          <div className="flex items-center gap-2">
            {appliedFilters && (
              <Button
                variant="outline"
                onClick={() => setAppliedFilters(null)}
                data-testid="clear-filters-button"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setIsFilterModalOpen(true)}
              data-testid="filter-button"
              className="text-primary hover:text-primary/90 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        )}

        {limit && products.length > 8 && (
          <Button
            variant="ghost"
            onClick={() => {
              window.location.href = '/view-all';
            }}
            data-testid="view-all-button"
            className="text-primary hover:text-primary/90 flex items-center gap-2"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="relative mt-4">
        {/* Mobile/Tablet Container - Grid View */}
        {shouldShowGrid ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {displayProducts.map((p, idx) => (
              <ProductCard
                key={p.id}
                imageSrc={p.imageSrc}
                imageAlt={p.imageAlt || p.title}
                images={p.images}
                description={p.description}
                sizes={p.sizes}
                title={p.title}
                price={p?.price}
                originalPrice={p.originalPrice}
                discountPercent={p.discountPercent}
                rating={p.rating}
                reviewCount={p.reviewCount}
                soldCount={p.soldCount}
                showType={showType}
                productType={p.type}
                priority={idx < 4}
                stock={p.stock}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Mobile Swipeable Container */}
            <div className="md:hidden">
              <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
                {displayProducts.map((p, idx) => (
                  <div key={p.id} className="w-[45%] flex-shrink-0 snap-center">
                    <ProductCard
                      imageSrc={p.imageSrc}
                      imageAlt={p.imageAlt || p.title}
                      images={p.images}
                      description={p.description}
                      sizes={p.sizes}
                      title={p.title}
                      price={p?.price}
                      originalPrice={p.originalPrice}
                      discountPercent={p.discountPercent}
                      rating={p.rating}
                      reviewCount={p.reviewCount}
                      soldCount={p.soldCount}
                      showType={showType}
                      productType={p.type}
                      priority={idx < 4}
                      stock={p.stock}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-4 md:gap-3">
              {visibleProducts.map((p, idx) => (
                <ProductCard
                  key={p.id}
                  imageSrc={p.imageSrc}
                  imageAlt={p.imageAlt || p.title}
                  images={p.images}
                  description={p.description}
                  sizes={p.sizes}
                  title={p.title}
                  price={p?.price}
                  originalPrice={p.originalPrice}
                  discountPercent={p.discountPercent}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  soldCount={p.soldCount}
                  showType={showType}
                  productType={p.type}
                  priority={idx < itemsPerView}
                  stock={p.stock}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        hideCategories={hideCategories}
      />
    </section>
  );
}
