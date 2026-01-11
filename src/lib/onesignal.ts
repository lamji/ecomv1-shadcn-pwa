export async function sendPushNotification({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  const appId = process.env.ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!appId || !apiKey) {
    console.warn('⚠️ OneSignal credentials missing. Skipping push notification.');
    return;
  }

  try {
    const res = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        headings: { en: title },
        contents: { en: message },
        included_segments: ["All"],
      }),
    });

    console.log('OneSignal push notification sent successfully');

    if (!res.ok) {
      const errorData = await res.json();
      console.error('❌ OneSignal API error:', errorData);
      throw new Error("OneSignal failed");
    }

    console.log('✅ OneSignal push notification sent successfully');
  } catch (error) {
    console.error('❌ Error sending OneSignal notification:', error);
    throw error;
  }
}
