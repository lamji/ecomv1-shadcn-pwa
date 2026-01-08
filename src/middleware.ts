import { NextRequest, NextResponse } from 'next/server';

/**
 * JWT Token Validation Utility
 * Validates JWT token structure and expiration without requiring secret verification
 * This is a basic client-side validation - server-side validation is still required
 */
function isValidJWT(token: string): boolean {
  try {
    // JWT should have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));

    // Check if token has expiration and if it's not expired
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        return false; // Token is expired
      }
    }

    return true;
  } catch {
    // If any error occurs during parsing, token is invalid
    return false;
  }
}

/**
 * Extract Authentication Token from Request
 * Checks multiple sources for the authentication token:
 * 1. Authorization header (Bearer token)
 * 2. Cookie (auth_token)
 * 3. Custom header (x-auth-token)
 */
function getAuthToken(request: NextRequest): string | null {
  // Check Authorization header first (most common)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check for token in cookies
  const cookieToken = request.cookies.get('auth_token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // Check custom auth header
  const customHeader = request.headers.get('x-auth-token');
  if (customHeader) {
    return customHeader;
  }

  return null;
}

/**
 * Check if Current Route is Public
 * Defines which routes don't require authentication
 * Add new public routes to this array as needed
 */
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/login',
    '/signup',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/',
  ];

  // Check for exact matches
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  // Check for pattern matches (e.g., /api/public/*)
  const publicPatterns = [
    '/api/public',
    '/_rsc',
    '/_next', // Next.js static files
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ];

  return publicPatterns.some(pattern => pathname.startsWith(pattern));
}

/**
 * Get Client IP Address (Middleware Safe)
 * Resolves the client IP from standard proxy headers and safely
 * falls back to request.ip when available. Avoids TS error for
 * environments where NextRequest.ip is not typed.
 */
function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff && xff.length > 0) {
    // Use the first IP in the list
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  const vercelFwd = request.headers.get('x-vercel-forwarded-for');
  if (vercelFwd && vercelFwd.length > 0) {
    const first = vercelFwd.split(',')[0]?.trim();
    if (first) return first;
  }

  // Some Next.js versions expose request.ip, but types may not include it
  const anyReq = request as unknown as { ip?: string };
  if (anyReq.ip) return anyReq.ip;

  return 'unknown';
}

/**
 * Add Security Headers to Response
 * Implements essential security headers to protect against common attacks:
 * - XSS Protection
 * - CSRF Protection
 * - Content Security Policy
 * - Frame Options
 * - Content Type Options
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent XSS attacks by enabling browser's built-in XSS filter
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Prevent MIME type sniffing attacks
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking attacks by controlling iframe embedding
  response.headers.set('X-Frame-Options', 'DENY');

  // Control referrer information sent to other sites
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Enforce HTTPS connections (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    );
  }

  // Content Security Policy - Adjust based on your app's needs
  // Build connect-src dynamically to allow API base URL and localhost during development
  const connectSrc: string[] = ["'self'"];

  // Allow explicit API base URL if provided
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    try {
      const apiUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL);
      connectSrc.push(`${apiUrl.protocol}//${apiUrl.host}`);
      // If using websockets on same host
      const wsScheme =
        apiUrl.protocol === 'https:' ? 'wss' : apiUrl.protocol === 'http:' ? 'ws' : '';
      if (wsScheme) connectSrc.push(`${wsScheme}://${apiUrl.host}`);
    } catch {
      // ignore malformed env URL
    }
  }

  // In development, allow localhost and 127.0.0.1 with any port (http and ws)
  if (process.env.NODE_ENV !== 'production') {
    connectSrc.push(
      'http://localhost:*',
      'http://127.0.0.1:*',
      'ws://localhost:*',
      'ws://127.0.0.1:*',
    );
  }

  // In production, allow connections to the site's own origin (https and wss)
  if (process.env.NODE_ENV === 'production') {
    const siteOrigin =
      process.env.NEXT_PUBLIC_SITE_ORIGIN ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://ecomv1-shadcn-pwa.vercel.app');
    if (siteOrigin) {
      try {
        const u = new URL(siteOrigin);
        connectSrc.push(`${u.protocol}//${u.host}`);
        // Always allow secure websocket to the same host
        connectSrc.push(`wss://${u.host}`);
      } catch {
        // ignore malformed site origin
      }
    }
  }

  // Use strict script policy in production, permissive in development
  const scriptSrc =
    process.env.NODE_ENV === 'production'
      ? "script-src 'self'"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

  const csp = [
    "default-src 'self'",
    scriptSrc, // Dev allows inline/eval; Prod only self
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(' ')}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Permissions Policy (formerly Feature Policy)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()',
  );

  return response;
}

/**
 * Handle Authentication Redirect
 * Redirects unauthenticated users to login page while preserving
 * the intended destination for post-login redirect
 */
function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.url);

  // Preserve the intended destination for redirect after login
  if (request.nextUrl.pathname !== '/login') {
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  }

  const response = NextResponse.redirect(loginUrl);
  return addSecurityHeaders(response);
}

/**
 * Handle Rate Limiting (Basic Implementation)
 * Implements basic rate limiting to prevent abuse
 * For production, consider using Redis or external rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(request: NextRequest): boolean {
  const ip = getClientIp(request);
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max requests per window

  const clientData = rateLimitMap.get(ip);

  if (!clientData) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Reset count if window has passed
  if (now - clientData.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Increment count
  clientData.count++;

  // Check if limit exceeded
  return clientData.count <= maxRequests;
}

/**
 * Main Middleware Function
 * Orchestrates all security checks and route protection
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accept = request.headers.get('accept') || '';
  const isRSCFlight =
    accept.includes('text/x-component') ||
    accept.includes('application/x-component') ||
    accept.includes('multipart/mixed');
  const isNextPrefetch = request.headers.get('next-router-prefetch') === '1';

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Skip middleware for RSC streaming endpoints
  if (pathname.startsWith('/_rsc') || isRSCFlight || isNextPrefetch) {
    return NextResponse.next();
  }

  // Apply rate limiting to all requests
  if (!checkRateLimit(request)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
      },
    });
  }

  // Allow access to public routes without authentication
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Extract and validate authentication token
  const token = getAuthToken(request);

  if (!token) {
    // No token found - redirect to login
    return redirectToLogin(request);
  }

  if (!isValidJWT(token)) {
    // Invalid or expired token - redirect to login
    return redirectToLogin(request);
  }

  // Token is valid - allow access to protected route
  const response = NextResponse.next();

  // Add user context to headers for downstream consumption
  response.headers.set('x-user-authenticated', 'true');

  return addSecurityHeaders(response);
}

/**
 * Middleware Configuration
 * Defines which routes the middleware should run on
 * Excludes static files and API routes that don't need protection
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|_rsc|favicon.ico|public/).*)',
  ],
};
