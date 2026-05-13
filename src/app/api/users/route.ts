// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Auth Functions
import { verifyToken } from "@/lib/auth";

// Import Token Manager Functions
import { removeToken } from "@/lib/tokenManager";

// Import My Types
import { ApiResponse, UserProfile } from "@/lib/types";

// Endpoint To Get Users List
export async function GET(request: NextRequest) {
  try {
    // Verify token
    const verifyTokenConfig = await verifyToken("headers", request);

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

    // Fetch Users List
    const { data: users, error } = await supabaseServer.from("users").select(`
        id,
        username,
        email,
        phone_number,
        profile_image,
        bio,
        status,  
        last_seen,
        created_at
      `);

    if (error || !users) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Users not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<UserProfile[]>>(
      {
        success: true,
        data: users,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in GET /api/users:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "An error occurred during get users list" },
      { status: 500 },
    );
  }
}
