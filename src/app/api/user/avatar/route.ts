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

import jwt from "jsonwebtoken";

// Endpoint To Update User Data
export async function POST(request: NextRequest) {
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
          message: "No valid session found",
        },
        { status: 401 },
      );
    }

    // Get User Id
    const userId = (verifyTokenConfig?.decoded as jwt.JwtPayload).userId;

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid token payload" },
        { status: 401 },
      );
    }

    // Get Data From Request
    const { profileImage, imgSize } = await request.json();

    // Check Size Of Image
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imgSize > maxSize) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Image size exceeds 5MB limit",
        },
        { status: 400 },
      );
    }

    // Update Profile Image In Database
    const { error: updateError } = await supabaseServer
      .from("users")
      .update({
        profile_image: profileImage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select(
        `
        id,
        username,
        profile_image,
        updated_at
      `,
      )
      .single();

    // Failed Update Profile Image In Database
    if (updateError) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Failed to update profile image",
        },
        { status: 500 },
      );
    }

    // Success Update Profile Image In Database
    return NextResponse.json<ApiResponse<null>>(
      {
        success: true,
        message: "Profile image updated successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error in POST /api/user/avata/update:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Server error occurred",
      },
      { status: 500 },
    );
  }
}
