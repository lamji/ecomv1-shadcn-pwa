'use client';

import { useSocketConnection } from '@/lib/hooks/useSocketConnection';

/**
 * SocketGlobalListener
 * This component is placed in the main layout/providers to ensure
 * that the socket connection and global event listeners (like notifications)
 * are active throughout the entire application, regardless of the current page.
 */
export function SocketGlobalListener() {
  // Just calling the hook is enough to activate the useEffect inside it
  useSocketConnection();
  
  return null;
}
