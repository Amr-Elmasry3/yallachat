// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import My Types
import { ApiResponse, Message } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const {
      conversationId,
      senderId,
      content,
      replyToId,
      type = "text",
      mediaUrls = [],
      fileData = [],
    } = await request.json();

    // Validation: => Conversation Id & User ID Sholud Be Found
    if (!conversationId || !senderId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Missing required info" },
        { status: 400 },
      );
    }

    // Validation: => Check Text
    if (type === "text" && !content) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Text message must have content" },
        { status: 400 },
      );
    }

    // Validation: => Check Files (Images, Videos, Audios, Files)
    if (type !== "text" && mediaUrls.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Media message must have at least one media URL",
        },
        { status: 400 },
      );
    }

    // Make Sure The User Is Participating In This Conversation
    const { data: participant, error: participantError } = await supabaseServer
      .from("conversation_participants")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("user_id", senderId)
      .single();

    if (participantError || !participant) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "You are not a participant in this conversation",
        },
        { status: 403 },
      );
    }

    // Prepare Message Data
    const messageData = {
      conversation_id: conversationId,
      sender_id: senderId,
      content: content || null,
      type: type,
      reply_to_id: replyToId || null,
      status: "sent",
      created_at: new Date().toISOString(),
      media_urls: mediaUrls,
      metadata: fileData,
    };

    // Add Message
    const { data: message, error: messageError } = await supabaseServer
      .from("messages")
      .insert([messageData])
      .select()
      .single();

    if (messageError) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to send message" },
        { status: 500 },
      );
    }

    // Update The Last Message In The Conversation
    await supabaseServer
      .from("conversations")
      .update({
        last_message_id: message.id,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    return NextResponse.json<ApiResponse<Message>>({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error in POST /api/messages:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Server error occurred",
      },
      { status: 500 },
    );
  }
}
