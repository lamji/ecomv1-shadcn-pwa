import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { external_id } = await request.json();

    if (!external_id) {
      return NextResponse.json(
        { success: false, error: "external_id is required" },
        { status: 400 }
      );
    }

    const appId = "1ace30b6-3a42-4b09-a77d-b44ecc442175";
    const apiKey = "os_v2_app_dlhdbnr2ijfqtj35wrhmyrbbowkbird5ni2us24bnywe5fix47oekbxn6tr3hrkn6xtew3vjtsroygazoq3mime6cu2k6d7nvgzwvpy";

    console.log("Checking if user exists with external_id:", external_id);

    const response = await fetch(
      `https://api.onesignal.com/apps/${appId}/users/by/external_id/${external_id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const userData = await response.json();
      console.log('User found:', userData);
      return NextResponse.json({
        success: true,
        exists: true,
        data: userData
      });
    } else if (response.status === 404) {
      console.log('User not found with external_id:', external_id);
      return NextResponse.json({
        success: true,
        exists: false,
        data: null
      });
    } else {
      const error = await response.json();
      console.error('OneSignal API Error:', error);
      return NextResponse.json(
        { success: false, error: "Failed to check user", details: error },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
