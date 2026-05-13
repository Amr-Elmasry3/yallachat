// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Password Functions
import { hashPassword } from "@/lib/auth";

// Import My Types
import { ApiResponse, RegisterResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, phone } = await request.json();

    // Check Username Is Used Already Or Not
    const { data: existingUsername } = await supabaseServer
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUsername) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "The username is already in use.",
          field: "username",
        },
        { status: 400 },
      );
    }

    // Check Email Is Used Already Or Not
    const { data: existingEmail } = await supabaseServer
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingEmail) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "The email address is already in use.",
          field: "email",
        },
        { status: 400 },
      );
    }

    // Check Phone Number Is Used Already Or Not (If Provided)
    if (phone && phone.trim() !== "") {
      const { data: existingPhone } = await supabaseServer
        .from("users")
        .select("id")
        .eq("phone_number", phone)
        .single();

      if (existingPhone) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            message: "The phone number is already in use.",
            field: "phone",
          },
          { status: 400 },
        );
      }
    }

    // Password Encryption
    const hashedPassword = await hashPassword(password);

    // Save Data In Database
    const { data: user, error } = await supabaseServer
      .from("users")
      .insert([
        {
          username,
          email,
          password_hash: hashedPassword,
          phone_number: phone,
          profile_image: null,
          bio: null,
          status: "offline",
          last_seen: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "An error occurred during create account.",
        },
        { status: 500 },
      );
    }

    // Create Account Successfully
    return NextResponse.json<ApiResponse<RegisterResponse>>(
      {
        success: true,
        message: "Account created successfully",
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone_number: user.phone_number,
            profile_image: user.profile_image,
            bio: user.bio,
            last_seen: user.last_seen,
            status: user.status,
          },
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    // If Return Error (UnExpected Error)
    console.error("Error in POST /api/auth/register:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Server error occurred",
      },
      { status: 500 },
    );
  }
}
