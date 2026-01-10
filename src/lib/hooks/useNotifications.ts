import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { addNotification } from '../features/notificationSlice';
import { NotificationItem } from '../data/notifications';

/**
 * Hook to manage notification polling and API integration
 */
export const useNotifications = () => {
  const dispatch = useAppDispatch();

  // This is a simulation of real-time updates.
  // In a real app, you would use WebSocket (Socket.io) or Polling (React Query)
  useEffect(() => {
    const pollNotifications = async () => {
      try {
        // Example API call:
        // const response = await fetch('/api/notifications');
        // const data = await response.json();
        // dispatch(setNotifications(data));

        console.log('Checking for new notifications...');
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    // Simulate a new notification arriving after 15 seconds
    let secondsLeft = 15;
    const countdownInterval = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft > 0) {
        console.log(`New notification in ${secondsLeft}s...`);
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);

    const demoTimer = setTimeout(() => {
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        type: 'promotion',
        title: 'Special Offer!',
        message: 'A new 20% discount just for you. Check it out!',
        status: 'info',
        read: false,
        date: new Date().toISOString(),
      };

      dispatch(addNotification(newNotif));
      console.log('New notification received via simulated API');
    }, 15000);

    const interval = setInterval(pollNotifications, 30000); // Poll every 30s

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
      clearTimeout(demoTimer);
    };
  }, [dispatch]);

  return {};
};
