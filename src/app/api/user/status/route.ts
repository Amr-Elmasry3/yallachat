// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Auth Functions
import { verifyToken } from "@/lib/auth";

// Import Token Manager Functions
import { removeToken } from "@/lib/tokenManager";

// Import My Types
import { ApiResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    // Get User Status
    const { userId, status } = await request.json();

    // Verify token
    const verifyTokenConfig = await verifyToken("cookies");

    // If there is no token, we return success (unregistered user), And // If The Token Is Invalid, We Clean It Up And Return It.
    if (!verifyTokenConfig?.token || !verifyTokenConfig?.decoded) {
      if (!verifyTokenConfig?.decoded) {
        await removeToken({
          tokenName: "yalla_chat_user_token",
          token: verifyTokenConfig?.token as string,
        });
      }

      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "No valid session found",
        },
        { status: 401 },
      );
    }

    if (!userId || !status) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "userId and status are required" },
        { status: 400 },
      );
    }

    const { error } = await supabaseServer
      .from("users")
      .update({
        status: status,
        last_seen: new Date().toISOString(),
      })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Database update error:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Failed to update user status",
        },
        { status: 500 },
      );
    }

    return NextResponse.json<ApiResponse<null>>(
      { success: true },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error in POST /api/user/status:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Server error occurred",
      },
      { status: 500 },
    );
  }
}
