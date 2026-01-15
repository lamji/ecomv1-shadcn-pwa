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
