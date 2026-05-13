// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Auth Functions
import { verifyToken } from "@/lib/auth";

// Import Token Manager Functions
import { removeToken } from "@/lib/tokenManager";

// Import My Types And Interfaces
import { ApiResponse } from "@/lib/types";

import jwt from "jsonwebtoken";

// Endpoint => For Add Friend
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

    const userId = (verifyTokenConfig?.decoded as jwt.JwtPayload).userId;
    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid token payload" },
        { status: 401 },
      );
    }

    // Get Data
    const { friendName, friendPhone } = await request.json();

    // Search For A Friend By Name And Phone Number
    const { data: friend, error: searchError } = await supabaseServer
      .from("users")
      .select("id, username, email, phone_number")
      .ilike("username", `%${friendName}%`)
      .eq("phone_number", friendPhone)
      .single();

    if (searchError || !friend) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "There is no user with this name and phone number.",
        },
        { status: 404 },
      );
    }

    // Make Sure User's Not Adding Himself.
    if (friend.id === userId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "You cannot add yourself as a friend.",
        },
        { status: 400 },
      );
    }

    // Make Sure The Friend Has Not Been Added Before.
    const { data: existingFriendship, error: checkError } = await supabaseServer
      .from("friendships")
      .select("*")
      .eq("user_id", userId)
      .eq("friend_id", friend.id)
      .maybeSingle();

    if (existingFriendship || checkError) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "This user is already added to your friends list.",
        },
        { status: 400 },
      );
    }

    // Add Friend
    const { error: insertError } = await supabaseServer
      .from("friendships")
      .insert([
        {
          user_id: userId,
          friend_id: friend.id,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "An error occurred while adding your friend.",
        },
        { status: 500 },
      );
    }

    // Establish Direct Communication Between Them.
    // First: We Conduct The Conversation.
    const { data: conversation, error: convError } = await supabaseServer
      .from("conversations")
      .insert([
        {
          type: "direct",
          created_by: userId,
        },
      ])
      .select()
      .single();

    // We Won't Return An Error Here Because The Friendship Has Been Established.
    if (convError) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Error creating conversation" },
        { status: 500 },
      );
    }
    // Add Participants To The Conversation
    else {
      const participants = [
        { conversation_id: conversation.id, user_id: userId, role: "member" },
        {
          conversation_id: conversation.id,
          user_id: friend.id,
          role: "member",
        },
      ];

      await supabaseServer
        .from("conversation_participants")
        .insert(participants);
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Friend successfully added",
    });
  } catch (error: unknown) {
    console.error("Error in POST /api/friends:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "An error occurred during add friend" },
      { status: 500 },
    );
  }
}

// Endpoint => To Get All Friend
export async function GET(request: NextRequest) {
  try {
    // Verify token
    const verifyTokenConfig = await verifyToken("headers", request);

    if (!verifyTokenConfig?.token || !verifyTokenConfig?.decoded) {
      if (!verifyTokenConfig?.decoded) {
        await removeToken({
          tokenName: "yalla_chat_user_token",
          token: verifyTokenConfig?.token as string,
        });
      }
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "No valid session found" },
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

    // Bring friends
    const { data: friendships, error: friendsError } = await supabaseServer
      .from("friendships")
      .select(
        `
        id,
        created_at,
        user:users!friendships_user_id_fkey (
          id,
          username,
          email,
          phone_number,
          profile_image,
          bio,
          status,
          last_seen
        ),
        friend:users!friendships_friend_id_fkey (
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
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

    if (friendsError) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to fetch friends" },
        { status: 500 },
      );
    }

    // Bring all live chats at once
    const { data: conversations } = await supabaseServer
      .from("conversations")
      .select(
        `
        id,
        conversation_participants (
          user_id
        )
      `,
      )
      .eq("type", "direct");

    // Retrieve the last (undeleted) message and the number of unread messages for each conversation.
    const friendsWithDetails = await Promise.all(
      (friendships || []).map(async (friendship) => {
        // تحديد الصديق
        const userRecord = Array.isArray(friendship.user)
          ? friendship.user[0]
          : friendship.user;
        const friendRecord = Array.isArray(friendship.friend)
          ? friendship.friend[0]
          : friendship.friend;

        const isCurrentUserUser = userRecord?.id === userId;
        const friendData = isCurrentUserUser ? friendRecord : userRecord;
        const friendId = friendData?.id;

        if (!friendId) return null;

        // Search for conversationId
        let conversationId = null;
        for (const conv of conversations || []) {
          const participants = conv.conversation_participants || [];
          const participantIds = participants.map((p) => p.user_id);
          if (
            participantIds.includes(userId) &&
            participantIds.includes(friendId)
          ) {
            conversationId = conv.id;
            break;
          }
        }

        let lastMessage = null;
        let unreadCount = 0;

        if (conversationId) {
          // Retrieve last message (is_deleted = false)
          const { data: lastMsgData } = await supabaseServer
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .eq("is_deleted", false) // But the ones that haven't been deleted
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (lastMsgData) {
            lastMessage = {
              id: lastMsgData.id,
              content: lastMsgData.content,
              type: lastMsgData.type,
              media_urls: lastMsgData.media_urls,
              metadata: lastMsgData.metadata,
              created_at: lastMsgData.created_at,
              sender_id: lastMsgData.sender_id,
              status: lastMsgData.status,
              is_deleted: lastMsgData.is_deleted,
              isFromMe: lastMsgData.sender_id === userId,
            };
          }

          // Retrieve the number of unread (non-deleted) messages
          const { count } = await supabaseServer
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conversationId)
            .eq("is_deleted", false) // But the ones that haven't been deleted
            .neq("sender_id", userId)
            .neq("status", "seen");

          unreadCount = count || 0;
        }

        return {
          friendshipId: friendship.id,
          friendSince: friendship.created_at,
          conversationId,
          ...friendData,
          lastMessage,
          unreadCount,
        };
      }),
    );

    const validFriends = friendsWithDetails.filter((f) => f !== null);

    return NextResponse.json<ApiResponse<unknown>>({
      success: true,
      data: {
        count: validFriends.length,
        friends: validFriends,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/friends:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "An error occurred during get friends list" },
      { status: 500 },
    );
  }
}

// Endpoin => For Delete One Friend
export async function DELETE(request: NextRequest) {
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

    const userId = (verifyTokenConfig?.decoded as jwt.JwtPayload).userId;
    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid token payload" },
        { status: 401 },
      );
    }

    // Get Data
    const { searchParams } = new URL(request.url);
    const friendId = searchParams.get("friendId");
    const conversationId = searchParams.get("conversationId");

    if (!friendId || !conversationId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "There is no friend id or coversation id",
        },
        { status: 404 },
      );
    }

    // Delete from friendships (friendship relationship)
    const { error: friendshipError } = await supabaseServer
      .from("friendships")
      .delete()
      .or(
        `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`,
      );

    if (friendshipError) {
      console.error("Error deleting friendship:", friendshipError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to delete friendship" },
        { status: 500 },
      );
    }

    // If there is a conversationId, delete everything related to the conversation.
    if (conversationId) {
      // We remove the participants
      await supabaseServer
        .from("conversation_participants")
        .delete()
        .eq("conversation_id", conversationId);

      // We send messages
      await supabaseServer
        .from("messages")
        .delete()
        .eq("conversation_id", conversationId);

      // We have the same conversation
      await supabaseServer
        .from("conversations")
        .delete()
        .eq("id", conversationId);
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Friend removed successfully",
    });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/friends:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "An error occurred during delete friend" },
      { status: 500 },
    );
  }
}
