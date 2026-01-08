'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useSlideHooks } from '@/lib/hooks/useSlideHooks';

interface AdItem {
  id: string;
  imageUrl: string;
  title?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface AdSliderProps {
  ads: AdItem[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  whiteDots?: boolean;
}

export default function AdSlider({
  ads,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  whiteDots = false,
}: AdSliderProps) {
  const { currentIndex, goToPrevious, goToNext, goToSlide } = useSlideHooks({
    total: ads.length,
    autoPlay,
    interval,
  });

  if (ads.length === 0) {
    return (
      <div
        className="h-full w-full border-gray-200 px-0 py-0 md:flex-1 md:border-l md:px-4 md:py-5"
        data-testid="ad-section"
      >
        <div
          className="bg-muted relative flex min-h-[150px] w-full items-center justify-center overflow-hidden rounded-none md:min-h-[400px]"
          data-testid="ad-placeholder"
          style={{ height: '100%' }}
        >
          <p className="text-muted-foreground">No ads available</p>
        </div>
      </div>
    );
  }

  const currentAd = ads[currentIndex];

  return (
    <div
      className="h-full w-full border-gray-200 px-0 py-0 md:flex-1 md:border-l md:px-4 md:py-5"
      data-testid="ad-section"
    >
      <div
        className="bg-muted relative min-h-[150px] w-full overflow-hidden rounded-none md:min-h-[400px]"
        data-testid="ad-placeholder"
        style={{ height: '100%' }}
      >
        {/* Main Image */}
        <Image
          src={currentAd.imageUrl}
          alt={currentAd.title || 'Advertisement'}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 80vw"
          onError={e => {
            console.error('Image failed to load:', e);
          }}
        />

        {/* Navigation Arrows */}
        {showArrows && ads.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              data-testid="prev-button"
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
              onClick={goToNext}
              className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              data-testid="next-button"
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
          </>
        )}

        {/* Dots Indicator */}
        {showDots && ads.length > 1 && (
          <div
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/30 px-3 py-2"
            data-testid="dots-container"
          >
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  whiteDots
                    ? 'bg-white hover:bg-gray-300'
                    : index === currentIndex
                      ? 'bg-primary'
                      : 'bg-white/70 hover:bg-white'
                }`}
                data-testid={`dot-${index}`}
              />
            ))}
          </div>
        )}

        {/* Ad Button */}
        <div className="absolute inset-0 flex items-end justify-start p-6">
          <Button
            variant="default"
            className="bg-primary hover:bg-primary/90 px-4 py-2 text-lg font-semibold text-white"
            data-testid="shop-now-button"
            onClick={() => {
              if (currentAd.buttonLink) {
                window.open(currentAd.buttonLink, '_blank');
              }
            }}
          >
            {currentAd.buttonText || 'Shop now →'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Default ads data
export const defaultAds: AdItem[] = [
  {
    id: '1',
    imageUrl: 'https://www.pricekeeda.com/uploads/posts/2025/iPhone-17-Pro-2.webp',
    title: 'iPhone 17 Pro',
    buttonText: 'Shop now →',
    buttonLink: '/products/iphone-17-pro',
  },
  {
    id: '2',
    imageUrl:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80',
    title: 'Summer Sale',
    buttonText: 'Learn more →',
    buttonLink: '/sale',
  },
];
