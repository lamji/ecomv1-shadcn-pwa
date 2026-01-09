import { useEffect, useRef, useState, useMemo } from 'react';
import { Product, categories } from '@/lib/data/products';
import { FilterOptions } from '@/components/home/FilterModal';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type CarouselState = {
  itemsPerView: number;
  startIndex: number;
  canPrev: boolean;
  canNext: boolean;
  handlePrev: () => void;
  handleNext: () => void;
};

export function useFlashSalesHooks(
  totalItems: number = 0,
  products: Product[] = [],
  filters: FilterOptions | null = null,
): TimeLeft & CarouselState & { filteredProducts: Product[] } {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const endTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  console.log('Filters:', filters);

  // Carousel state
  const [itemsPerView, setItemsPerView] = useState<number>(4);
  const [startIndex, setStartIndex] = useState<number>(0);

  useEffect(() => {
    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(now.getDate() + 3);
    threeDaysFromNow.setHours(23, 59, 59, 999);
    endTimeRef.current = threeDaysFromNow.getTime();

    const tick = () => {
      const nowMs = Date.now();
      const difference = endTimeRef.current - nowMs;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });

      const delay = Math.max(0, 1000 - (nowMs % 1000));
      timerRef.current = setTimeout(tick, delay);
    };

    tick();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Responsive itemsPerView (md breakpoint at 768px)
  useEffect(() => {
    const onResize = () => {
      const isMdUp =
        typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
      setItemsPerView(isMdUp ? 4 : 2);
    };
    onResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, []);

  // Clamp start index when deps change
  const maxStart = Math.max(0, totalItems - itemsPerView);
  useEffect(() => {
    setStartIndex(prev => Math.min(Math.max(0, prev), maxStart));
  }, [itemsPerView, totalItems, maxStart]);

  const canPrev = startIndex > 0;
  const canNext = startIndex < maxStart;

  const handlePrev = () => {
    if (!canPrev) return;
    setStartIndex(prev => Math.max(0, prev - 1));
  };
  const handleNext = () => {
    if (!canNext) return;
    setStartIndex(prev => Math.min(maxStart, prev + 1));
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!filters) return products;

    const filtered = products.filter(product => {
      // Price filter
      const productPrice = product.originalPrice || product.price || 0;
      if (productPrice < filters.priceRange.min || productPrice > filters.priceRange.max) {
        return false;
      }

      // Stock filter
      if (filters.inStockOnly && product.stock === 0) {
        return false;
      }

      // Category filter - match category names to categoryIds
      if (filters.categories.length > 0) {
        const selectedCategoryIds = categories
          .filter(cat => filters.categories.includes(cat.name))
          .map(cat => cat.id);

        if (!product.categoryId || !selectedCategoryIds.includes(product.categoryId)) {
          return false;
        }
      }

      // Type filter
      if (filters.types.length > 0) {
        if (!product.type || !filters.types.includes(product.type)) {
          return false;
        }
      }

      return true;
    });

    // Sold filter - apply after all other filters, only when sortBy is "sold"
    if (filters.sortBy === 'sold') {
      // Get products with any sold count, sorted by sold count
      const sortedBySold = [...filtered].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      // Return top 50% or top 10 items, whichever is larger
      const cutoff = Math.max(Math.ceil(sortedBySold.length * 0.5), 10);
      return sortedBySold.slice(0, cutoff);
    }

    // Review filter - apply after all other filters, only when sortBy is "reviews"
    if (filters.sortBy === 'reviews') {
      // Get products with any review count, sorted by review count
      const sortedByReviews = [...filtered].sort(
        (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0),
      );
      // Return top 50% or top 10 items, whichever is larger
      const cutoff = Math.max(Math.ceil(sortedByReviews.length * 0.5), 10);
      return sortedByReviews.slice(0, cutoff);
    }

    // Sort products
    switch (filters.sortBy as 'price-low' | 'price-high' | 'reviews' | 'sold') {
      case 'price-low':
        return filtered.sort(
          (a, b) => (a.originalPrice || a.price || 0) - (b.originalPrice || b.price || 0),
        );
      case 'price-high':
        return filtered.sort(
          (a, b) => (b.originalPrice || b.price || 0) - (a.originalPrice || a.price || 0),
        );
      case 'reviews':
        return filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      case 'sold':
        return filtered.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      default:
        return filtered;
    }
  }, [products, filters]);

  return {
    ...timeLeft,
    itemsPerView,
    startIndex,
    canPrev,
    canNext,
    handlePrev,
    handleNext,
    filteredProducts,
  };
}
