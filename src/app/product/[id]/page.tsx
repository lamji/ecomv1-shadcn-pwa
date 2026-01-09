'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RefreshCw,
  User,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/shared/StarRating';
import FlashSale from '@/components/home/FlashSale';
import { formatCurrency } from '@/lib/helper/currency';
import { useProductDetailsHooks } from '@/lib/hooks/useProductDetailsHooks';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import { useProductReviews } from '@/lib/hooks/useProductReviews';
import { useSimilarProducts } from '@/lib/hooks/useSimilarProducts';
import { flashSaleProducts } from '@/lib/data/products';

export default function ProductPage() {
  const {
    product,
    quantity,
    selectedImage,
    setSelectedImage,
    selectedSize,
    setSelectedSize,
    images,
    isOutOfStock,
    hasDiscount,
    displayPrice,
    totalPrice,
    handleQuantityChange,
  } = useProductDetailsHooks();

  const { addToCart } = useAddToCart();
  const router = useRouter();

  // State for managing visible reviews
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);

  // Load more reviews function
  const handleLoadMoreReviews = () => {
    setVisibleReviewsCount((prev: number) => prev + 3);
  };

  // Get reviews data with enhanced rating calculation
  const reviewsData = useProductReviews(product?.reviews || [], {
    globalAverage: 4.0, // Lower baseline for more realistic ratings
    minReviews: 10, // Fewer reviews needed for Bayesian adjustment
    verifiedWeight: 1.2, // Give more weight to verified purchases
    unverifiedWeight: 0.6, // Reduce weight of unverified reviews
    halfLifeDays: 90, // Reviews decay faster (90 days instead of 180)
    minCommentLength: 3, // Include shorter comments
  });

  // Get similar products
  const { similarProducts, hasSimilarProducts } = useSimilarProducts(
    product || null,
    flashSaleProducts,
    {
      maxProducts: 6,
      sameCategory: true,
      priceRange: 40, // 40% price variance
      excludeCurrent: true,
    },
  );

  const handleAddToCart = () => {
    if (!isOutOfStock && product) {
      addToCart(product, quantity);
    }
  };

  if (!product) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        data-testid="product-not-found"
      >
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900" data-testid="not-found-title">
            Product Not Found
          </h1>
          <Button
            onClick={() => {
              // Navigate back and then scroll to top
              if (window.history.length > 1) {
                router.back();
                // Use setTimeout to ensure navigation completes before scrolling
                setTimeout(() => {
                  window.scrollTo(0, 0);
                }, 100);
              } else {
                // If no history, go to home page
                router.push('/');
                window.scrollTo(0, 0);
              }
            }}
            data-testid="go-back-button"
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="product-page">
      {/* Header */}
      <header className="bg-white shadow-none" data-testid="product-header">
        <div className="mx-auto max-w-7xl px-0 sm:px-0 lg:px-0">
          <div className="flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                // Navigate back and then scroll to top
                if (window.history.length > 1) {
                  router.back();
                  // Use setTimeout to ensure navigation completes before scrolling
                  setTimeout(() => {
                    window.scrollTo(0, 0);
                  }, 100);
                } else {
                  // If no history, go to home page
                  router.push('/');
                  window.scrollTo(0, 0);
                }
              }}
              className="flex items-center gap-2"
              data-testid="back-button"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-lg font-semibold text-gray-900" data-testid="product-page-title">
              Product Details
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Product Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4" data-testid="product-images">
            <div
              className="relative aspect-square overflow-hidden rounded-lg bg-white"
              data-testid="main-product-image"
            >
              <Image
                src={images[selectedImage] || ''}
                alt={product?.title || 'Product image'}
                fill
                className="object-cover"
                priority
              />
              {product.type && product.type !== 'regular' && (
                <div className="absolute top-4 right-4" data-testid="product-type-badge">
                  <Badge
                    className={`${
                      product.type === 'flash'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    }`}
                  >
                    {product.type === 'flash' ? 'Sale' : product.type}
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto" data-testid="thumbnail-gallery">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    data-testid={`thumbnail-${index}`}
                  >
                    <Image
                      src={image || ''}
                      alt={`${product?.title || 'Product'} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6" data-testid="product-info">
            {/* Title and Price */}
            <div data-testid="product-title-section">
              <h1 className="mb-2 text-3xl font-bold text-gray-900" data-testid="product-title">
                {product.title}
              </h1>

              <div className="mb-4 flex items-center gap-4" data-testid="price-section">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900" data-testid="product-price">
                    {formatCurrency(displayPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span
                        className="text-lg text-gray-400 line-through"
                        data-testid="original-price"
                      >
                        {formatCurrency(Number(product.originalPrice))}
                      </span>
                      <Badge className="bg-red-600 text-white" data-testid="discount-badge">
                        -{product.discountPercent}%
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2" data-testid="rating-section">
                <StarRating
                  rating={reviewsData && reviewsData.count > 0 ? reviewsData.rating : 0}
                  size={20}
                />
                <span className="text-sm text-gray-600" data-testid="rating-text">
                  {reviewsData && reviewsData.count > 0
                    ? `(${reviewsData.count} reviews)`
                    : '(0 reviewss)'}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mt-2" data-testid="stock-section">
                {isOutOfStock ? (
                  <Badge variant="destructive" data-testid="out-of-stock-badge">
                    Out of Stock
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                    data-testid="in-stock-badge"
                  >
                    In Stock ({product.stock} available)
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div data-testid="description-section">
                <h2
                  className="mb-2 text-lg font-semibold text-gray-900"
                  data-testid="description-title"
                >
                  Description
                </h2>
                <p className="leading-relaxed text-gray-600" data-testid="product-description">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div data-testid="size-selector">
                <h2 className="mb-2 text-lg font-semibold text-gray-900" data-testid="size-title">
                  Size
                </h2>
                <div className="flex flex-wrap gap-2" data-testid="size-options">
                  {product.sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(size)}
                      className={`${
                        selectedSize === size
                          ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900'
                      }`}
                      data-testid={`size-${size}`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div data-testid="quantity-selector">
              <h2 className="mb-2 text-lg font-semibold text-gray-900" data-testid="quantity-title">
                Quantity
              </h2>
              <div className="flex items-center gap-3" data-testid="quantity-controls">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || !!isOutOfStock}
                  data-testid="quantity-decrease"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium" data-testid="quantity-value">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={!!isOutOfStock}
                  data-testid="quantity-increase"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart - Desktop Only */}
            <div className="hidden space-y-4 md:block" data-testid="add-to-cart-section">
              <div
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                data-testid="total-price-section"
              >
                <span className="text-lg font-semibold" data-testid="total-label">
                  Total:
                </span>
                <span className="text-2xl font-bold text-gray-900" data-testid="total-price">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={!!isOutOfStock}
                onClick={() => {
                  // TODO: Add to cart functionality
                  console.log('Added to cart:', {
                    product: product.title,
                    quantity,
                    size: selectedSize,
                    price: displayPrice,
                    total: totalPrice,
                  });
                }}
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>

            {/* Features */}
            <div
              className="grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-3"
              data-testid="product-features"
            >
              <div
                className="flex items-center gap-3 text-sm text-gray-600"
                data-testid="free-shipping-feature"
              >
                <Truck className="h-5 w-5 text-gray-400" />
                <span>Free Shipping</span>
              </div>
              <div
                className="flex items-center gap-3 text-sm text-gray-600"
                data-testid="secure-payment-feature"
              >
                <Shield className="h-5 w-5 text-gray-400" />
                <span>Secure Payment</span>
              </div>
              <div
                className="flex items-center gap-3 text-sm text-gray-600"
                data-testid="returns-feature"
              >
                <RefreshCw className="h-5 w-5 text-gray-400" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reviews Section */}
      {reviewsData && reviewsData.count > 0 && (
        <section
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
          data-testid="reviews-section"
        >
          <h5 className="mb-6 text-xl font-semibold text-gray-900">Reviews and Ratings</h5>
          <div className="border-t pt-8">
            {/* Rating Summary */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div
                className="flex flex-col items-center justify-center space-y-3"
                data-testid="rating-summary"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
                    {reviewsData.rating}
                  </span>
                  <div className="flex">
                    <div className="block sm:hidden">
                      <StarRating rating={reviewsData.rating} size={20} />
                    </div>
                    <div className="hidden sm:block md:hidden">
                      <StarRating rating={reviewsData.rating} size={24} />
                    </div>
                    <div className="hidden md:block">
                      <StarRating rating={reviewsData.rating} size={28} />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 sm:text-base">
                  Based on {reviewsData.count} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2" data-testid="rating-distribution">
                {[5, 4, 3, 2, 1].map(ratingValue => (
                  <div key={ratingValue} className="flex items-center gap-2">
                    <span className="w-3 text-sm text-gray-600">{ratingValue}</span>
                    <span className="text-sm text-gray-600">⭐</span>
                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-yellow-400"
                        style={{
                          width: `${
                            reviewsData.count > 0
                              ? (reviewsData.distribution[
                                  ratingValue as keyof typeof reviewsData.distribution
                                ] /
                                  reviewsData.count) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm text-gray-600">
                      {
                        reviewsData.distribution[
                          ratingValue as keyof typeof reviewsData.distribution
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6" data-testid="reviews-list">
              {reviewsData.latestComments.slice(0, visibleReviewsCount).map(review => (
                <div
                  key={review.id}
                  className="border-b pb-6 last:border-b-0"
                  data-testid={`review-${review.id}`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {review.customerName || 'Anonymous Customer'}
                        </div>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size={16} />
                          {review.isVerified && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-xs text-green-800"
                              data-testid="verified-badge"
                            >
                              <ThumbsUp className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {review.comment && (
                    <p
                      className="leading-relaxed text-gray-700"
                      data-testid={`review-comment-${review.id}`}
                    >
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {reviewsData.latestComments.length > visibleReviewsCount && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  data-testid="load-more-reviews"
                  onClick={handleLoadMoreReviews}
                >
                  Load More Reviews (
                  {Math.min(3, reviewsData.latestComments.length - visibleReviewsCount)} more)
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Similar Products Section */}
      {hasSimilarProducts && (
        <section
          className="mx-auto max-w-7xl px-0 py-8 sm:px-6 lg:px-8"
          data-testid="similar-products-section"
        >
          <div className="border-t pt-8">
            <FlashSale
              title="Similar Products"
              showCountdown={false}
              showArrows={true}
              showType={true}
              productsData={similarProducts}
              limit={false}
              hideCategories={true}
            />
          </div>
        </section>
      )}

      {/* Floating Add to Cart - Mobile Only */}
      <div
        className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white shadow-lg md:hidden"
        data-testid="floating-add-to-cart"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500" data-testid="floating-price-label">
              Total
            </div>
            <div className="text-lg font-bold text-gray-900" data-testid="floating-price">
              {formatCurrency(totalPrice)}
            </div>
          </div>
          <Button
            size="lg"
            className="max-w-xs flex-1"
            disabled={!!isOutOfStock}
            onClick={handleAddToCart}
            data-testid="floating-add-to-cart-button"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
