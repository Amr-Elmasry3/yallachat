// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Password Functions
import { comparePassword } from "@/lib/auth";

// Import Auth Functions
import { generateToken } from "@/lib/auth";

// Import My Types
import { ApiResponse, LoginResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Check If User Exists
    const { data: user, error: fetchError } = await supabaseServer
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Incorrect email address or password",
          field: "email",
        },
        { status: 400 },
      );
    }

    // Verify Password
    const result = await comparePassword(password, user.password_hash);

    if (!result) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Incorrect email address or password",
          field: "password",
        },
        { status: 400 },
      );
    }

    // Create JWT Token
    const token = generateToken(user.id, user.username, user.email);

    // Update Last Seen And Online Status
    await supabaseServer
      .from("users")
      .update({
        status: "online",
        last_seen: new Date().toISOString(),
      })
      .eq("id", user.id);

    // Login Successful
    return NextResponse.json<ApiResponse<LoginResponse>>(
      {
        success: true,
        message: "Login successful",

        data: {
          token: token,
          expiresDays: 7,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone_number: user.phone_number,
            full_name: user.full_name,
            profile_image: user.profile_image,
            bio: user.bio,
            last_seen: user.last_seen,
            status: user.status,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /api/auth/login:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Server error occurred",
      },
      { status: 500 },
    );
  }
}
