'use client';

import React, { useEffect, useState } from 'react';
import { Search, ExternalLink, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { useSocketConnection } from '@/lib/hooks/useSocketConnection';
import OneSignalMessagesViewer from '@/components/test/OneSignalMessagesViewer';
import NotificationTestButton from '@/components/test/NotificationTestButton';

// Sample Order Data aligned with products.ts exactly
const INITIAL_ORDERS = [
  {
    id: 'ORD-8291',
    customer: 'John Doe',
    email: 'john@example.com',
    items: [
      {
        id: 'p1',
        name: 'Stylish Fashion Sneakers',
        quantity: 1,
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      },
      {
        id: 'p6',
        name: 'Premium Cotton Casual Shirt',
        quantity: 2,
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=400&fit=crop',
      },
    ],
    total: 129.97,
    status: 'pending',
    date: '2026-01-10T14:30:00Z',
    address: '123 Main St, New York, NY',
  },
  {
    id: 'ORD-7521',
    customer: 'Sarah Miller',
    email: 'sarah.m@example.com',
    items: [
      {
        id: 'p4',
        name: 'Elegant Emerald Green Evening Gown',
        quantity: 1,
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
      },
    ],
    total: 19.99,
    status: 'processing',
    date: '2026-01-11T09:15:00Z',
    address: '456 Park Ave, Los Angeles, CA',
  },
  {
    id: 'ORD-9102',
    customer: 'Mike Ross',
    email: 'mike@pearson.com',
    items: [
      {
        id: 'p13',
        name: 'Premium Wireless Headphones',
        quantity: 1,
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      },
    ],
    total: 79.99,
    status: 'shipped',
    date: '2026-01-09T16:45:00Z',
    address: '789 Broadway, Seattle, WA',
  },
];

export default function PosPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { socket } = useSocketConnection();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Listen for real-time status updates from other devices
  useEffect(() => {
    const handleStatusChange = (data: { orderId: string; status: string }) => {
      console.log('🔄 Real-time status update received:', data);
      setOrders(prev => prev.map(o => o.id === data.orderId ? { ...o, status: data.status } : o));
    };

    socket.on('order:update', handleStatusChange);
    return () => {
      socket.off('order:update', handleStatusChange);
    };
  }, [socket]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="text-sm font-medium text-yellow-700">Pending</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm font-medium text-blue-700">Processing</span>
          </div>
        );
      case 'shipped':
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span className="text-sm font-medium text-purple-700">Shipped</span>
          </div>
        );
      case 'delivered':
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-700">Delivered</span>
          </div>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAvailableStatuses = (currentStatus: string) => {
    const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);

    return statusFlow.map((status, index) => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
      disabled: index < currentIndex, // Disable previous statuses
    }));
  };

  

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);

    try {
      // Update status via Next.js API
      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API error:', response.status, errorText);
        throw new Error(`Failed to update order: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Local state update (UI feedback)
        setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
        const response = await fetch('/api/onesignal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: {
              en: `Test order notification at ${new Date().toLocaleTimeString()}`,
            },
            headings: {
              en: `${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} Alert`,
            },
            included_segments: ['All'],
            data: {
              type: 'order',
              status: newStatus,
              orderId: orderId,
              amount: Math.floor(Math.random() * 5000),
              timestamp: Date.now().toString(),
            },
          }),
        });
        console.log(`Socket: Order ${orderId} updated successfully`, response);
      } else {
        console.error('❌ Server error:', result.error);
        throw new Error(result.error || 'Unknown server error');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      // Optionally show error to user here
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Merchant POS</h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant="secondary"
            className="border-none bg-green-100 text-green-700 hover:bg-green-100"
          >
            <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Store Online
          </Badge>
          <div className="h-8 w-8 rounded-full border bg-slate-200" />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-6 p-6 xl:grid-cols-3">
        {/* Left Column: Orders List */}
        <div className="space-y-6 xl:col-span-2">
          {/* Status Legend */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-600">Order Status Flow</h3>
                <div className="flex items-center gap-4">
                  {[
                    { status: 'pending', color: 'bg-yellow-500', label: 'Pending' },
                    { status: 'processing', color: 'bg-blue-500', label: 'Processing' },
                    { status: 'shipped', color: 'bg-purple-500', label: 'Shipped' },
                    { status: 'delivered', color: 'bg-green-500', label: 'Delivered' },
                  ].map(({ status, color, label }) => (
                    <div key={status} className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${color}`} />
                      <span className="text-xs text-slate-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="pb-3">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                  <CardDescription>Manage and track incoming store orders</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search order ID or customer..."
                      className="h-9 pl-9"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="h-9 w-[140px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left font-medium text-slate-500">
                      <th className="px-2 py-3">Order ID</th>
                      <th className="px-2 py-3">Customer</th>
                      <th className="px-2 py-3">Total</th>
                      <th className="px-2 py-3">Status</th>
                      <th className="px-2 py-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-2 py-4 font-mono font-medium text-blue-600">
                          {order.id}
                        </td>
                        <td className="px-2 py-4">
                          <div className="font-medium text-slate-900">{order.customer}</div>
                          <div className="text-xs text-slate-500">{order.email}</div>
                        </td>
                        <td className="px-2 py-4 font-medium">₱{order.total.toLocaleString()}</td>
                        <td className="px-2 py-4">{getStatusBadge(order.status)}</td>
                        <td className="px-2 py-4 text-right">
                          <Select
                            value={order.status}
                            onValueChange={val => updateOrderStatus(order.id, val)}
                            disabled={isUpdating === order.id}
                          >
                            <SelectTrigger className="ml-auto h-8 w-[130px]">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`}
                                />
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableStatuses(order.status).map(status => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                  disabled={status.disabled}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`h-2 w-2 rounded-full ${getStatusColor(status.value)}`}
                                    />
                                    {status.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Stats & Details */}
        <div className="space-y-6">
          <Card className="border-none bg-blue-600 text-white shadow-sm ring-1 ring-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium tracking-wider uppercase opacity-80">
                Today&apos;s Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₱42,891.00</div>
              <p className="mt-1 text-xs opacity-70">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Recent Order Items</CardTitle>
              <CardDescription>Detailed view of items in latest order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orders[0].items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border bg-white shadow-sm">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity} × ₱{item.price}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm font-medium text-slate-500">Total Amount</span>
                <span className="text-lg font-bold text-slate-900">
                  ₱{orders[0].total.toFixed(2)}
                </span>
              </div>
              <Button className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                View Full Order Details
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
              <span className="text-xs font-bold tracking-widest uppercase">Store Insights</span>
              <Badge className="h-4 bg-blue-500 text-[10px]">BETA</Badge>
            </div>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Pending Fulfillment</span>
                <span className="font-bold text-slate-900">14 orders</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Avg. Processing Time</span>
                <span className="font-bold text-slate-900">1.2 hrs</span>
              </div>
            </CardContent>
          </Card>

          <OneSignalMessagesViewer />
          <NotificationTestButton />
        </div>
      </main>



    </div>
  );
}
