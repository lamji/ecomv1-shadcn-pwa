import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId, status } = await req.json();
      const socketServerUrl = process.env.SOCKET_SERVER_URL || 'https://site--crud-handler--rrh2m28k5ljg.code.run';

    console.log(`🚀 Processing update for order ${orderId} to ${status}`);

    // 1️⃣ Update database (Simulation)
    const dbSuccess = true;

    if (dbSuccess) {
      // 3️⃣ Notify Node.js Socket server via HTTP Bridge
      try {
        const socketResponse = await fetch(`${socketServerUrl}/emit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'order:update',
            payload: { 
              orderId, 
              status,
            },
          }),
        });

        if (!socketResponse.ok) {
          const errorText = await socketResponse.text();
          console.error('❌ Socket server error:', socketResponse.status, errorText);
          // Return early with success for DB but note socket failure
          return NextResponse.json({
            success: true,
            message: 'Status updated, but socket notification failed',
            socketError: errorText
          });
        }

        const socketResult = await socketResponse.json();
        console.log('📡 Triggered Socket.io bridge:', socketResult);
        
        return NextResponse.json({
          success: true,
          message: 'Status updated, notification sent, and socket triggered',
        });
      } catch (socketErr) {
        console.error('❌ Failed to trigger Socket.io bridge:', socketErr);
        return NextResponse.json({
          success: true,
          message: 'Status updated, but socket bridge was unreachable',
          error: String(socketErr)
        });
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update database' },
      { status: 500 },
    );
  } catch (error) {
    console.error('Server error during order status update:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
