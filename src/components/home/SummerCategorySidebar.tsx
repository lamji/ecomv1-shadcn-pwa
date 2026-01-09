'use client';

import { categories, Product } from '@/lib/data/products';

interface SummerCategorySidebarProps {
  summerProducts: Product[];
  onCategoryFilter: (categoryId: string | null) => void;
  selectedCategory: string | null;
}

export default function SummerCategorySidebar({
  summerProducts,
  onCategoryFilter,
  selectedCategory,
}: SummerCategorySidebarProps) {
  // Filter categories to show only those that have summer products
  const categoriesWithSummerProducts = categories.filter(category =>
    summerProducts.some(product => product.categoryId === category.id),
  );

  const handleCategoryClick = (categoryId: string | null) => {
    onCategoryFilter(categoryId);
  };

  return (
    <div className="h-full w-full px-0 py-0" data-testid="summer-category-sidebar">
      <div data-testid="summer-category-list">
        <h2
          className="mb-2 text-lg font-bold text-gray-900 md:block"
          data-testid="summer-category-list-title"
        >
          Summer Categories
        </h2>
        <p
          className="mb-4 hidden text-sm text-gray-600 md:block"
          data-testid="summer-category-list-subtitle"
        >
          Filter summer collection by category
        </p>

        {/* All Categories Option */}
        <div
          className="grid grid-cols-3 gap-2 pb-3 md:flex-col md:gap-2 md:space-y-2 md:overflow-x-visible md:pb-0"
          data-testid="summer-category-list-items"
        >
          <button
            className={`group flex shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-2 transition-all hover:bg-gray-50 md:w-full md:flex-row md:justify-start md:rounded-lg md:bg-transparent md:p-0 ${
              selectedCategory === null
                ? 'border border-orange-200 bg-orange-50'
                : 'border border-gray-200'
            }`}
            data-testid="summer-category-all"
            onClick={() => handleCategoryClick(null)}
          >
            <div
              className="mb-1 flex h-6 w-6 items-center justify-center md:mr-3 md:mb-0 md:h-6 md:w-6"
              data-testid="category-icon-bg"
            >
              <svg
                className="h-4 w-4 text-orange-500 md:h-5 md:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <span
              className={`text-[10px] font-medium text-gray-700 transition-colors md:text-sm ${
                selectedCategory === null ? 'font-semibold text-orange-600' : ''
              }`}
              data-testid="category-name"
            >
              All
            </span>
          </button>

          {categoriesWithSummerProducts.map(category => (
            <button
              key={category.id}
              className={`group flex shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-2 transition-all hover:bg-gray-50 md:w-full md:flex-row md:justify-start md:rounded-lg md:bg-transparent md:p-0 ${
                selectedCategory === category.id
                  ? 'border border-orange-200 bg-orange-50'
                  : 'border border-gray-200'
              }`}
              data-testid={`summer-category-item-${category.id}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div
                className="mb-1 flex h-6 w-6 items-center justify-center md:mr-3 md:mb-0 md:h-6 md:w-6"
                data-testid="category-icon-bg"
              >
                {category.icon ? (
                  <span
                    className="text-sm text-orange-500 md:text-base"
                    role="img"
                    aria-label={category.name}
                  >
                    {category.icon}
                  </span>
                ) : (
                  <svg
                    className="h-4 w-4 text-orange-500 md:h-5 md:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-[10px] font-medium text-gray-700 transition-colors md:text-sm ${
                  selectedCategory === category.id ? 'font-semibold text-orange-600' : ''
                }`}
                data-testid="category-name"
              >
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
