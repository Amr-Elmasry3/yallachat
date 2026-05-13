// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Auth Functions
import { verifyToken } from "@/lib/auth";

// Import Token Manager Functions
import { removeToken } from "@/lib/tokenManager";

// Import My Types
import { ApiResponse } from "@/lib/types";

import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    // Verify token
    const verifyTokenConfig = await verifyToken("headers", request);

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

    // Get Conversation Id
    const { conversationId } = await params;

    if (!conversationId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "conversation id is missing" },
        { status: 400 },
      );
    }

    // Get Conversation Data
    const { data: conversation, error: convError } = await supabaseServer
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Conversation not found" },
        { status: 404 },
      );
    }

    // Bring In Participants To The Conversation
    const { data: participants, error: partError } = await supabaseServer
      .from("conversation_participants")
      .select(
        `
        user_id,
        role,
        joined_at,
        last_read_at,
        user:users (
          id,
          username,
          email,
          phone_number,
          profile_image,
          bio,
          status,
          last_seen
        )
      `,
      )
      .eq("conversation_id", conversationId);

    if (partError) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to fetch participants" },
        { status: 500 },
      );
    }

    // In The Case Of A Direct Chat, We Provide The Other Friend's Details
    let friend = null;
    let groupData = null;

    if (conversation.type === "direct") {
      friend = participants?.find((p) => p.user_id !== userId)?.user || null;
    } else {
      // For Group Chats, Provide Group Data
      groupData = {
        name: conversation.name,
        created_by: conversation.created_by,
        participants_count: participants?.length || 0,
      };
    }

    // Fetch the First 20 Messages In The Conversation With Sender Data
    const { data: messages, error: msgError } = await supabaseServer
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
      .limit(20);

    if (msgError) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to fetch messages" },
        { status: 500 },
      );
    }

    // Sort The Messages In Ascending Order (Oldest To Newest)
    const sortedMessages = messages?.reverse() || [];

    return NextResponse.json<ApiResponse<unknown>>({
      success: true,
      data: {
        conversation: {
          id: conversation.id,
          type: conversation.type,
          name: conversation.name,
          created_at: conversation.created_at,
          last_message_at: conversation.last_message_at,
        },
        friend: friend, // For Direct Messages
        group: groupData, // For Group Messages
        user,
        participants: participants, // All Participants
        messages: sortedMessages,
        messagesCount: sortedMessages.length,
        hasMore: sortedMessages.length === 20, // If there are more messages to load
      },
    });
  } catch (error) {
    console.error("Error in GET /api/conversations/conversationsId:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Server error occurred",
      },
      { status: 500 },
    );
  }
}
