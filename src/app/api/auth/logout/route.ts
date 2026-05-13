// Import Next Types
import { NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Auth Functions
import { verifyToken } from "@/lib/auth";

// Import Token Manager Functions
import { removeToken } from "@/lib/tokenManager";

// Import My Types
import { ApiResponse } from "@/lib/types";

import jwt from "jsonwebtoken";

export async function POST() {
  try {
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
          message: "Logout successful (No valid session found)",
        },
        { status: 401 },
      );
    }

    // Get User Id
    const userId = (verifyTokenConfig?.decoded as jwt.JwtPayload).userId;

    // If Not Found User Id
    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid token payload" },
        { status: 401 },
      );
    }

    // Update user status in the database
    const { error } = await supabaseServer
      .from("users")
      .update({
        last_seen: new Date().toISOString(),
        status: "offline",
      })
      .eq("id", userId);

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "An error occurred during logout." },
        { status: 404 },
      );
    }

    // Delete Token From Cookies => [2] Status = Update Info In Database
    await removeToken({
      tokenName: "yalla_chat_user_token",
      token: verifyTokenConfig?.token as string,
    });

    // Return Response
    return NextResponse.json<ApiResponse<null>>(
      {
        success: true,
        message: "Logout Successful",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error in POST /api/auth/logout:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
