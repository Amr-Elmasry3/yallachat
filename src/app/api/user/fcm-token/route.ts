// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Auth Functions
import { verifyToken } from "@/lib/auth";

// Import Token Manager Functions
import { removeToken } from "@/lib/tokenManager";

// Import Types
import { ApiResponse, FcmTokenRow } from "@/lib/types";

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

    // Get User id
    const userId = (verifyTokenConfig?.decoded as jwt.JwtPayload).userId;

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid token payload" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { fcmToken } = body;

    if (!fcmToken) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "userId and fcmToken are required" },
        { status: 400 },
      );
    }

    // Search for a device with the same user_id
    const { data: existingDevice, error: findError } = await supabaseServer
      .from("users_fcm_token")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (findError && findError.code !== "PGRST116") {
      console.error("Error finding device:", findError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to check existing device" },
        { status: 500 },
      );
    }

    let result;
    let message = "";

    if (existingDevice) {
      // Update existing device
      const { data, error } = await supabaseServer
        .from("users_fcm_token")
        .update({
          fcm_token: fcmToken,
          last_used_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingDevice.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating device:", error);
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: "Failed to update device" },
          { status: 500 },
        );
      }

      result = data;
      message = "Device token updated successfully";
    } else {
      // Add a new device
      const { data, error } = await supabaseServer
        .from("users_fcm_token")
        .insert({
          user_id: userId,
          fcm_token: fcmToken,
          last_used_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting device:", error);
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: "Failed to register device" },
          { status: 500 },
        );
      }

      result = data;
      message = "Device registered successfully";
    }

    return NextResponse.json<ApiResponse<FcmTokenRow>>({
      success: true,
      message,
      data: result,
    });
  } catch (error) {
    console.error("Error in POST /api/user/devices:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
