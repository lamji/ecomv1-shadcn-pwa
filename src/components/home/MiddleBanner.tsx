'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type MiddleBannerProps = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  backgroundImage?: string;
  className?: string;
};

export default function MiddleBanner({
  title = 'SUMMER COLLECTION',
  subtitle = 'Discover our latest summer essentials with up to 50% off',
  buttonText = 'SHOP NOW',
  backgroundImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
  className,
}: MiddleBannerProps) {
  const router = useRouter();

  const handleShopNow = () => {
    router.push('/summer-collection');
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      {/* Background Image with Overlay */}
      <div className="relative h-[250px] w-full sm:h-[300px] md:h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center px-4 sm:px-6 md:px-12">
          <div className="w-full max-w-lg">
            <h2 className="mb-2 text-xl leading-tight font-bold text-white sm:mb-3 sm:text-2xl md:text-4xl">
              {title}
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-white/90 sm:mb-6 sm:text-base md:text-lg">
              {subtitle}
            </p>
            <Button
              size="lg"
              className="w-full bg-white font-semibold text-black hover:bg-gray-100 sm:w-auto"
              onClick={handleShopNow}
            >
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
