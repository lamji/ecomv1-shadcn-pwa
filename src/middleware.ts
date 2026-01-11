import { NextRequest, NextResponse } from 'next/server';

/**
 * Public routes that do NOT require authentication
 */
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/signup',
  '/otp',
  '/forgot-password',
  '/new-arrivals',
  '/summer-collection',
  '/view-all',
  '/search',
  '/pos'
];

/**
 * Public API routes
 */
const PUBLIC_API_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/notifications',
  '/api/onesignal',
  '/api/onesignal/messages',
  '/api/orders/update-status',
];

/**
 * Check if the request is for a public route
 */
function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;

  // Handle dynamic product routes
  if (pathname.startsWith('/product/')) return true;

  // Handle dynamic category routes
  if (pathname.startsWith('/category/')) return true;

  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return true;
  }

  // Allow Next.js internals & static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_rsc') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.startsWith('/logo.') ||
    pathname.startsWith('/icons/')
  ) {
    return true;
  }

  return false;
}

/**
 * Extract auth token safely (Edge-compatible)
 */
function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return request.cookies.get('auth_token')?.value ?? null;
}

/**
 * Redirect to login preserving intended destination
 */
function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

/**
 * MAIN MIDDLEWARE
 * 🔥 AUTH ONLY — NO HEADERS, NO RATE LIMITING, NO JWT DECODING
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * Skip middleware for:
   * - public routes
   * - Next.js internals
   */
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  /**
   * Avoid breaking RSC / streaming requests
   */
  const accept = request.headers.get('accept') ?? '';
  if (
    accept.includes('text/x-component') ||
    accept.includes('multipart/mixed') ||
    request.headers.get('next-router-prefetch') === '1'
  ) {
    return NextResponse.next();
  }

  /**
   * Auth check (presence only)
   * Full JWT verification MUST be server-side (API / server actions)
   */
  const token = getAuthToken(request);

  if (!token) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

/**
 * Middleware matcher
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
