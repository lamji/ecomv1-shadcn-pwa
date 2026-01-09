import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
  searchProductsAsync,
  getSearchSuggestionsAsync,
  setQuery,
  clearSearch,
} from '@/lib/features/searchSlice';
import { Product } from '@/lib/data/products';

export interface SearchHooksOptions {
  products?: Product[];
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
}

export interface SearchResult {
  products: Product[];
  query: string;
  totalCount: number;
  isSearching: boolean;
}

export const useSearchHooks = (options: SearchHooksOptions = {}) => {
  const { minQueryLength = 2 } = options;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchState = useAppSelector(state => state.search);

  // Trigger suggestions when query changes
  useEffect(() => {
    if (searchState.query && searchState.query.length >= minQueryLength) {
      dispatch(getSearchSuggestionsAsync(searchState.query));
    }
  }, [searchState.query, minQueryLength, dispatch]);

  // Update search query in Redux
  const updateSearchQuery = useCallback(
    (query: string) => {
      dispatch(setQuery(query));
    },
    [dispatch],
  );

  // Get search suggestions
  const getSearchSuggestions = useCallback(
    (query: string) => {
      if (!query || query.length < minQueryLength) return [];
      return searchState.suggestions;
    },
    [searchState.suggestions, minQueryLength],
  );

  // Handle search submission
  const handleSearch = useCallback(
    (query?: string) => {
      const finalQuery = query || searchState.query;
      if (finalQuery.trim()) {
        // Dispatch search action
        dispatch(searchProductsAsync(finalQuery));

        // Navigate to search page
        router.push(`/search?q=${encodeURIComponent(finalQuery.trim())}`);
      }
    },
    [searchState.query, router, dispatch],
  );

  // Clear search
  const clearSearchQuery = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  // Get popular searches (based on most viewed/sold products)
  const getPopularSearches = useCallback(() => {
    // This would come from products data - for now return empty array
    return [];
  }, []);

  return {
    // State from Redux
    searchQuery: searchState.query,
    setSearchQuery: updateSearchQuery,
    searchHistory: [], // Could be implemented in Redux if needed
    isSearching: searchState.isLoading,

    // Results from Redux
    searchResults: {
      products: searchState.results,
      query: searchState.lastSearchQuery,
      totalCount: searchState.results.length,
      isSearching: searchState.isLoading,
    },

    // Actions
    handleSearch,
    clearSearch: clearSearchQuery,
    removeFromHistory: () => {}, // Could be implemented in Redux
    clearHistory: () => {}, // Could be implemented in Redux

    // Utilities
    getSearchSuggestions,
    getPopularSearches,
  };
};
