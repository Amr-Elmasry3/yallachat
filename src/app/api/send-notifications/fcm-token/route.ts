// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Types
import { ApiResponse, FcmTokensData } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const friendId = searchParams.get("friendId");

    if (!friendId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }

    // Bring all user devices
    const { data: devices, error } = await supabaseServer
      .from("users_fcm_token")
      .select("fcm_token")
      .eq("user_id", friendId);

    if (error) {
      console.error("Error fetching user devices:", error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to fetch devices" },
        { status: 500 },
      );
    }

    // Extracting tokens only
    const tokens = devices?.map((device) => device.fcm_token) || [];

    return NextResponse.json<ApiResponse<FcmTokensData>>({
      success: true,
      data: {
        friendId,
        tokens,
        count: tokens.length,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/user/devices/tokens:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
