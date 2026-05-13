// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Auth Functions
import { verifyToken } from "@/lib/auth";

// Import Token Manager Functions
import { removeToken } from "@/lib/tokenManager";

// Import My Types
import { ApiResponse, UserInfo, UserUpdateResponse } from "@/lib/types";

import jwt from "jsonwebtoken";

// Types
type UpdateUserData = {
  username?: string;
  email?: string;
  phone_number?: string;
  bio?: string;
  updated_at?: string;
};

// Endpoint To Get User Data
export async function GET(request: NextRequest) {
  try {
    // Verify token
    const verifyTokenConfig = await verifyToken("headers", request);

    if (!verifyTokenConfig?.decoded) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized token" },
        { status: 401 },
      );
    }

    const userId = (verifyTokenConfig?.decoded as jwt.JwtPayload).userId;
    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid token payload" },
        { status: 401 },
      );
    }

    // Fetch user data
    const { data: user, error } = await supabaseServer
      .from("users")
      .select(
        "id, username, email, phone_number, profile_image, bio, last_seen, status",
      )
      .eq("id", userId)
      .single();

    if (error || !user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<UserInfo>>(
      {
        success: true,
        data: user,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error in GET /api/user:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "An error occurred during get user data" },
      { status: 500 },
    );
  }
}

// Endpoint To Update User Data
export async function PATCH(request: NextRequest) {
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

    // Get Data From Body
    const body = await request.json();
    const { username, email, phone, bio } = body;

    // Check For Data Duplication
    const updateData: UpdateUserData = {};

    // Check If The Username Exists
    if (username && username.trim() !== "") {
      const { data: existingUsername } = await supabaseServer
        .from("users")
        .select("id")
        .eq("username", username.trim())
        .neq("id", userId)
        .single();

      if (existingUsername) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            message: "Username already taken",
            field: "username",
          },
          { status: 409 },
        );
      }
      updateData.username = username.trim();
    }

    // Check If The Email Exists
    if (email && email.trim() !== "") {
      const { data: existingEmail } = await supabaseServer
        .from("users")
        .select("id")
        .eq("email", email.trim())
        .neq("id", userId)
        .single();

      if (existingEmail) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            message: "Email already registered",
            field: "email",
          },
          { status: 409 },
        );
      }
      updateData.email = email.trim();
    }

    // Check If The Phone Exists
    if (phone && phone.trim() !== "") {
      const { data: existingPhone } = await supabaseServer
        .from("users")
        .select("id")
        .eq("phone_number", phone.trim())
        .neq("id", userId)
        .single();

      if (existingPhone) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            message: "Phone number already registered",
            field: "phone",
          },
          { status: 409 },
        );
      }
      updateData.phone_number = phone.trim();
    }

    // Bio (No Duplicate Check Required)
    if (bio) {
      updateData.bio = bio;
    } else {
      updateData.bio = undefined;
    }

    // If There Is No Real Data To Update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "No valid data to update",
        },
        { status: 400 },
      );
    }

    // Add Timestamp
    updateData.updated_at = new Date().toISOString();

    // Updating Data In The Database
    const { data: updatedUser, error: updateError } = await supabaseServer
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select(
        `
        id,
        username,
        email,
        phone_number,
        bio,
        updated_at
      `,
      )
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Failed to update user data",
        },
        { status: 500 },
      );
    }

    // Success Update User Data
    return NextResponse.json<ApiResponse<UserUpdateResponse>>(
      {
        success: true,
        message: "Profile updated successfully",
        data: {
          user: updatedUser,
          updated_fields: Object.keys(updateData).filter(
            (key) => key !== "updated_at",
          ),
          timestamp: updatedUser.updated_at,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error in PATCH /api/user/update:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Server error occurred",
      },
      { status: 500 },
    );
  }
}
