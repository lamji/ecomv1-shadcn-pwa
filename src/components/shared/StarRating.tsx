import React from 'react';
import { Star } from 'lucide-react';

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
};

export function StarRating({ rating, maxRating = 5, size = 16, className = '' }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`} data-testid="star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className="fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative" style={{ width: size, height: size }}>
          <Star size={size} className="absolute text-gray-300" />
          <div className="absolute overflow-hidden" style={{ width: '50%', height: size }}>
            <Star size={size} className="fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-300" fill="#e5e7eb" />
      ))}
      <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}</span>
    </div>
  );
}
