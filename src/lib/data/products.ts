export type Product = {
  id: string;
  imageSrc: string;
  imageAlt?: string;
  title: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
};

export const flashSaleProducts: Product[] = [
  {
    id: 'p1',
    imageSrc: '/products/fashion-shoes-sneakers.jpg',
    imageAlt: 'Sample Product 1',
    title: 'Stylish Fashion Sneakers',
    price: 59.99,
    originalPrice: 119.99,
    discountPercent: 50,
    rating: 4.5,
    reviewCount: 128,
  },
  {
    id: 'p2',
    imageSrc: '/products/men-shoes.jpg',
    imageAlt: 'Sample Product 2',
    title: "Classic Men's Leather Shoes",
    price: 79.99,
    originalPrice: 159.99,
    discountPercent: 50,
    rating: 4.2,
    reviewCount: 89,
  },
  {
    id: 'p3',
    imageSrc: '/products/men-shoes-2.jpg',
    imageAlt: 'Sample Product 3',
    title: "Casual Men's Sneakers",
    price: 24.99,
    originalPrice: 49.99,
    discountPercent: 50,
    rating: 4.7,
    reviewCount: 215,
  },
  {
    id: 'p4',
    imageSrc: '/products/emerald-green-evening-gown-with-lace-detailing-gold-clutch.jpg',
    imageAlt: 'Sample Product 4',
    title: 'Elegant Emerald Green Evening Gown',
    price: 19.99,
    originalPrice: 39.99,
    discountPercent: 50,
    rating: 4.0,
    reviewCount: 62,
  },
  {
    id: 'p5',
    imageSrc: '/products/woman-with-hands-hips.jpg',
    imageAlt: 'Sample Product 1',
    title: 'Woman with Hands on Hips',
    price: 59.99,
    originalPrice: 119.99,
    discountPercent: 50,
    rating: 4.5,
    reviewCount: 128,
  },
];
