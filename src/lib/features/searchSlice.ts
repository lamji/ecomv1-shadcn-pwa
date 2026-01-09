import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/lib/data/products';
import { flashSaleProducts } from '@/lib/data/products';
import { searchProducts } from '@/lib/helpers/productFilters';

interface SearchState {
  query: string;
  results: Product[];
  isLoading: boolean;
  error: string | null;
  suggestions: Product[];
  lastSearchQuery: string;
}

const initialState: SearchState = {
  query: '',
  results: [],
  isLoading: false,
  error: null,
  suggestions: [],
  lastSearchQuery: '',
};

// Async thunk for searching products
export const searchProductsAsync = createAsyncThunk(
  'search/searchProducts',
  async (query: string) => {
    // Simulate async search (in real app, this would be an API call)
    await new Promise(resolve => setTimeout(resolve, 100));

    const results = searchProducts(flashSaleProducts, query);
    return { query, results };
  },
);

// Async thunk for getting search suggestions
export const getSearchSuggestionsAsync = createAsyncThunk(
  'search/getSuggestions',
  async (query: string) => {
    // Simulate async suggestions (in real app, this would be an API call)
    await new Promise(resolve => setTimeout(resolve, 50));

    if (!query || query.length < 2) return [];

    const suggestions = flashSaleProducts
      .filter(product => product.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);

    return suggestions;
  },
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearch: state => {
      state.query = '';
      state.results = [];
      state.error = null;
      state.suggestions = [];
      state.lastSearchQuery = '';
    },
    setResults: (state, action: PayloadAction<Product[]>) => {
      state.results = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<Product[]>) => {
      state.suggestions = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Search products
      .addCase(searchProductsAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProductsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.results;
        state.lastSearchQuery = action.payload.query;
        state.error = null;
      })
      .addCase(searchProductsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Search failed';
      })
      // Get suggestions
      .addCase(getSearchSuggestionsAsync.pending, state => {
        // Don't set loading for suggestions
        console.log('Getting search suggestions...', { state });
      })
      .addCase(getSearchSuggestionsAsync.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(getSearchSuggestionsAsync.rejected, state => {
        state.suggestions = [];
      });
  },
});

export const { setQuery, clearSearch, setResults, setSuggestions, clearError } =
  searchSlice.actions;

export default searchSlice.reducer;
