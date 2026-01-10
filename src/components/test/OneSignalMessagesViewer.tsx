'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

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
  const [isConnected, setIsConnected] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/onesignal/messages?limit=20');
      const data = await response.json();

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
    // Initialize Socket.IO connection
    console.log('Initializing Socket.IO connection...');
    const socketUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const newSocket = io(socketUrl, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO with ID:', newSocket.id);
      setIsConnected(true);
      // Join the onesignal-messages room
      newSocket.emit('joinRoom', 'onesignal-messages');
    });

    newSocket.on('connect_error', error => {
      console.error('Socket.IO connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO');
      setIsConnected(false);
    });

    // Listen for new messages
    newSocket.on('newMessage', (message: OneSignalMessage) => {
      console.log('New message received:', message);
      // Add new message to the beginning of the list
      setMessages(prev => [message, ...prev.slice(0, 19)]); // Keep only last 20 messages
    });

    // Fetch initial messages
    fetchMessages();

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up Socket.IO connection...');
      newSocket.disconnect();
    };
  }, []);

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
