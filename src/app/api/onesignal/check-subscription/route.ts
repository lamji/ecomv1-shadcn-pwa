import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { external_id } = await request.json();

    if (!external_id) {
      return NextResponse.json(
        { error: 'Missing external_id parameter' },
        { status: 400 }
      );
    }

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!appId || !apiKey) {
      return NextResponse.json(
        { error: 'OneSignal credentials missing' },
        { status: 500 }
      );
    }

    // Check if user exists and get subscription info
    const response = await fetch(`https://api.onesignal.com/players?app_id=${appId}&external_id=${external_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OneSignal API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to check subscription', details: errorData },
        { status: 400 }
      );
    }

    const data = await response.json();
    
    // Check if player exists and is subscribed
    const players = data.players || [];
    const player = players[0]; // Get first matching player
    
    if (!player) {
      return NextResponse.json({
        success: true,
        subscribed: false,
        message: 'No subscriber found with this external ID',
        external_id,
      });
    }

    return NextResponse.json({
      success: true,
      subscribed: true,
      external_id,
      player: {
        id: player.id,
        identifier: player.identifier,
        device_type: player.device_type,
        device_os: player.device_os,
        device_model: player.device_model,
        app_version: player.app_version,
        sdk_version: player.sdk_version,
        language: player.language,
        timezone: player.timezone,
        test_type: player.test_type,
        playtime: player.playtime,
        last_active: player.last_active,
        invalid_identifier: player.invalid_identifier,
        session_count: player.session_count,
        tags: player.tags,
        amount_spent: player.amount_spent,
        created_at: player.created_at,
        notification_types: player.notification_types,
      }
    });

  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
