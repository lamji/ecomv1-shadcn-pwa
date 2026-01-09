'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';

interface AppHeaderProps {
  title?: string;
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Login', path: '/login' },
];

export const AppHeader = ({ title = 'E-HotShop' }: AppHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(3); // Example cart count
  const headerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

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
          {/* Left Section - Menu Button (Mobile) & Title/Logo */}
          <div className="flex items-center gap-1" data-testid="header-title">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer gap-0 lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              data-testid="mobile-menu-button"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

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

          {/* Middle Section - Navigation Links */}
          <nav className="hidden items-center space-x-6 lg:flex" data-testid="desktop-nav">
            {navLinks.map(link => (
              <Button
                key={link.path}
                variant="ghost"
                className={`text-muted-foreground hover:text-foreground cursor-pointer rounded-none px-0 py-0 ${
                  pathname === link.path ? 'border-foreground text-foreground border-b-2' : ''
                }`}
                onClick={() => router.push(link.path)}
                data-testid={`nav-${link.name.toLowerCase()}`}
              >
                {link.name}
              </Button>
            ))}
          </nav>

          {/* Right Section - Search, Cart, Profile */}
          <div className="flex items-center gap-2" data-testid="header-actions">
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
                className="w-full border-0 bg-gray-100 pr-9 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-800"
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
                className="w-60 border-0 bg-gray-100 pr-9 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-800"
                data-testid="search-input"
              />
              <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
            </form>

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
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <Card
            ref={menuRef}
            className="absolute top-full right-0 left-0 z-50 mt-0 p-4 lg:hidden"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col space-y-2" data-testid="mobile-nav">
              {navLinks.map(link => (
                <Button
                  key={link.path}
                  variant="ghost"
                  className={`w-full justify-start rounded-none px-0 py-0 ${
                    pathname === link.path ? 'border-foreground text-foreground border-b-2' : ''
                  }`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push(link.path);
                  }}
                  data-testid={`mobile-nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none px-0 py-0"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/profile');
                }}
                data-testid="mobile-nav-profile"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};
