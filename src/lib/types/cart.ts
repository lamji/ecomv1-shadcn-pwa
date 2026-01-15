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

// Cart item with quantity and timestamp
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  timestamp: Date;
}

// Cart state structure
export interface CartState {
  cart: CartItem[];
  temporaryCart: CartItem[];
}

// Parameters for adding to cart
export interface AddToCartPayload {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

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
