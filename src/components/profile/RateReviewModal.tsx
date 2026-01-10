'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/helper/currency';
import { Product } from '@/lib/data/products';

interface RateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (rating: number, feedback: string) => void;
}

export default function RateReviewModal({
  isOpen,
  onClose,
  product,
  onSubmit,
}: RateReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && product) {
      onSubmit(rating, feedback);
      onClose();
      // Reset form
      setRating(0);
      setFeedback('');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setRating(0);
    setFeedback('');
  };

  if (!isOpen || !product) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">Rate & Review</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Product Info */}
        <div className="border-b p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
              <Image
                src={product.imageSrc}
                alt={product.imageAlt || product.title}
                fill
                className="object-cover"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzIgMkM0My4yIDIgNDQgMCA1MCAySDU0QzYwIDAgNjIgNy44IDYyIDE2VjQ4QzYyIDU2LjIgNTQuNCA2NCA1MiA2NEgzMkMzNS44IDY0IDM0IDU2LjIgMzggNDhWMTZDMzggNy44IDM1LjIgMiAzMiAyWk0OCAzMkM0My4yIDMyIDQ0IDM0LjIgNDYgMzZINTRDMNiAyIDY4IDMxLjggNjggMzhWNDhDNjggNTYuMiA2NiA1NCA2OCA1MlYzNkM2OCAzNS44IDY2LjIgMzIgNjggMzJaTTQ4IDQ4QzQ4IDUwLjIgNDYuMiA1MiA0NCA1Mkg0MEMzNy44IDUyIDM2IDUwLjIgMzYgNDhWNDhDMzYgNDUuOCAzNy44IDQ4IDQ4IDQ4WiIgZmlsbD0iIzlDQTNBRiIvPjwvc3ZnPg==';
                }}
                sizes="64px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium text-gray-900">{product.title}</h3>
              <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
              {product.category && (
                <Badge variant="secondary" className="mt-1">
                  {product.category}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Star Rating */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Your Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-colors"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-current text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 ? `${rating}.0` : 'Select a rating'}
              </span>
            </div>
          </div>

          {/* Feedback Text */}
          <div className="mb-6">
            <label htmlFor="feedback" className="mb-2 block text-sm font-medium text-gray-700">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Share your experience with this product..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500">{feedback.length}/500 characters</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Button type="submit" disabled={rating === 0} className="flex-1">
              Submit Review
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
