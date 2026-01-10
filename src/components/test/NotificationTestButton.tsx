'use client';

import { useState } from 'react';

export default function NotificationTestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [type, setType] = useState('promotion');
  const [status, setStatus] = useState('info');

  const sendTestNotification = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/onesignal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: {
            en: `Test ${type} notification at ${new Date().toLocaleTimeString()}`,
          },
          headings: {
            en: `${type.charAt(0).toUpperCase() + type.slice(1)} Alert`,
          },
          included_segments: ['All'],
          data: {
            type: type,
            status: status,
            orderId: type === 'order' ? `ORD-${Math.floor(Math.random() * 100000)}` : undefined,
            amount: type === 'payment' ? Math.floor(Math.random() * 5000) : undefined,
            timestamp: Date.now().toString(),
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        setResult(`✅ Sent! Type: ${type}, Status: ${status}`);
      } else {
        setResult(`❌ OneSignal Error: ${data.errors?.[0] || 'Unknown error'}`);
      }
    } catch (error) {
      setResult(`❌ Failed to send: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-semibold">OneSignal Test Controls</h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Notification Type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="promotion">Promotion</option>
          <option value="order">Order</option>
          <option value="shipping">Shipping</option>
          <option value="payment">Payment</option>
          <option value="delivery">Delivery</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">UI Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="info">Info (Blue)</option>
          <option value="success">Success (Green)</option>
          <option value="warning">Warning (Yellow)</option>
          <option value="error">Error (Red)</option>
        </select>
      </div>

      <button
        onClick={sendTestNotification}
        disabled={isLoading}
        className="w-full rounded bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isLoading ? 'Sending...' : 'Dispatch Notification'}
      </button>

      {result && (
        <div
          className={`mt-2 rounded p-2 text-xs ${result.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
        >
          {result}
        </div>
      )}

      <div className="text-[10px] text-gray-500">
        * Order IDs and amounts are automatically randomized when applicable.
      </div>
    </div>
  );
}
