// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Firebase Function
import admin from "@/lib/firebase/firebaseAdmin";

// Import Types
import { ApiResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { token, title, body, clickUrl, senderAvatar } = await req.json();

    if (!token) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Messing token" },
        { status: 400 },
      );
    }

    const message = {
      token: token,
      data: {
        title: title || "New Notification",
        body: body || "You have a new message",
        icon: senderAvatar || "/pictures/avatar_icon.png",
        url: clickUrl || "http://localhost:3000/dashboard/chats",
      },
      webpush: {
        fcmOptions: {
          link: clickUrl || "http://localhost:3000/dashboard/chats",
        },
      },
    };

    await admin.messaging().send(message);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/send-notifications:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "An error occurred during sent notification" },
      { status: 500 },
    );
  }
}
