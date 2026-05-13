// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Types
import { ApiResponse, UserProfile } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    const { data: user, error } = await supabaseServer
      .from("users")
      .select(
        "id, username, email, phone_number, profile_image, bio, status, last_seen, created_at",
      )
      .eq("id", userId)
      .single();

    if (error || !user) {
      console.error("Error fetching user:", error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<UserProfile>>({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in GET /api/users/[userId]:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
