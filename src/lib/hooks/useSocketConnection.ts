import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '@/lib/socket';
import { addNotification } from '@/lib/features/notificationSlice';
import { NotificationItem } from '@/lib/data/notifications';
import { getCurrentUserId } from '@/lib/utils/jwt';

export function useSocketConnection() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const dispatch = useDispatch();

 
  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      console.log('📡 [useSocketConnection] Connected, joining room...');
      
      // Join the general notification room
      socket.emit('joinRoom', 'onesignal-messages');
      
      // Join user-specific room with actual user ID
      const userId = getCurrentUserId();
      if (userId) {
        socket.emit('join', userId);
        console.log(`🎯 [useSocketConnection] Joined user room: ${userId}`);
      } else {
        console.warn('⚠️ [useSocketConnection] No user ID found - not joining user room');
      }
    };
    
    const handleDisconnect = () => setIsConnected(false);

    const handleOrderUpdate = async (data: { orderId: string; status: string }) => {
      console.log('📦 [useSocketConnection] Global order:update received:', data);

      const timestamp = Math.floor(Date.now() / 1000);
      const uniqueId = `notif-${data.orderId}-${data.status}-${timestamp}`;

      const newNotification: NotificationItem = {
        id: uniqueId,
        type: 'order',
        title: 'Order Update',
        message: `Order ${data.orderId} is now ${data.status}`,
        status: data.status === 'delivered' ? 'success' : 'info',
        read: false,
        date: new Date().toISOString(),
        orderId: data.orderId,
      };

      /**
       * BEST PRACTICE SYNC:
       * 1. Persist to DB first (via API)
       * 2. Update Redux store (Optimistic or after DB success)
       */
      try {
        // Simulation: Call API to save notification to DB
        // In a real app, this would be: await fetch('/api/notifications/save', { ... })
        console.log('💾 [useSocketConnection] Syncing notification to DB...', uniqueId);
        
        // Update Redux Store
        dispatch(addNotification(newNotification));
        console.log('✅ [useSocketConnection] Redux store updated.');
      } catch (error) {
        console.error('❌ [useSocketConnection] Failed to sync notification:', error);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('order:update', handleOrderUpdate);

    // Initial connection handling
    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('order:update', handleOrderUpdate);
    };
  }, [dispatch]);

  return { isConnected, socket };
}
