// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Types
import { ApiResponse, MessageStatusUpdateResponse } from "@/lib/types";

export async function PATCH(request: NextRequest) {
  try {
    const { status, conversationId, userId } = await request.json();

    if (!status || !userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "status and userId are required" },
        { status: 400 },
      );
    }

    if (!["delivered", "seen"].includes(status)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Status must be 'delivered' or 'seen'" },
        { status: 400 },
      );
    }

    let updatedMessages = [];

    // Delivered status: All messages sent in any conversation → delivered
    if (status === "delivered") {
      const { data, error } = await supabaseServer
        .from("messages")
        .update({ status: "delivered" })
        .eq("status", "sent")
        .neq("sender_id", userId) // Not the messages I sent
        .select();

      if (error) {
        console.error("Error updating to delivered:", error);
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: "Failed to update messages to delivered" },
          { status: 500 },
        );
      }

      updatedMessages = data || [];
    }

    // Seen status: All messages sent or delivered in a specific conversation → seen
    if (status === "seen") {
      if (!conversationId) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            message: "conversationId is required for seen status",
          },
          { status: 400 },
        );
      }

      const { data, error } = await supabaseServer
        .from("messages")
        .update({ status: "seen" })
        .eq("conversation_id", conversationId)
        .in("status", ["sent", "delivered"])
        .neq("sender_id", userId) // Not the messages I sent
        .select();

      if (error) {
        console.error("Error updating to seen:", error);
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: "Failed to update messages to seen" },
          { status: 500 },
        );
      }

      updatedMessages = data || [];
    }

    return NextResponse.json<ApiResponse<MessageStatusUpdateResponse>>({
      success: true,
      message: `Updated ${updatedMessages.length} messages to ${status}`,
      data: {
        count: updatedMessages.length,
        messages: updatedMessages,
        status,
      },
    });
  } catch (error) {
    console.error("Error in PATCH /api/messages/status:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
