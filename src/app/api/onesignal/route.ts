import { NextRequest, NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';

// Extend global type to include Socket.IO instance
declare global {
  // eslint-disable-next-line no-var
  var io: SocketIOServer | undefined;
}

export async function POST(request: NextRequest) {
  try {
    // Get credentials from environment variables
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!appId || !apiKey) {
      return NextResponse.json({ error: 'OneSignal credentials not configured' }, { status: 500 });
    }

    // Get notification data from request body
    const notificationData = await request.json();

    // Call OneSignal API
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        ...notificationData,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errors?.[0] || 'Failed to send notification' },
        { status: response.status },
      );
    }

    // Emit Socket.IO event for real-time updates
    try {
      const io = global.io;
      if (io) {
        // Create a message object for the UI
        const newMessage = {
          id: data.id,
          contents: notificationData.contents || {},
          headings: notificationData.headings || {},
          completed_at: Math.floor(Date.now() / 1000),
          successful: 0,
          failed: 0,
          converted: 0,
          remaining: 1,
          data: notificationData.data || {},
        };

        // Emit to all clients in the onesignal-messages room
        io.to('onesignal-messages').emit('newMessage', newMessage);
        console.log('Emitted new message event via Socket.IO');
      }
    } catch (socketError) {
      console.error('Socket.IO emission error:', socketError);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('OneSignal send error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
