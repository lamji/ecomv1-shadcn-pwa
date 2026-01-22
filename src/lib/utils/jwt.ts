/**
 * JWT Utility Functions
 * For decoding JWT tokens and extracting user information
 */

export interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Decode JWT token without verification (client-side)
 * @param token JWT token string
 * @returns Decoded payload or null
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    // Remove Bearer prefix if present
    const cleanToken = token.replace('Bearer ', '');
    
    // Split token and decode payload
    const parts = cleanToken.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Get current user ID from stored token
 * @returns User ID string or null
 */
export function getCurrentUserId(): string | null {
  try {
    // Get token from localStorage or cookie
    const token = 
      localStorage.getItem('auth_token') ||
      document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('auth_token='))
        ?.split('=')[1];

    if (!token) return null;

    const decoded = decodeJwt(token);
    return decoded?.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
}

/**
 * Check if token is expired
 * @param token JWT token string
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJwt(token);
    if (!decoded) return true;
    
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}
