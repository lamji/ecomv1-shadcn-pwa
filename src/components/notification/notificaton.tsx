'use client';

import React from 'react';
import moment from 'moment';
import {
  Bell,
  Package,
  Truck,
  CreditCard,
  ChevronLeft,
  Check,
  X,
  Calendar,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationItem } from '@/lib/data/notifications';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { markAsRead, markAllAsRead } from '@/lib/features/notificationSlice';

export default function Notification() {
  const notifications = useAppSelector(state => state.notifications.items);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'read'>('all');
  const [selected, setSelected] = React.useState<NotificationItem | null>(null);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleMarkAsRead = React.useCallback(
    (id: string) => {
      dispatch(markAsRead(id));
    },
    [dispatch],
  );

  const handleMarkAllAsRead = React.useCallback(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);

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
    return moment(dateString).format('MMM DD, YYYY [at] hh:mm A');
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-8">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" aria-label="Back" onClick={() => router.push('/')}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
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
          {filtered.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const iconBg = getIconBg(notification.type);
            const statusColor = getStatusColor(notification.status);
            const dateStr = formatDate(notification.date);

            return (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(notification);
                    setOpen(true);
                    handleMarkAsRead(notification.id);
                  }}
                  className={`hover:bg-accent/40 flex w-full items-center justify-between gap-3 px-4 py-3.5 transition sm:py-4 ${
                    notification.read ? 'bg-white' : 'bg-blue-50/50'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
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
                      <p className="text-muted-foreground text-left text-xs">{dateStr}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2"></div>
                </button>
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

      {/* Details Modal */}
      {open && selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={() => setOpen(false)} />
          <Card className="animate-in slide-in-from-bottom sm:zoom-in-95 relative z-10 w-full max-w-lg overflow-hidden rounded-t-2xl shadow-2xl duration-300 sm:rounded-2xl">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${getIconBg(selected.type)}`}
                  >
                    {React.createElement(getNotificationIcon(selected.type), {
                      className: 'h-5 w-5',
                    })}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selected.title}</CardTitle>
                    <p className="text-muted-foreground text-xs">{formatDate(selected.date)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Info className="text-primary h-4 w-4" />
                  Message
                </div>
                <p className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
                  {selected.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(selected.status)}`}
                  >
                    {selected.status}
                  </span>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Date
                  </p>
                  <div className="flex items-center justify-end gap-1.5 text-xs text-gray-700">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {new Date(selected.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {selected.orderId && (
                <div className="border-t pt-4">
                  <div className="bg-primary/5 border-primary/10 flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Package className="text-primary h-4 w-4" />
                      <span className="text-sm font-medium text-gray-900">Order ID</span>
                    </div>
                    <span className="text-primary font-mono text-sm font-bold">
                      {selected.orderId}
                    </span>
                  </div>
                </div>
              )}

              {selected.trackingNumber && (
                <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Tracking</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-blue-600">
                    {selected.trackingNumber}
                  </span>
                </div>
              )}

              <Button
                onClick={() => setOpen(false)}
                className="shadow-primary/20 w-full py-6 text-base font-bold shadow-lg"
              >
                Close Details
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
