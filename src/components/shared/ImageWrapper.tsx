// AppHeader.tsx
'use client'; // MUST for client-side features

import Image from 'next/image';

export default function ImageWrapper() {
  return (
    <header className="flex items-center bg-white p-4 shadow">
      <Image
        src="/logo.png" // must be inside /public
        alt="Logo"
        width={120}
        height={40}
        className="object-contain"
        onError={e => console.error('Logo failed to load:', e)}
      />
    </header>
  );
}
