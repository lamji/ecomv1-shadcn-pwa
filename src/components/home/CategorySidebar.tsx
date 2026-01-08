'use client';

import { Badge } from '@/components/ui/badge';

const categories = [
  { id: 1, name: 'Electronics', count: 24 },
  { id: 2, name: 'Clothing', count: 18 },
  { id: 3, name: 'Home & Garden', count: 12 },
  { id: 4, name: 'Sports', count: 8 },
  { id: 5, name: 'Books', count: 15 },
  { id: 6, name: 'Toys', count: 10 },
];

export default function CategorySidebar() {
  return (
    <div className="h-full w-full px-2 py-5" data-testid="category-sidebar">
      <div data-testid="category-list">
        <h2
          className="mb-2 text-lg font-bold text-gray-900 md:block"
          data-testid="category-list-title"
        >
          Exclusives
        </h2>
        <p
          className="mb-4 hidden text-sm text-gray-600 md:block"
          data-testid="category-list-subtitle"
        >
          Discover our wide range of products
        </p>
        <ul
          className="flex flex-nowrap gap-2 overflow-x-auto pb-2 md:flex-col md:gap-2 md:space-y-2 md:overflow-x-visible md:pb-0"
          data-testid="category-list-items"
        >
          {categories.map(category => (
            <li
              key={category.id}
              className="group flex shrink-0 cursor-pointer list-none items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 whitespace-nowrap transition-colors hover:bg-gray-50 md:w-full md:border-0 md:bg-transparent md:p-0"
              data-testid={`category-item-${category.id}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600 md:group-hover:underline"
                  data-testid="category-name"
                >
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-xs text-gray-700 hover:bg-gray-200 md:text-sm"
                  data-testid="category-count-badge"
                >
                  {category.count}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
