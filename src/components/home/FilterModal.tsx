'use client';

import React, { useState } from 'react';
import { X, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/helper/currency';
import { categories } from '@/lib/data/products';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  inStockOnly: boolean;
  sortBy: 'price-low' | 'price-high' | 'reviews' | 'sold';
  categories: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: { min: 0, max: 1000 },
    inStockOnly: false,
    sortBy: 'price-low',
    categories: [],
  });

  if (!isOpen) return null;

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 1000 },
      inStockOnly: false,
      sortBy: 'price-low',
      categories: [],
    });
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      data-testid="filter-modal-overlay"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl" data-testid="filter-modal">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900" data-testid="filter-modal-title">
            Filter Products
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="filter-modal-close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Price Range */}
        <div className="mb-6" data-testid="price-filter-section">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span className="text-base">₱</span>
            Price Range
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-600">
                Min ({formatCurrency(filters.priceRange.min)})
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={filters.priceRange.min || ''}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    priceRange: {
                      ...prev.priceRange,
                      min: e.target.value ? Number(e.target.value) : 0,
                    },
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                data-testid="price-min-input"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-600">
                Max ({formatCurrency(filters.priceRange.max)})
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={filters.priceRange.max || ''}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    priceRange: {
                      ...prev.priceRange,
                      max: e.target.value ? Number(e.target.value) : 0,
                    },
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                data-testid="price-max-input"
              />
            </div>
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-6" data-testid="stock-filter-section">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Package className="h-4 w-4" />
            Availability
          </h3>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={e => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              data-testid="in-stock-checkbox"
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>

        {/* Sort By */}
        <div className="mb-6" data-testid="sort-filter-section">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Star className="h-4 w-4" />
            Sort By
          </h3>
          <div className="space-y-2">
            {[
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'reviews', label: 'Most Reviews' },
              { value: 'sold', label: 'Most Sold' },
            ].map(option => (
              <label key={option.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="sortBy"
                  value={option.value}
                  checked={filters.sortBy === option.value}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      sortBy: e.target.value as FilterOptions['sortBy'],
                    }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  data-testid={`sort-${option.value}`}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6" data-testid="category-filter-section">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category.id}
                variant={filters.categories.includes(category.name) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleCategory(category.name)}
                data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category.icon} {category.name} ({category.productCount})
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3" data-testid="filter-modal-actions">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="flex-1"
            data-testid="reset-filters-button"
          >
            Reset
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1"
            data-testid="apply-filters-button"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
