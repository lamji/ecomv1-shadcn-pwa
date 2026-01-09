'use client';

import AdSlider, { defaultAds } from '@/components/home/AdSlider';
import CategorySidebar from '@/components/home/CategorySidebar';
import Products from '@/components/home/FlashSale';
import MiddleBanner from '@/components/home/MiddleBanner';
import NewArrivals from '@/components/home/NewArrivals';
import { flashSaleProducts } from '@/lib/data/products';
import { getFlashSaleProducts, getNewArrivalsProducts } from '@/lib/helpers/productFilters';

export default function Homepage() {
  return (
    <div className="min-h-screen" data-testid="homepage-root">
      {/* Jumbotron Section */}
      <div className="h-[100%] bg-white text-gray-900 lg:h-[60vh]" data-testid="jumbotron-section">
        <div className="container mx-auto h-full px-0 lg:px-0" data-testid="jumbotron-container">
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

      {/* Flash Sale Products */}
      <div className="mt-1 md:mt-8">
        <Products
          title="FLASH SALE"
          showCountdown={true}
          showArrows={true}
          productsData={getFlashSaleProducts(flashSaleProducts)}
        />
      </div>

      {/* Middle Banner */}
      <div className="mt-8 px-4 md:px-6">
        <MiddleBanner />
      </div>

      {/* Explore our products */}
      <div className="mt-8">
        <Products
          title="EXPLORE OUR PRODUCTS"
          showCountdown={false}
          showArrows={false}
          showType={true}
          productsData={flashSaleProducts}
          limit={true}
        />
      </div>

      {/* New Arrivals */}
      <div className="mt-8">
        <NewArrivals productsData={getNewArrivalsProducts(flashSaleProducts)} />
      </div>
    </div>
  );
}
