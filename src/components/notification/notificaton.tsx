'use client';

import React from 'react';
import { Bell, Package, Truck, CreditCard, X, ChevronLeft, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/helper/currency';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Mock notification data for e-commerce
const mockNotifications: NotificationItem[] = [
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

interface NotificationItem {
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

export default function Notification() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(mockNotifications);
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'read'>('all');
  const router = useRouter();

  const markAsRead = React.useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  }, []);

  const deleteNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Derived lists and counts
  const unreadCount = React.useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications],
  );
  const readCount = React.useMemo(() => notifications.filter(n => n.read).length, [notifications]);
  const filtered = React.useMemo(() => {
    if (filter === 'unread') return notifications.filter(n => !n.read);
    if (filter === 'read') return notifications.filter(n => n.read);
    return notifications;
  }, [notifications, filter]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return Package;
      case 'shipping':
        return Truck;
      case 'payment':
        return CreditCard;
      case 'delivery':
        return Check;
      default:
        return Bell;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-purple-100 text-purple-600';
      case 'shipping':
        return 'bg-blue-100 text-blue-600';
      case 'payment':
        return 'bg-green-100 text-green-600';
      case 'delivery':
        return 'bg-emerald-100 text-emerald-600';
      case 'promotion':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    }
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-8">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" aria-label="Back" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        {/* Filters */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'all' ? 'text-white' : undefined}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'unread' ? 'text-white' : undefined}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'read' ? 'text-white' : undefined}
            onClick={() => setFilter('read')}
          >
            Read ({readCount})
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-background ring-border/50 overflow-hidden rounded-xl ring-1">
        <ul className="divide-y">
          {filtered.map(notification => {
            const Icon = getNotificationIcon(notification.type);
            const iconBg = getIconBg(notification.type);
            const statusColor = getStatusColor(notification.status);
            const dateStr = formatDate(notification.date);

            return (
              <li key={notification.id}>
                <div
                  className={`hover:bg-accent/40 flex w-full items-center justify-between gap-3 px-4 py-3.5 transition sm:py-4 ${
                    notification.read ? '' : 'bg-accent/20'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="truncate text-left text-sm font-medium sm:text-base">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                        )}
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${statusColor}`}
                        >
                          {notification.status}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2 text-left text-xs">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground text-left text-xs">{dateStr}</p>
                        {notification.orderId && (
                          <span className="text-muted-foreground text-xs">
                            Order: {notification.orderId}
                          </span>
                        )}
                        {notification.trackingNumber && (
                          <span className="text-muted-foreground text-xs">
                            Tracking: {notification.trackingNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {notification.amount && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-emerald-600">
                          {formatCurrency(notification.amount)}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="p-8 text-center">
              <Bell className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">
                {filter === 'unread'
                  ? 'No unread notifications'
                  : filter === 'read'
                    ? 'No read notifications'
                    : 'No notifications'}
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
