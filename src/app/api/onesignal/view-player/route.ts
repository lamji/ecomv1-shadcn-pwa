/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!appId || !apiKey) {
      return NextResponse.json({ error: 'OneSignal credentials not configured' }, { status: 500 });
    }

    const { external_id } = await request.json();

    if (!external_id) {
      return NextResponse.json({ error: 'external_id is required' }, { status: 400 });
    }

    // Call OneSignal View User API
    const response = await fetch(`https://onesignal.com/api/v1/apps/${appId}/users/by/external_id/${external_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    console.log(`[OneSignal Debug] View User Response for ${external_id}:`, {
      status: response.status,
      subscriptionCount: data.subscriptions?.length || 0,
      subscriptions: data.subscriptions?.map((s: any) => ({ type: s.type, enabled: s.enabled }))
    });

    if (!response.ok) {
      // If user not found, return subscribed: false instead of 404
      if (response.status === 404) {
        return NextResponse.json({ subscribed: false }, { status: 200 });
      }
      return NextResponse.json(
        { error: data.errors?.[0] || 'Failed to fetch user data' },
        { status: response.status },
      );
    }

    // Check if user has any active push subscriptions
    const hasPushSubscription = data.subscriptions?.some(
      (sub: any) => sub.type === 'Push' && sub.enabled === true
    );

    return NextResponse.json({ 
      subscribed: !!hasPushSubscription,
      data: data 
    }, { status: 200 });

  } catch (error) {
    console.error('OneSignal view-player error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
