/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { addNotification } from '../features/notificationSlice';
import { NotificationItem } from '../data/notifications';

// Type definitions for OneSignal events

interface OneSignalInstance {
  push: (command: any[]) => void;
  login: (externalId: string) => Promise<void>;
  logout: () => Promise<void>;
}

declare global {
  interface Window {
    OneSignal?: OneSignalInstance;
  }
}

// Type definition for OneSignal message from API
interface OneSignalMessage {
  id: string;
  contents: { [lang: string]: string };
  headings?: { [lang: string]: string };
  completed_at: number;
  successful: number;
  failed: number;
  converted: number;
  remaining: number;
  data?: Record<string, unknown>;
}

/**
 * Initialize OneSignal SDK and handle notifications
 */
export const useNotifications = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const response = await fetch('/api/onesignal/messages?limit=20');
        const data = await response.json();

        if (response.ok && data.notifications) {
          data.notifications.forEach((msg: OneSignalMessage) => {
            const newNotif: NotificationItem = {
              id: msg.id,
              type: (msg.data?.type as NotificationItem['type']) || 'promotion',
              title: msg.headings?.en || 'New Notification',
              message: msg.contents?.en || 'You have a new notification',
              status: (msg.data?.status as NotificationItem['status']) || 'info',
              read: false,
              date: new Date(msg.completed_at * 1000).toISOString(),
              orderId: msg.data?.orderId as string,
              amount:
                typeof msg.data?.amount === 'string'
                  ? parseFloat(msg.data.amount)
                  : (msg.data?.amount as number),
            };
            dispatch(addNotification(newNotif));
          });
        }
      } catch (error) {
        console.error('Failed to fetch recent OneSignal messages:', error);
      }
    };

    // const initOneSignal = async () => {
    //   try {
    //     // Check if OneSignal is already initialized
    //     if (window.OneSignal && !Array.isArray(window.OneSignal)) {
    //       console.log('OneSignal already initialized, skipping...');
    //       return;
    //     }

    //     // Initialize OneSignal as array if not defined or not an array
    //     if (!window.OneSignal || !Array.isArray(window.OneSignal)) {
    //       window.OneSignal = window.OneSignal || [];
    //       console.log('OneSignal initialized as array');
    //     }

    //     // Load OneSignal SDK from CDN if not already loaded
    //     if (!document.querySelector('script[src*="OneSignalSDK.js"]')) {
    //       const script = document.createElement('script');
    //       script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
    //       script.async = true;
    //       script.setAttribute('data-cfasync', 'false');
    //       document.head.appendChild(script);

    //       // Wait for script to load
    //       await new Promise(resolve => {
    //         script.onload = resolve;
    //       });
    //     }

    //     // Initialize OneSignal with minimal config to avoid CSP issues
    //     window.OneSignal.push([
    //       'init',
    //       {
    //         appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
    //         notifyButton: {
    //           enable: false, // Disable default notify button
    //         },
    //         allowLocalhostAsSecureOrigin: true, // For development
    //         // Disable features that might cause CSP issues
    //         webhooks: {
    //           'notification.displayed': '',
    //           'notification.clicked': '',
    //         },
    //       },
    //     ]);

    //     // Set up event listeners
    //     window.OneSignal.push([
    //       'addListenerForNotificationOpened',
    //       (event: OneSignalNotificationEvent) => {
    //         console.log('Notification clicked:', event);
    //       },
    //     ]);

    //     // Request notification permission only if not already granted
    //     window.OneSignal.push([
    //       'registerForPushNotifications',
    //       {
    //         modalPrompt: false, // Disable modal prompt to avoid CSP issues
    //         autoPrompt: false,
    //       },
    //     ]);

    //     console.log('OneSignal initialized successfully');
    //   } catch (error) {
    //     console.error('OneSignal initialization error:', error);
    //   }
    // };

    const initOneSignal = async () => {
      try {
        if (!document.querySelector('script[src*="OneSignalSDK.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
          script.defer = true;
          document.head.appendChild(script);

          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        const OneSignal = (window as any).OneSignal || [];
        if (Array.isArray(OneSignal)) {
          (window as any).OneSignal = {
            push: (item: any) => OneSignal.push(item)
          };
        }

        window.OneSignal?.push(['init', {
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
          allowLocalhostAsSecureOrigin: true,
        }]);

      } catch (error) {
        console.error('OneSignal initialization error:', error);
      }
    };

    initOneSignal();
    fetchRecentMessages();

    return () => {
      // No cleanup needed for OneSignal only
    };
  }, [dispatch]);

  return {};
};
