'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';

interface AppHeaderProps {
  title?: string;
}

export const AppHeader = ({ title = 'E-HotShop' }: AppHeaderProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0); // Example cart count
  const [notificationCount, setNotificationCount] = useState(0); // Example notification count
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, isLoading } = useAuth();

  // Keep a global CSS var with the current header height for sticky layouts
  useEffect(() => {
    const applyHeaderHeightVar = () => {
      const h = headerRef.current?.offsetHeight ?? 80;
      document.documentElement.style.setProperty('--app-header-h', `${h}px`);
    };
    applyHeaderHeightVar();
    window.addEventListener('resize', applyHeaderHeightVar);
    return () => window.removeEventListener('resize', applyHeaderHeightVar);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Card
      ref={headerRef}
      className="sticky top-0 z-50 w-full rounded-none border-x-0 border-t-0 border-b-0 py-4 shadow-none"
      data-testid="app-header"
    >
      <div className="w-full">
        <div className="flex items-center justify-between">
          {/* Left Section - Title/Logo */}
          <div className="flex items-center gap-1" data-testid="header-title">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="-ml-2.5 flex items-center gap-2 p-1 lg:ml-0"
              data-testid="header-logo-button"
            >
              <div className="relative h-8 w-8 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="E-HotShop Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                  onError={e => {
                    console.error('Logo failed to load:', e);
                  }}
                  onLoadingComplete={() => {
                    console.log('Logo loaded successfully');
                  }}
                />
              </div>
              <h1 className="text-foreground hidden text-2xl font-bold lg:block">{title}</h1>
            </Button>
          </div>

          {/* Right Section - Search, Cart, Profile */}
          <div className="flex items-center gap-0.5 md:gap-2" data-testid="header-actions">
            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="relative flex-1 lg:hidden"
              data-testid="mobile-search-form-header"
            >
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 bg-gray-100 pr-9 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-gray-600 dark:bg-gray-800"
                data-testid="mobile-search-input-header"
              />
              <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
            </form>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="relative hidden lg:block"
              data-testid="search-form"
            >
              <Input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-60 border border-gray-300 bg-gray-100 pr-9 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-gray-600 dark:bg-gray-800"
                data-testid="search-input"
              />
              <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
            </form>

            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/cart')}
                className="relative cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1.5 -right-1.5 flex h-3 w-3 items-center justify-center p-0 text-[8px] md:h-5 md:w-5 md:text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            )}

            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/notifications')}
                className="relative cursor-pointer"
                data-testid="notification-button"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1.5 -right-1.5 flex h-3 w-3 items-center justify-center p-0 text-[8px] md:h-5 md:w-5 md:text-xs"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            )}

            {!isLoading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(isAuthenticated ? '/profile' : '/login')}
                className="cursor-pointer"
                data-testid={isAuthenticated ? 'profile-button' : 'login-button'}
              >
                {isAuthenticated ? (
                  <User className="h-5 w-5" />
                ) : (
                  <span className="text-xs font-medium sm:text-sm">Login</span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
