'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function AdPlaceholder() {
  return (
    <div className="h-full flex-1 border-l border-gray-200 px-4 py-5" data-testid="ad-section">
      <div
        className="bg-muted relative w-full overflow-hidden rounded-none"
        data-testid="ad-placeholder"
        style={{ height: 'calc(100% - 2.5rem)', minHeight: '400px' }}
      >
        <Image
          src="https://www.pricekeeda.com/uploads/posts/2025/iPhone-17-Pro-2.webp"
          alt="Advertisement"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 80vw"
          onError={e => {
            console.error('Image failed to load:', e);
          }}
        />
        <div className="absolute inset-0 flex items-end justify-start p-6">
          <Button
            variant="default"
            className="bg-primary hover:bg-primary/90 px-4 py-2 text-lg font-semibold text-white"
            data-testid="shop-now-button"
          >
            Shop now →
          </Button>
        </div>
      </div>
    </div>
  );
}
