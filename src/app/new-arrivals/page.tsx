'use client';

import Products from '@/components/home/FlashSale';
import { flashSaleProducts } from '@/lib/data/products';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export default function NewArrivalsPage() {
  // Filter products to show only new arrivals (type: 'new')
  const newArrivalsProducts = flashSaleProducts.filter(product => product.type === 'new');

  return (
    <div className="min-h-screen" data-testid="homepage-root">
      {/* New Arrivals Banner */}
      <div
        className="relative h-[40vh] overflow-hidden bg-gray-900 sm:h-[50vh]"
        data-testid="new-arrivals-banner"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat backdrop-blur-sm"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop&crop=center')`,
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto flex h-full items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                NEW ARRIVALS
              </h1>
              <Sparkles className="h-8 w-8 text-yellow-400" />
            </div>
            <p className="mb-6 text-lg text-white/90 sm:text-xl md:text-2xl">
              Check out our latest collection of fresh products
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/80">
              <Badge className="bg-yellow-900 px-4 py-2 text-yellow-100 hover:bg-yellow-800">
                Just Dropped
              </Badge>
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <span className="text-xl sm:text-2xl">📦</span>
                {newArrivalsProducts.length} New Products
              </span>
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <span className="text-xl sm:text-2xl">⭐</span>
                Premium Quality
              </span>
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <span className="text-xl sm:text-2xl">🚚</span>
                Fast Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-8">
        <Products
          title="NEW ARRIVALS"
          showCountdown={false}
          showArrows={false}
          showType={true}
          productsData={newArrivalsProducts}
          limit={false}
          showFilter={true}
        />
      </div>
    </div>
  );
}
