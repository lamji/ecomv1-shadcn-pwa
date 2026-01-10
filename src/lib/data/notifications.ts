export interface NotificationItem {
  id: string;
  type: 'order' | 'shipping' | 'payment' | 'promotion' | 'delivery';
  title: string;
  message: string;
  status: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
  date: string;
  amount?: number;
  orderId?: string;
  trackingNumber?: string;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #12345 has been confirmed and is being processed.',
    status: 'success',
    read: false,
    date: '2024-01-15T10:30:00Z',
    amount: 2999,
    orderId: 'ORD-12345',
  },
  {
    id: 'notif_2',
    type: 'shipping',
    title: 'Order Shipped',
    message: 'Your order #12345 has been shipped and will arrive in 2-3 days.',
    status: 'info',
    read: false,
    date: '2024-01-14T15:45:00Z',
    trackingNumber: 'TRK-67890',
    orderId: 'ORD-12345',
  },
  {
    id: 'notif_3',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Payment of ₱2,999.00 for order #12344 has been processed successfully.',
    status: 'success',
    read: true,
    date: '2024-01-13T09:20:00Z',
    amount: 2999,
    orderId: 'ORD-12344',
  },
  {
    id: 'notif_4',
    type: 'promotion',
    title: 'Flash Sale Alert!',
    message: 'Get 50% off on selected items. Limited time offer!',
    status: 'warning',
    read: true,
    date: '2024-01-12T12:00:00Z',
  },
  {
    id: 'notif_5',
    type: 'delivery',
    title: 'Order Delivered',
    message: 'Your order #12343 has been delivered successfully.',
    status: 'success',
    read: true,
    date: '2024-01-11T16:30:00Z',
    orderId: 'ORD-12343',
  },
];
