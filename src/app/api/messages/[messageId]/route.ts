// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Types
import { ApiResponse, Message } from "@/lib/types";

// ================ GET: Message By Id================
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ messageId: string }>;
  },
) {
  try {
    const { messageId } = await params;

    if (!messageId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Message ID is required" },
        { status: 400 },
      );
    }

    const { data: message, error } = await supabaseServer
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
      .eq("id", messageId)
      .single();

    if (error || !message) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Message not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<Message>>({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Error in GET /api/messages/[messageId]:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}

// ================ DELETE: Delete a message (entire message or a single image)================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> },
) {
  try {
    const { messageId } = await params;

    const { searchParams } = new URL(request.url);
    const imageIndex = searchParams.get("imageIndex");

    if (!messageId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Message ID is required" },
        { status: 400 },
      );
    }

    // Fetch the current message
    const { data: message, error: fetchError } = await supabaseServer
      .from("messages")
      .select("media_urls, metadata, content")
      .eq("id", messageId)
      .single();

    if (fetchError || !message) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Message not found" },
        { status: 404 },
      );
    }

    let updatedMessage;

    // If there is an imageIndex (delete a specific element from media_urls)
    if (imageIndex !== null) {
      const index = parseInt(imageIndex);
      const mediaUrls = message.media_urls || [];
      const metadata = message.metadata || [];

      // If there are no media_urls at all
      if (!mediaUrls.length) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: "No media to delete" },
          { status: 400 },
        );
      }

      // If the index is out of range
      if (index < 0 || index >= mediaUrls.length) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: "Invalid index" },
          { status: 400 },
        );
      }

      // Delete element from arrays
      const newMediaUrls = [...mediaUrls];
      const newMetadata = [...metadata];
      newMediaUrls.splice(index, 1);
      newMetadata.splice(index, 1);

      // If there's no media left but still text, we can refresh without deleting the message.
      if (newMediaUrls.length === 0 && message.content) {
        const { data, error } = await supabaseServer
          .from("messages")
          .update({
            media_urls: [],
            metadata: [],
            updated_at: new Date().toISOString(),
          })
          .eq("id", messageId)
          .select()
          .single();

        if (error) throw error;
        updatedMessage = data;
      }
      // If there is no media and no text, delete the entire message.
      else if (newMediaUrls.length === 0 && !message.content) {
        const { data, error } = await supabaseServer
          .from("messages")
          .update({
            is_deleted: true,
            updated_at: new Date().toISOString(),
            media_urls: [],
            metadata: [],
          })
          .eq("id", messageId)
          .select()
          .single();

        if (error) throw error;
        updatedMessage = data;
      }
      // If there's still media, we'll update it.
      else {
        const { data, error } = await supabaseServer
          .from("messages")
          .update({
            media_urls: newMediaUrls,
            metadata: newMetadata,
            updated_at: new Date().toISOString(),
          })
          .eq("id", messageId)
          .select()
          .single();

        if (error) throw error;
        updatedMessage = data;
      }
    } else {
      // If there is no imageIndex (delete the entire message)
      const { data, error } = await supabaseServer
        .from("messages")
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq("id", messageId)
        .select()
        .single();

      if (error) throw error;
      updatedMessage = data;
    }

    return NextResponse.json<ApiResponse<Message>>({
      success: true,
      message:
        imageIndex !== null
          ? "Media deleted successfully"
          : "Message deleted successfully",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error in DELETE /api/messages/[messageId]:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
