'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { useFlashSalesHooks } from '@/lib/hooks/useFlashSalesHooks';
import { flashSaleProducts, Product } from '@/lib/data/products';
import ProductCard from '../shared/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

type NewArrivalsProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  showArrows?: boolean;
  showBadge?: boolean;
  productsData?: Product[];
};

export default function NewArrivals({
  title = 'NEW ARRIVALS',
  subtitle = 'Check out our latest collection',
  className,
  showArrows = true,
  showBadge = true,
  productsData,
}: NewArrivalsProps) {
  const router = useRouter();

  // Use custom productsData if provided, otherwise use default flashSaleProducts
  const products = productsData || flashSaleProducts;
  const { startIndex, canPrev, canNext, handlePrev, handleNext } = useFlashSalesHooks(
    products.length,
  );

  const total = products.length;

  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 2; // Mobile: 2 products
      if (window.innerWidth < 1024) return 3; // Tablet: 3 products
      return 4; // Desktop: 4 products
    }
    return 4; // Default
  };

  const responsiveItemsPerView = getItemsPerView();
  const responsiveVisibleProducts = showArrows
    ? products.slice(startIndex, Math.min(total, startIndex + responsiveItemsPerView))
    : products;

  return (
    <section
      className={cn('relative py-6 md:p-8', className)}
      aria-label={`New arrivals products count ${products.length}`}
      data-testid="newarrivals-section"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=600&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header with different styling */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            <h1
              className="text-3xl font-bold text-white md:text-4xl"
              data-testid="newarrivals-main-title"
            >
              {title}
            </h1>
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </div>
          <p className="text-gray-200 md:text-lg">{subtitle}</p>
          {showBadge && (
            <div className="mt-3 flex justify-center">
              <Badge className="bg-yellow-900 text-yellow-100 hover:bg-yellow-800">
                Just Dropped
              </Badge>
            </div>
          )}

          {/* View All Button */}
          <div className="mt-6 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => {
                router.push('/new-arrivals');
              }}
              data-testid="view-all-new-arrivals-button"
              className="flex items-center gap-2 border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:border-yellow-300/50 hover:bg-white/20 hover:text-yellow-300"
            >
              View All New Arrivals
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation arrows - Desktop only */}
        {showArrows && (
          <div className="mb-6 hidden justify-center gap-2 lg:flex">
            <button
              className={`rounded-full p-3 transition-all ${canPrev ? 'bg-white shadow-md hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed bg-gray-100 text-gray-400'}`}
              data-testid="newarrivals-prev-btn"
              onClick={handlePrev}
              aria-label="Previous products"
              disabled={!canPrev}
              aria-disabled={!canPrev}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className={`rounded-full p-3 transition-all ${canNext ? 'bg-white shadow-md hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed bg-gray-100 text-gray-400'}`}
              data-testid="newarrivals-next-btn"
              onClick={handleNext}
              aria-label="Next products"
              disabled={!canNext}
              aria-disabled={!canNext}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Products grid with responsive styling */}
        <div className="relative">
          {/* Mobile Swipeable Container */}
          <div className="md:hidden">
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2">
              {products.map((p, idx) => (
                <div key={p.id} className="w-[45%] flex-shrink-0 snap-center">
                  <ProductCard
                    imageSrc={p.imageSrc}
                    imageAlt={p.imageAlt || p.title}
                    images={p.images}
                    description={p.description}
                    sizes={p.sizes}
                    title={p.title}
                    price={p.price}
                    originalPrice={p.originalPrice}
                    discountPercent={p.discountPercent}
                    rating={p.rating}
                    reviewCount={p.reviewCount}
                    soldCount={p.soldCount}
                    priority={idx < 4}
                    textColor="white"
                    priceColor="white"
                    badgeColor="yellow"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {responsiveVisibleProducts.map((p, idx) => (
              <div
                key={p.id}
                className="group transform transition-all duration-300 hover:scale-105"
              >
                <ProductCard
                  imageSrc={p.imageSrc}
                  imageAlt={p.imageAlt || p.title}
                  images={p.images}
                  description={p.description}
                  sizes={p.sizes}
                  title={p.title}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  discountPercent={p.discountPercent}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  soldCount={p.soldCount}
                  priority={idx < responsiveItemsPerView}
                  textColor="white"
                  priceColor="white"
                  badgeColor="yellow"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
