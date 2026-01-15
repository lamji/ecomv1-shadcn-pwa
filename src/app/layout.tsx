import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
// import SocketInitializer from '@/components/SocketInitializer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Prevents render-blocking
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap', // Prevents render-blocking
  preload: false, // Don't preload secondary font
});

export const metadata: Metadata = {
  title: 'E-hotShop',
  description:
    'Shop the latest products with our modern ecommerce store. Fast delivery, secure payments, and great prices.',
  manifest: '/icons/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'E-hotShop',
  },
  applicationName: 'E-hotShop',
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#ffffff' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect hints for external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Critical resources */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Open Graph Meta Tags for Social Sharing */}
        <meta property="og:title" content="ScaleWeb - Premier Web and Mobile Design Services" />
        <meta
          property="og:description"
          content="Transform your online presence with stunning, high-performance websites and mobile apps. Professional web design, development, and digital solutions for businesses of all sizes."
        />
        <meta property="og:image" content="https://i-solar.vercel.app/hero/preview.png" />
        <meta property="og:url" content="https://i-solar.vercel.app/" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://i-solar.vercel.app/hero/preview.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <SocketInitializer /> */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
