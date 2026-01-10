import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get notification data from request body
    const notificationData = await request.json();

    // Create a notification object that matches the NotificationItem interface
    const notification = {
      id: notificationData.id || `notif-${Date.now()}`,
      type: notificationData.type || 'promotion',
      title: notificationData.headings?.en || 'New Notification',
      message: notificationData.contents?.en || 'You have a new notification',
      status: notificationData.status || 'info',
      read: false,
      date: new Date().toISOString(),
      orderId: notificationData.orderId,
      amount: notificationData.amount,
      customer: notificationData.customer,
      email: notificationData.email,
      items: notificationData.items,
      address: notificationData.address,
    };

    // For Vercel, we'll use a different approach
    // Return the notification data so the client can update Redux directly
    return NextResponse.json({
      success: true,
      notification: notification,
      message: 'Notification processed successfully',
    });
  } catch (error) {
    console.error('Notify API error:', error);
    return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 });
  }
}
