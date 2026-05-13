// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Auth Functions
import { verifyToken, hashPassword, comparePassword } from "@/lib/auth";

// Import Token Manager Functions
import { removeToken } from "@/lib/tokenManager";

// Import My Types
import { ApiResponse } from "@/lib/types";

import jwt from "jsonwebtoken";

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

    // Read Data From Request Body
    const { currentPassword, newPassword } = await request.json();

    // Get User Data To Check From Current Password
    const { data: user, error: fetchError } = await supabaseServer
      .from("users")
      .select("password_hash, email, username")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Check Current Password Is Correct Or Not
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password_hash,
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Current password is incorrect",
          field: "currentPassword",
        },
        { status: 400 },
      );
    }

    // Password Encryption
    const newPasswordHash = await hashPassword(newPassword);

    // Update Password In Supabase
    const { error: updateError } = await supabaseServer
      .from("users")
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    // If Faild To Update Password
    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Failed to update password",
        },
        { status: 500 },
      );
    }

    // If Success To Update Password
    return NextResponse.json<ApiResponse<null>>(
      {
        success: true,
        message: "Password changed successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error in POST /api/auth/change-password:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Server error occurred",
      },
      { status: 500 },
    );
  }
}
