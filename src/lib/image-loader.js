'use client';

export default function imageLoader({ src, width, quality }) {
  return `http://localhost:3000${src}?w=${width}&q=${quality || 75}`;
}
