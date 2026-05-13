// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Types
import { ApiResponse, MessagesPageData } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const before = searchParams.get("before"); // Date of last visible message
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!conversationId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "conversationId is required" },
        { status: 400 },
      );
    }

    // Building the query
    let query = supabaseServer
      .from("messages")
      .select(
        `
        *,
        sender:users (
          id,
          username,
          email,
          profile_image,
          status
        )
      `,
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(limit);

    // If there is a "before" field, change it to a "Date" field.
    let beforeDate = null;
    if (before) {
      beforeDate = new Date(before);

      // If the conversion fails, a clear error message will appear.
      if (isNaN(beforeDate.getTime())) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: "Invalid before date format" },
          { status: 400 },
        );
      }
    }

    // In the query, use beforeDate
    if (beforeDate) {
      query = query.lt("created_at", beforeDate.toISOString());
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error("Error fetching old messages:", error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to fetch messages" },
        { status: 500 },
      );
    }

    // Ascending order (oldest to newest) for display purposes
    const sortedMessages = messages?.reverse() || [];

    // Determine if there are older messages
    const hasMore = messages?.length === limit;

    return NextResponse.json<ApiResponse<MessagesPageData>>({
      success: true,
      data: {
        messages: sortedMessages,
        hasMore,
        count: sortedMessages.length,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/messages/old:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
