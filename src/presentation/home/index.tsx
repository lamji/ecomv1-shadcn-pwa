'use client';

import CategorySidebar from '@/components/home/CategorySidebar';
import AdSlider, { defaultAds } from '@/components/home/AdSlider';
import FlashSale from '@/components/home/FlashSale';

export default function Homepage() {
  return (
    <div className="min-h-screen" data-testid="homepage-root">
      {/* Jumbotron Section */}
      <div className="h-[35vh] bg-white text-gray-900 lg:h-[50vh]" data-testid="jumbotron-section">
        <div className="container mx-auto h-full px-0 lg:px-4" data-testid="jumbotron-container">
          <div
            className="flex h-full flex-col gap-4 md:flex-row md:gap-8"
            data-testid="homepage-container"
          >
            {/* Ad Slider first on mobile, second on desktop */}
            <div className="order-1 flex-1 md:order-2" data-testid="section-ad-slider">
              <AdSlider ads={defaultAds} whiteDots={true} />
            </div>

            {/* Category List second on mobile, first on desktop */}
            <div className="order-2 md:order-1 md:w-[280px]" data-testid="section-category-sidebar">
              <CategorySidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Content Below Jumbotron */}
      <FlashSale />
    </div>
  );
}
