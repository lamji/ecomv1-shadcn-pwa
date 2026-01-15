'use client';

import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/lib/data/products';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  hideCategories?: boolean;
}

export interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  inStockOnly: boolean;
  sortBy: 'price-low' | 'price-high' | 'reviews' | 'sold';
  categories: string[];
  types: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  hideCategories = false,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: { min: 0, max: 1000 },
    inStockOnly: false,
    sortBy: 'price-low',
    categories: [],
    types: [],
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
      types: [],
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

  const toggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type) ? prev.types.filter(t => t !== type) : [...prev.types, type],
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      data-testid="filter-modal-overlay"
    >
      <div
        className="mx-4 w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-2xl"
        data-testid="filter-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900" data-testid="filter-modal-title">
            Filter Products
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="filter-modal-close"
            className="rounded-lg transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
          {/* Price Range */}
          <div data-testid="price-filter-section">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <span className="text-lg">💰</span>
              Price Range
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Min Price</label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500">
                    ₱
                  </span>
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
                    className="w-full rounded-lg border border-gray-200 py-3 pr-3 pl-8 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    data-testid="price-min-input"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Max Price</label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500">
                    ₱
                  </span>
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
                    className="w-full rounded-lg border border-gray-200 py-3 pr-3 pl-8 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    data-testid="price-max-input"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div data-testid="sort-filter-section">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <Star className="h-5 w-5 text-yellow-500" />
              Sort By
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'reviews', label: 'Most Reviews' },
                { value: 'sold', label: 'Most Sold' },
              ].map(option => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                >
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
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          {!hideCategories && (
            <div data-testid="category-filter-section">
              <h3 className="mb-4 text-base font-semibold text-gray-900">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category.id}
                    variant={filters.categories.includes(category.name) ? 'default' : 'outline'}
                    className={`cursor-pointer px-3 py-2 text-sm font-medium transition-all ${
                      filters.categories.includes(category.name)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={() => toggleCategory(category.name)}
                    data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category.icon} {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Product Types */}
          <div data-testid="type-filter-section">
            <h3 className="mb-4 text-base font-semibold text-gray-900">Product Type</h3>
            <div className="space-y-2">
              {[
                { value: 'flash', label: 'Flash Sale', icon: '⚡', color: 'orange' },
                { value: 'new', label: 'New Arrivals', icon: '🆕', color: 'green' },
                { value: 'regular', label: 'Regular', icon: '📦', color: 'blue' },
              ].map(type => (
                <label
                  key={type.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type.value)}
                    onChange={() => toggleType(type.value)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    data-testid={`type-${type.value}`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 border-t border-gray-100 p-6" data-testid="filter-modal-actions">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="flex-1 rounded-lg border-gray-200 font-medium transition-colors hover:bg-gray-50"
            data-testid="reset-filters-button"
          >
            Reset All
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="bg-primary flex-1 rounded-lg font-medium transition-colors hover:bg-blue-700"
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
