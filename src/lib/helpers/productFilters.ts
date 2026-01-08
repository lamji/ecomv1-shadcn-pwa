import { Product, Category } from '../data/products';

/**
 * Filter products by type - Flash Sale products
 * @returns Array of products with type 'flash'
 */
export const getFlashSaleProducts = (products: Product[]) =>
  products.filter(p => p.type === 'flash');

/**
 * Filter products by type - New Arrivals products
 * @returns Array of products with type 'new'
 */
export const getNewArrivalsProducts = (products: Product[]) =>
  products.filter(p => p.type === 'new');

/**
 * Filter products by type - Regular products
 * @returns Array of products with type 'regular'
 */
export const getRegularProducts = (products: Product[]) =>
  products.filter(p => p.type === 'regular');

/**
 * Filter products by category
 * @param categoryId - Category ID to filter by
 * @returns Array of products in the specified category
 */
export const getProductsByCategory = (products: Product[], categoryId: string) =>
  products.filter(p => p.categoryId === categoryId);

/**
 * Filter products by price range
 * @param minPrice - Minimum price (inclusive)
 * @param maxPrice - Maximum price (inclusive)
 * @returns Array of products within the price range
 */
export const getProductsByPriceRange = (products: Product[], minPrice: number, maxPrice: number) =>
  products.filter(p => p.price >= minPrice && p.price <= maxPrice);

/**
 * Get products on sale (with discount)
 * @returns Array of products with discount
 */
export const getSaleProducts = (products: Product[]) =>
  products.filter(p => p.discountPercent && p.discountPercent > 0);

/**
 * Search products by title
 * @param query - Search query string
 * @returns Array of products matching the search query
 */
export const searchProducts = (products: Product[], query: string) => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return products;

  return products.filter(
    p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.description?.toLowerCase().includes(searchTerm) ||
      p.category?.toLowerCase().includes(searchTerm),
  );
};

/**
 * Dynamic category generation based on product data
 * @returns Array of categories with accurate product counts
 */
export const getCategoriesFromProducts = (products: Product[]): Category[] => {
  const categoryMap = new Map<string, { count: number; product: Product }>();

  // Count products by category
  products.forEach(product => {
    if (product.categoryId) {
      const existing = categoryMap.get(product.categoryId);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(product.categoryId, { count: 1, product });
      }
    }
  });

  // Define base category info
  const baseCategories = [
    {
      id: 'cat-footwear',
      name: 'Footwear',
      description: 'Stylish shoes and sneakers for every occasion',
      icon: '👟',
    },
    {
      id: 'cat-womens-clothing',
      name: "Women's Clothing",
      description: 'Fashionable apparel for modern women',
      icon: '👗',
    },
    {
      id: 'cat-mens-clothing',
      name: "Men's Clothing",
      description: 'Contemporary menswear for every style',
      icon: '👔',
    },
    {
      id: 'cat-accessories',
      name: 'Accessories',
      description: 'Complete your look with our accessories',
      icon: '👜',
    },
    {
      id: 'cat-electronics',
      name: 'Electronics',
      description: 'Latest tech gadgets and devices',
      icon: '📱',
    },
    {
      id: 'cat-home-living',
      name: 'Home & Living',
      description: 'Decor and essentials for your home',
      icon: '🏠',
    },
  ];

  // Merge base categories with actual product counts
  return baseCategories.map(baseCat => {
    const categoryData = categoryMap.get(baseCat.id);
    return {
      ...baseCat,
      productCount: categoryData?.count || 0,
    };
  });
};
