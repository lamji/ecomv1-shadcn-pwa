import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '@/lib/socket';
import { addNotification } from '@/lib/features/notificationSlice';
import { NotificationItem } from '@/lib/data/notifications';

export function useSocketConnection() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      console.log('📡 [useSocketConnection] Connected, joining room...');
      socket.emit('joinRoom', 'onesignal-messages');
      // Also join a general user room for targeted notifications
      socket.emit('join', 'user-123'); // Hardcoded for now
    };
    
    const handleDisconnect = () => setIsConnected(false);

    const handleOrderUpdate = (data: { orderId: string; status: string }) => {
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

      dispatch(addNotification(newNotification));
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
