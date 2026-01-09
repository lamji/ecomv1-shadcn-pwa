'use client';

import { useParams, useRouter } from 'next/navigation';
import Products from '@/components/home/FlashSale';
import { Button } from '@/components/ui/button';
import { flashSaleProducts, categories } from '@/lib/data/products';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  // Find category by ID and get its name
  const category = categories.find(cat => cat.id === categoryId);
  const categoryName = category?.name || '';

  // Filter products by categoryId
  const categoryProducts = flashSaleProducts.filter(product => product.categoryId === categoryId);

  return (
    <div className="min-h-screen" data-testid="homepage-root">
      {/* Category Banner */}
      <div
        className="relative h-[20vh] overflow-hidden bg-gray-900 sm:h-[30vh] md:h-[40vh]"
        data-testid="category-banner"
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
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">{category?.icon}</span>
              <h1 className="text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                {categoryName}
              </h1>
            </div>
            <p className="mb-4 text-sm text-white/90 sm:text-base md:text-lg lg:text-xl">
              {category?.description || `Discover our amazing ${categoryName} collection`}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-white/80 sm:gap-4">
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <span className="text-lg sm:text-xl lg:text-2xl">📦</span>
                {categoryProducts.length} Products
              </span>
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <span className="text-lg sm:text-xl lg:text-2xl">⭐</span>
                Premium Quality
              </span>
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <span className="text-lg sm:text-xl lg:text-2xl">🚚</span>
                Fast Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category List - Image Buttons */}
      <div className="border-b border-gray-200 bg-white py-6">
        <div className="container mx-auto">
          <div className="border-primary mb-4 border-l-[10px] pl-4">
            <h2 className="text-lg font-semibold text-gray-900">Shop by Category</h2>
            <p className="text-sm text-gray-600">Browse our product categories</p>
          </div>
          {/* Mobile/Tablet - Horizontal Scroll */}
          <div className="md:hidden">
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pt-2 pb-2">
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant="ghost"
                  onClick={() => router.push(`/category/${cat.id}`)}
                  className={`group relative flex h-20 w-20 flex-shrink-0 snap-center flex-col items-center justify-center overflow-hidden rounded-lg p-2 transition-all duration-300 hover:scale-105 ${
                    cat.id === categoryId
                      ? 'border-primary bg-primary/10 ring-primary border ring-2 ring-offset-2 ring-offset-transparent'
                      : 'border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:ring-2 hover:ring-gray-300'
                  }`}
                  data-testid={`category-${cat.id}`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="from-primary/20 h-full w-full bg-gradient-to-tr to-transparent"></div>
                  </div>

                  {/* Icon */}
                  <span className="relative z-10 text-lg transition-transform group-hover:scale-110">
                    {cat.icon}
                  </span>

                  {/* Category Name */}
                  <span className="relative z-10 mt-1 w-full truncate px-1 text-center text-xs leading-tight font-medium text-gray-700">
                    {cat.name}
                  </span>

                  {/* Active Indicator */}
                  {cat.id === categoryId && (
                    <div className="bg-primary absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full"></div>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Desktop - Grid Layout */}
          <div className="hidden flex-wrap justify-start gap-3 md:flex">
            {categories.slice(0, 6).map(cat => (
              <Button
                key={cat.id}
                variant="ghost"
                onClick={() => router.push(`/category/${cat.id}`)}
                className={`group relative flex h-20 w-20 flex-col items-center justify-center overflow-hidden rounded-lg p-2 transition-all duration-300 hover:scale-105 ${
                  cat.id === categoryId
                    ? 'border-primary bg-primary/10 ring-primary border ring-2 ring-offset-2 ring-offset-transparent'
                    : 'border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:ring-2 hover:ring-gray-300'
                }`}
                data-testid={`category-${cat.id}`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="from-primary/20 h-full w-full bg-gradient-to-tr to-transparent"></div>
                </div>

                {/* Icon */}
                <span className="relative z-10 text-lg transition-transform group-hover:scale-110 md:text-xl">
                  {cat.icon}
                </span>

                {/* Category Name */}
                <span className="relative z-10 mt-1 w-full truncate px-1 text-center text-xs leading-tight font-medium text-gray-700">
                  {cat.name}
                </span>

                {/* Active Indicator */}
                {cat.id === categoryId && (
                  <div className="bg-primary absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full"></div>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Explore our products */}
      <div className="mt-8">
        <Products
          title={categoryName || 'ALL PRODUCTS'}
          showCountdown={false}
          showArrows={false}
          showType={true}
          productsData={categoryProducts}
          limit={false}
          showFilter={true}
          hideCategories={true}
        />
      </div>
    </div>
  );
}
