'use client';

import { useState, useEffect } from 'react';
import { useSocketConnection } from '@/lib/hooks/useSocketConnection';

// Type definition for OneSignal message
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

export default function OneSignalMessagesViewer() {
  const [messages, setMessages] = useState<OneSignalMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { isConnected, socket } = useSocketConnection();

  const fetchMessages = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/onesignal/messages?limit=20');
      const data = await response.json();

      console.log('📦 Fetched messages:', data);

      if (response.ok) {
        setMessages(data.notifications || []);
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMessages();

    socket.on('order:update', (data: { orderId: string; status: string }) => {
      console.log('📦 Status update received via socket:', data);
      // Wait 2 seconds for OneSignal to process the notification before fetching
      setTimeout(() => {
        console.log('🔄 Fetching messages after delay...');
        fetchMessages();
      }, 2000);
    });

    const handleConnect = () => {
      console.log('📡 Connected to socket, joining room and fetching...');
      socket.emit('joinRoom', 'onesignal-messages');
      fetchMessages();
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on('connect', handleConnect);

    return () => {
      socket.off('order:update');
      socket.off('connect', handleConnect);
    };
  }, [socket]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg border p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">OneSignal Messages</h3>
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-xs text-gray-500">{isConnected ? 'Live' : 'Offline'}</span>
          {!isConnected && (
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-blue-500 hover:text-blue-600"
            >
              Retry Connection
            </button>
          )}
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>}

      <div className="space-y-4">
        {messages.map(message => (
          <div key={message.id} className="rounded border p-4">
            <div className="mb-2 flex items-start justify-between">
              <h4 className="font-medium">{message.headings?.en || 'No Title'}</h4>
              <span className="text-xs text-gray-500">{formatDate(message.completed_at)}</span>
            </div>
            <p className="text-gray-600">{message.contents?.en || 'No Content'}</p>
            <div className="mt-2 text-xs text-gray-400">
              ID: {message.id} | Sent: {message.successful} | Failed: {message.failed}
            </div>
          </div>
        ))}

        {messages.length === 0 && !loading && !error && (
          <div className="py-8 text-center text-gray-500">No messages found</div>
        )}
      </div>
    </div>
  );
}
