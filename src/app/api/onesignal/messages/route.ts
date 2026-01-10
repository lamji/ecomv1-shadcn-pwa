import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get credentials from environment variables
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!appId || !apiKey) {
      return NextResponse.json({ error: 'OneSignal credentials not configured' }, { status: 500 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    let url = `https://onesignal.com/api/v1/notifications?app_id=${appId}&limit=${limit}&offset=${offset}`;

    // If specific message ID requested
    if (messageId) {
      url = `https://onesignal.com/api/v1/notifications/${messageId}?app_id=${appId}`;
    }

    // Call OneSignal API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errors?.[0] || 'Failed to fetch messages' },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('OneSignal fetch messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
