import React from 'react';

import { cn } from '@/lib/utils';
import { useFlashSalesHooks } from '@/lib/hooks/useFlashSalesHooks';
import { flashSaleProducts } from '@/lib/data/products';
import ProductCard from '../shared/ProductCard';

type FlashSaleProps = {
  title?: string;
  className?: string;
};

export default function FlashSale({ title = "Today's", className }: FlashSaleProps) {
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
  } = useFlashSalesHooks(flashSaleProducts.length);

  const total = flashSaleProducts.length;

  // Compute visible slice without wrap-around
  const visibleProducts = flashSaleProducts.slice(
    startIndex,
    Math.min(total, startIndex + itemsPerView),
  );

  return (
    <section
      className={cn(
        'bg-white p-0 md:mt-0 md:px-4 md:py-3',
        // 'pt-[calc(50px+env(safe-area-inset-top,0px))]',
        'md:pt-3',
        className,
      )}
      aria-label={`Flash sale products count ${flashSaleProducts.length}`}
      data-testid="flashsale-section"
    >
      <h2
        className="border-primary text-primary mb-3 border-l-[10px] pl-3 text-lg font-semibold"
        data-testid="flashsale-title"
      >
        {title}
      </h2>
      <div className="flex items-center justify-between" data-testid="flashsale-header-wrapper">
        <div className="mr-5 flex items-center gap-4" data-testid="flashsale-left-section">
          <h1
            className="mr-4 mb-2 text-2xl font-bold tracking-wider text-gray-900 md:mr-10 md:text-3xl"
            data-testid="flashsale-main-title"
          >
            Flash Sale
          </h1>
          <div
            className="flex items-center font-mono text-sm font-bold text-gray-800 md:text-base"
            data-testid="flashsale-countdown"
          >
            <div className="flex flex-col items-center" data-testid="flashsale-days">
              <span className="mb-0.5 text-[10px] text-gray-500 md:text-xs">Days</span>
              <span className="text-sm md:text-base">{String(days).padStart(2, '0')}</span>
            </div>
            <span className="mx-0.5 md:mx-1">:</span>
            <div className="flex flex-col items-center" data-testid="flashsale-hours">
              <span className="mb-1 text-xs text-gray-500">Hours</span>
              <span>{String(hours).padStart(2, '0')}</span>
            </div>
            <span className="mx-0.5 md:mx-1">:</span>
            <div className="flex flex-col items-center" data-testid="flashsale-minutes">
              <span className="mb-1 text-xs text-gray-500">Minutes</span>
              <span>{String(minutes).padStart(2, '0')}</span>
            </div>
            <span className="mx-0.5 md:mx-1">:</span>
            <div className="flex flex-col items-center" data-testid="flashsale-seconds">
              <span className="mb-1 text-xs text-gray-500">Seconds</span>
              <span>{String(seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {visibleProducts.map((p, idx) => (
          <ProductCard
            key={p.id}
            imageSrc={p.imageSrc}
            imageAlt={p.imageAlt || p.title}
            title={p.title}
            price={p.price}
            originalPrice={p.originalPrice}
            discountPercent={p.discountPercent}
            rating={p.rating}
            reviewCount={p.reviewCount}
            priority={idx < itemsPerView}
          />
        ))}
      </div>
    </section>
  );
}
