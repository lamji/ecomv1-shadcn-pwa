import { useParams } from 'next/navigation';
import { flashSaleProducts } from '@/lib/data/products';
import { useState, useEffect } from 'react';

export const useProductDetailsHooks = () => {
  const params = useParams();
  const productId = params.id as string;

  // State declarations
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');

  // Find product by matching the generated ID
  const product = flashSaleProducts.find(p => {
    const generatedId = p.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    return generatedId === productId;
  });

  // Set default size when product is found
  useEffect(() => {
    if (product?.sizes?.[0]) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  // Derived values
  const images = product?.images || [product?.imageSrc] || [];
  const isOutOfStock = product?.stock === 0;
  const hasDiscount =
    product?.type === 'flash' && product?.discountPercent && product.discountPercent > 0;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && (!product?.stock || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };

  const displayPrice = hasDiscount
    ? Number(product?.originalPrice || product?.price) * (1 - (product?.discountPercent || 0) / 100)
    : Number(product?.originalPrice || product?.price);

  const totalPrice = displayPrice * quantity;

  return {
    // Product data
    product,
    productId,

    // State
    quantity,
    setQuantity,
    selectedImage,
    setSelectedImage,
    selectedSize,
    setSelectedSize,

    // Derived values
    images,
    isOutOfStock,
    hasDiscount,
    displayPrice,
    totalPrice,

    // Handlers
    handleQuantityChange,
  };
};
