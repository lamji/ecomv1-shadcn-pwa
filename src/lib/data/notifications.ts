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

export const mockNotifications: NotificationItem[] = [];
