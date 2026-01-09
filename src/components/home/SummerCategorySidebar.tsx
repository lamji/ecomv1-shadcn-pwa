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
    <div className="h-full w-full px-2 py-5" data-testid="summer-category-sidebar">
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
        <ul
          className="flex flex-nowrap gap-2 overflow-x-auto pb-2 md:flex-col md:gap-2 md:space-y-2 md:overflow-x-visible md:pb-0"
          data-testid="summer-category-list-items"
        >
          <li
            className={`group flex shrink-0 cursor-pointer list-none items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 whitespace-nowrap transition-colors md:w-full md:border-0 md:bg-transparent md:p-0 ${
              selectedCategory === null ? 'border-blue-200 bg-blue-50' : 'hover:bg-gray-50'
            }`}
            data-testid="summer-category-all"
            onClick={() => handleCategoryClick(null)}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg" data-testid="category-icon">
                🌞
              </span>
              <span
                className={`text-sm font-medium transition-colors md:group-hover:underline ${
                  selectedCategory === null
                    ? 'text-blue-600'
                    : 'text-gray-900 group-hover:text-blue-600'
                }`}
                data-testid="category-name"
              >
                All Summer
              </span>
            </div>
          </li>

          {categoriesWithSummerProducts.map(category => (
            <li
              key={category.id}
              className={`group flex shrink-0 cursor-pointer list-none items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 whitespace-nowrap transition-colors hover:bg-gray-50 md:w-full md:border-0 md:bg-transparent md:p-0 ${
                selectedCategory === category.id ? 'border-blue-200 bg-blue-50' : ''
              }`}
              data-testid={`summer-category-item-${category.id}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="flex items-center gap-3">
                {category.icon && (
                  <span className="text-lg" data-testid="category-icon">
                    {category.icon}
                  </span>
                )}
                <span
                  className={`text-sm font-medium transition-colors md:group-hover:underline ${
                    selectedCategory === category.id
                      ? 'text-blue-600'
                      : 'text-gray-900 group-hover:text-blue-600'
                  }`}
                  data-testid="category-name"
                >
                  {category.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
