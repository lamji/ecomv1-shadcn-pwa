import React from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/helper/currency';
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';

type ProductModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  price?: number | string;
  imageSrc: string;
  images?: string[];
  description?: string;
  sizes?: string[];
  discountPercent?: number;
  originalPrice?: number | string;
  type?: 'flash' | 'new' | 'regular';
  stock?: number;
};

export default function ProductModal({
  open,
  onClose,
  title,
  price,
  imageSrc,
  images = [],
  description,
  sizes,
  discountPercent,
  originalPrice: newOriginalPrice,
  type,
  stock,
}: ProductModalProps) {
  const gallery = images.length > 0 ? images : [imageSrc];
  const [index, setIndex] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const basePrice = typeof price === 'number' ? price : parseFloat(price || '0');

  // Extract discount from product data
  const hasDiscount = discountPercent && discountPercent > 0;
  const calculatedOriginalPrice = hasDiscount
    ? basePrice / (1 - discountPercent! / 100)
    : basePrice;

  // Use passed originalPrice if available, otherwise calculate it
  const displayOriginalPrice = newOriginalPrice || calculatedOriginalPrice;

  // Determine display price based on product type
  const originalPriceForCalc = Number(newOriginalPrice) || Number(displayOriginalPrice);
  const displayPrice =
    type === 'flash'
      ? originalPriceForCalc * (1 - (discountPercent || 0) / 100)
      : Number(newOriginalPrice || basePrice);
  const totalPrice = Number(displayPrice) * quantity;

  React.useEffect(() => {
    // reset selected image when (re)opening
    if (open) setIndex(0);
  }, [open]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative z-[101] mx-4 w-full max-w-6xl rounded-lg bg-white p-6 shadow-xl lg:w-[50%] lg:max-w-none">
        {/* Header */}
        <div
          className="mb-6 flex items-center justify-between border-b pb-4"
          data-testid="product-modal-header"
        >
          <h2 className="text-2xl font-semibold text-gray-900" data-testid="product-modal-title">
            {title}
          </h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-md bg-gray-100 p-2 text-sm hover:bg-gray-200"
            data-testid="product-modal-close-button"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Section */}
          <div className="flex flex-col gap-4">
            {/* Main Image Wrapper */}
            <div
              className="relative h-[400px] w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50"
              data-testid="product-modal-main-image"
            >
              <Image
                src={gallery[Math.min(index, gallery.length - 1)]}
                alt={title}
                fill
                className="object-cover transition-opacity duration-300"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
              />
            </div>

            {/* Thumbnail Images Wrapper */}
            <div className="grid grid-cols-4 gap-2" data-testid="product-modal-thumbnails">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  className={`relative h-20 w-full overflow-hidden rounded-lg border-2 ${i === index ? 'border-primary' : 'border-gray-200'} bg-gray-50`}
                  onClick={() => setIndex(i)}
                  aria-label={`Select image ${i + 1}`}
                  data-testid={`product-modal-thumbnail-${i}`}
                >
                  <Image
                    src={src}
                    alt={`${title} thumbnail ${i + 1}`}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="120px"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-6">
            {/* Product Description */}
            <div data-testid="product-modal-description">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Description</h3>
              <p className="leading-relaxed text-gray-600">
                {description ||
                  'Experience premium quality and style with this exceptional product. Crafted with attention to detail and designed for maximum comfort and durability. Perfect for everyday use or special occasions.'}
              </p>
            </div>

            {/* Size Selector */}
            {sizes && sizes.length > 0 && (
              <div data-testid="product-modal-size-selector">
                <label className="mb-3 block text-sm font-medium text-gray-700">Size</label>
                <div className="grid grid-cols-4 gap-3">
                  {sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(size)}
                      className="font-semibold"
                      data-testid={`product-modal-size-${size}`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div data-testid="product-modal-quantity-selector">
              <label className="mb-2 block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="rounded-md border border-gray-300 p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={quantity <= 1 || stock === 0}
                  aria-label="Decrease quantity"
                  data-testid="product-modal-quantity-decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span
                  className="w-12 text-center font-medium text-gray-900"
                  data-testid="product-modal-quantity-value"
                >
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="rounded-md border border-gray-300 p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Increase quantity"
                  data-testid="product-modal-quantity-increase"
                  disabled={stock === 0}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Price Display */}
            <div
              className="space-y-3 rounded-lg bg-gray-50 p-4"
              data-testid="product-modal-price-display"
            >
              {type === 'flash' && (
                <div
                  className="flex items-center justify-between"
                  data-testid="product-modal-discount-info"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-500">Original Price:</span>
                    <span
                      className="font-medium text-gray-400 line-through"
                      data-testid="product-modal-original-price"
                    >
                      {formatCurrency(Number(displayOriginalPrice))}
                    </span>
                  </div>
                  <span
                    className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white"
                    data-testid="product-modal-discount-badge"
                  >
                    -{discountPercent}%
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-2" data-testid="product-modal-unit-price">
                <span className="text-sm text-gray-500">
                  {type === 'flash' ? 'Discounted Price:' : 'Unit Price:'}
                </span>
                <span
                  className="text-lg font-semibold text-gray-700"
                  data-testid="product-modal-display-price"
                >
                  {formatCurrency(Number(displayPrice))}
                </span>
              </div>
              <div
                className="flex items-center justify-between border-t pt-3"
                data-testid="product-modal-total-price"
              >
                <span className="text-sm font-medium text-gray-600">Total Price:</span>
                <span
                  className="text-primary text-3xl font-bold"
                  data-testid="product-modal-total-amount"
                >
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="bg-primary hover:bg-primary/90 w-full py-3 font-medium text-white"
              onClick={() => {
                console.log('Added to cart:', {
                  title,
                  quantity,
                  totalPrice,
                  selectedSize,
                  size: selectedSize,
                });
                // TODO: Implement add to cart functionality
              }}
              disabled={stock === 0}
              data-testid="product-modal-add-to-cart"
            >
              {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
