import { NextRequest, NextResponse } from 'next/server';

console.log('🔥 MIDDLEWARE FILE LOADED - This should appear on server start');

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
  '/api/onesignal/check-subscription',
  '/api/onesignal/send-test',
  '/api/orders/update-status',
  ''
];

/**
 * Check if the request is for a public route
 */
function isPublicRoute(pathname: string, request: NextRequest): boolean {
 console.log(` Middleware: new pass1`);
  if (PUBLIC_ROUTES.includes(pathname)) return true;
 console.log(` Middleware: new pass2 ${pathname}`);
  
  // Dynamic check for /new-password with valid resetTempToken - mobile/tablet only
  if (pathname === '/new-password') {
      console.log(` Middleware: new pass`);
    // Check device type first - includes mobile, tablet, and WebView
    const userAgent = request.headers.get('user-agent') || '';
    const isMobileOrTablet = /Mobile|Android|iPhone|iPad|Tablet/i.test(userAgent);
    const isWebView = /wv|WebView/i.test(userAgent);

    console.log(` Middleware: /new-password access - Mobile/Tablet: ${isMobileOrTablet}, WebView: ${isWebView}`);
    
    // Allow mobile, tablet, and WebView devices
    if (!isMobileOrTablet && !isWebView) {
      console.log(` Middleware: /new-password denied - not mobile/tablet device`);
      return false; // Deny access for desktop browsers only
    }
    
    // WebView apps get automatic access (no token required)
    if (isWebView) {
      console.log(`✅ Middleware: /new-password allowed - WebView detected (no token required)`);
      return true;
    }
    
    // For mobile/tablet browsers, check for valid token
    const { valid } = getResetTempToken(request);
    console.log(` Middleware: /new-password resetTempToken valid: ${valid}`);
    
    if (valid) {
      console.log(` Middleware: /new-password allowed - mobile/tablet + valid token`);
      return true;
    }
    
    console.log(` Middleware: /new-password denied - invalid or missing token`);
  }

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
    pathname.startsWith('/icons/') ||
    pathname === '/OneSignalSDKWorker.js'
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
 * Extract and validate reset temp token for password reset access
 */
function getResetTempToken(request: NextRequest): { valid: boolean; token: string | null } {
  // First try to get from cookie
  let cookieValue = request.cookies.get('resetTempToken')?.value ?? null;
  
  // If not found in cookie, try to get from localStorage via headers
  if (!cookieValue) {
    // Note: localStorage is not directly accessible in middleware
    // We'll need to pass it via headers from the client side
    const localStorageToken = request.headers.get('x-reset-temp-token');
    if (localStorageToken) {
      cookieValue = localStorageToken;
    }
  }
  
  if (!cookieValue) {
    return { valid: false, token: null };
  }
  
  // Parse token and timestamp from cookie
  // Format: token:timestamp
  const parts = cookieValue.split(':');
  if (parts.length !== 2) {
    return { valid: false, token: null };
  }
  
  const [token, timestampStr] = parts;
  const timestamp = parseInt(timestampStr);
  
  // Check if timestamp is valid and not expired (5 minutes = 300 seconds)
  const now = Date.now();
  const tokenAge = (now - timestamp) / 1000; // Convert to seconds
  
  if (isNaN(timestamp) || tokenAge > 300 || tokenAge < 0) {
    return { valid: false, token: null };
  }
  
  return { valid: true, token };
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
  if (isPublicRoute(pathname, request)) {
    return NextResponse.next();
  }

  /**
   * Special handling for /reset-password route
   * Allow access with valid resetTempToken, otherwise redirect to login
   */
  if (pathname === '/reset-password') {
    const { valid } = getResetTempToken(request);
    if (valid) {
      return NextResponse.next();
    }
    // If no valid resetTempToken, redirect to login
    return redirectToLogin(request);
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
  matcher: [
    '/((?!_next/static|_next/image|_next/data).*)'
  ],
};
