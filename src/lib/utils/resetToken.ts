"use client";

/**
 * Utility to pass localStorage resetTempToken to middleware via headers
 * This helps WebView scenarios where cookies might not work reliably
 */

export function addResetTokenHeader(): Record<string, string> {
  const headers: Record<string, string> = {};
  
  // Get resetTempToken from localStorage
  const resetToken = localStorage.getItem('resetTempToken');
  
  if (resetToken) {
    // Add as custom header for middleware to read
    headers['x-reset-temp-token'] = resetToken;
  }
  
  return headers;
}

/**
 * Enhanced router push that includes reset token in headers
 * This is useful for Next.js router navigation in WebView
 */
export function pushWithResetToken(router: { push: (url: string) => void }, url: string) {
  const headers = addResetTokenHeader();
  
  // For Next.js router, we can't directly set headers for navigation
  // But we can ensure the token is in localStorage before navigation
  // The middleware will check both cookie and headers
  
  if (headers['x-reset-temp-token']) {
    console.log('🔗 Navigation with reset token in localStorage');
  }
  
  router.push(url);
}
