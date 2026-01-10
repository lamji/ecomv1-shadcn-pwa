import type { ProductType } from './product';

// Type for product object that goes to cart
export type CartProduct = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  imageSrc: string;
  imageAlt: string;
  stock: number;
  description: string;
  categoryId: string;
  category: string;
  type: ProductType;
  images: string[];
  sizes: string[];
};

// Parameters for creating cart product
export type CreateCartProductParams = {
  id: string;
  title: string;
  price?: number | string;
  originalPrice?: number | string;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  imageSrc?: string;
  imageAlt?: string;
  stock?: number;
  productType?: ProductType;
};
