import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { addNotification } from '../features/notificationSlice';
import { NotificationItem } from '../data/notifications';
import { io } from 'socket.io-client';

// OneSignal will be loaded from CDN
declare global {
  interface Window {
    OneSignal:
      | unknown[]
      | {
          push: (
            command: (
              | string
              | ((event: OneSignalNotificationEvent) => void)
              | Record<string, unknown>
            )[],
          ) => void;
        };
  }
}

// Type definitions for OneSignal events
interface OneSignalNotificationEvent {
  notification: {
    id?: string;
    title?: string;
    body?: string;
    data?: {
      orderId?: string;
      amount?: number;
    };
  };
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
        // Initialize OneSignal as array if not defined or not an array
        if (!window.OneSignal || !Array.isArray(window.OneSignal)) {
          window.OneSignal = window.OneSignal || [];
          console.log('OneSignal initialized as array');
        }

        // Load OneSignal SDK from CDN if not already loaded
        if (!document.querySelector('script[src*="OneSignalSDK.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
          script.async = true;
          document.head.appendChild(script);

          // Wait for script to load
          await new Promise(resolve => {
            script.onload = resolve;
          });
        }

        // Initialize OneSignal
        window.OneSignal.push([
          'init',
          {
            appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
            notifyButton: {
              enable: false, // Disable default notify button
            },
            allowLocalhostAsSecureOrigin: true, // For development
          },
        ]);

        // Set up event listeners
        window.OneSignal.push([
          'addListenerForNotificationOpened',
          (event: OneSignalNotificationEvent) => {
            console.log('Notification clicked:', event);
          },
        ]);

        // Request notification permission
        window.OneSignal.push([
          'registerForPushNotifications',
          {
            modalPrompt: true,
          },
        ]);
      } catch (error) {
        console.error('OneSignal initialization error:', error);
      }
    };

    const setupSocket = () => {
      const socketUrl = typeof window !== 'undefined' ? window.location.origin : '';
      console.log('Setting up Socket.IO connection to:', socketUrl);
      const socket = io(socketUrl, {
        path: '/api/socket/io',
        addTrailingSlash: false,
      });

      socket.on('connect', () => {
        console.log('useNotifications: Connected to Socket.IO with ID:', socket.id);
        socket.emit('joinRoom', 'onesignal-messages');
        console.log('useNotifications: Joined onesignal-messages room');
      });

      socket.on('disconnect', () => {
        console.log('useNotifications: Disconnected from Socket.IO');
      });

      socket.on('connect_error', error => {
        console.error('useNotifications: Socket.IO connection error:', error);
      });

      socket.on('newMessage', (msg: OneSignalMessage) => {
        console.log('useNotifications: New real-time message received:', msg);
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
        console.log('useNotifications: Dispatching new notification to Redux:', newNotif);
        dispatch(addNotification(newNotif));
      });

      return () => {
        console.log('useNotifications: Cleaning up Socket.IO connection');
        socket.disconnect();
      };
    };

    initOneSignal();
    fetchRecentMessages();
    const cleanupSocket = setupSocket();

    return () => {
      cleanupSocket();
    };
  }, [dispatch]);

  return {};
};
