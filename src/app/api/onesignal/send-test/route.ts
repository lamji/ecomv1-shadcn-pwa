import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 🔒 HARD-CODED VALUES (FOR TESTING ONLY)
    const external_id = "test-user-123";
    const title = "Order Placed ✅";
    const message = "Your order #12345 has been successfully placed.";

    const appId = "1ace30b6-3a42-4b09-a77d-b44ecc442175";
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    console.log("Sending test notification to:", external_id);

    const payload = {
      app_id: appId,
      headings: { en: title },
      contents: { en: message },

      include_aliases: {
        external_id: [external_id],
      },

      target_channel: "push",
      content_available: true,

      data: {
        type: "ORDER_PLACED",
        orderId: "12345",
      },
    };

    console.log("Payload:", payload);

    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("OneSignal error:", result);
      return NextResponse.json(
        { success: false, error: result },
        { status: 400 }
      );
    }

    console.log("OneSignal success:", result);

    return NextResponse.json({
      success: true,
      message: "Hard-coded test notification sent",
      result,
    });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
