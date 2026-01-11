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
import { useSearchHooks } from '@/lib/hooks/useSearchHooks';
import { useAppSelector } from '@/lib/store';

interface AppHeaderProps {
  title?: string;
}

export const AppHeader = ({ title = 'E-HotShop' }: AppHeaderProps) => {
  const router = useRouter();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, isLoading } = useAuth();
  const notifications = useAppSelector(state => state.notifications.items);

  // Calculate unread count directly from Redux store for real-time updates
  const unreadCount = notifications.filter(n => !n.read).length;

  // Use search hooks for search functionality
  const { searchQuery, setSearchQuery, handleSearch, getSearchSuggestions } = useSearchHooks();

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

  // Wrapper functions for form submissions
  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleDesktopSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
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
            <div className="relative flex-1 lg:hidden">
              <form
                onSubmit={handleMobileSearch}
                className="relative"
                data-testid="mobile-search-form-header"
              >
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full border border-gray-300 pr-9 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-gray-600 dark:bg-white"
                  data-testid="mobile-search-input-header"
                />
                <Search
                  className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
                  data-testid="mobile-search-icon"
                />
              </form>

              {/* Mobile Search Suggestions Dropdown */}
              {showSuggestions && searchQuery.length >= 2 && (
                <div
                  className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border bg-white shadow-lg"
                  data-testid="mobile-search-suggestions"
                >
                  {getSearchSuggestions(searchQuery).length > 0 ? (
                    <div className="p-2">
                      {getSearchSuggestions(searchQuery).map(product => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setSearchQuery(product.title);
                            setShowSuggestions(false);
                            handleSearch(product.title);
                          }}
                          className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
                          data-testid={`mobile-suggestion-${product.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                              <Image
                                src={product.imageSrc}
                                alt={product.imageAlt || product.title}
                                width={32}
                                height={32}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="truncate">{product.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="p-3 text-center text-sm text-gray-500"
                      data-testid="mobile-no-suggestions"
                    >
                      No suggestions found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Search */}
            <div className="relative hidden lg:block">
              <form onSubmit={handleDesktopSearch} className="relative" data-testid="search-form">
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-60 border border-gray-900 pr-9 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-gray-900 bg-white"
                  data-testid="search-input"
                />
                <Search
                  className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
                  data-testid="desktop-search-icon"
                />
              </form>

              {/* Desktop Search Suggestions Dropdown */}
              {showSuggestions && searchQuery.length >= 2 && (
                <div
                  className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-md border bg-white shadow-lg"
                  data-testid="desktop-search-suggestions"
                >
                  {getSearchSuggestions(searchQuery).length > 0 ? (
                    <div className="p-2">
                      {getSearchSuggestions(searchQuery).map(product => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setSearchQuery(product.title);
                            setShowSuggestions(false);
                            handleSearch(product.title);
                          }}
                          className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
                          data-testid={`desktop-suggestion-${product.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                              <Image
                                src={product.imageSrc}
                                alt={product.imageAlt || product.title}
                                width={32}
                                height={32}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="truncate">{product.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="p-3 text-center text-sm text-gray-500"
                      data-testid="desktop-no-suggestions"
                    >
                      No suggestions found
                    </div>
                  )}
                </div>
              )}
            </div>

            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/cart')}
                className="relative cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5" />
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
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1.5 -right-1.5 flex h-3 w-3 items-center justify-center p-0 text-[8px] md:h-5 md:w-5 md:text-xs"
                  >
                    {unreadCount}
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
