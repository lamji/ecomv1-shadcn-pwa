import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, title, priority = 'default', topic } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Use environment variable or provided topic
    const ntfyTopic = topic || process.env.NEXT_PUBLIC_NTFY_TOPIC || 'ecom_orders_alerts';

    const response = await fetch(`https://ntfy.sh/${ntfyTopic}`, {
      method: 'POST',
      body: message,
      headers: {
        Title: title || 'Order Update',
        Priority: priority,
        'Content-Type': 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error(`ntfy.sh responded with ${response.status}`);
    }

    return NextResponse.json({ success: true, message: 'Notification sent' }, { status: 200 });
  } catch (error) {
    console.error('Failed to send notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
