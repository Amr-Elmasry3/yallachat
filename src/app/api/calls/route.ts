// Import Next Types
import { NextRequest, NextResponse } from "next/server";

// Import Supabase Functions
import { supabaseServer } from "@/lib/supabase/server";

// Import Auth Functions
import { verifyToken } from "@/lib/auth";

// Import Token Manager Functions
import { removeToken } from "@/lib/tokenManager";

// Import Types
import { InsertCall } from "@/lib/types";
import { ApiResponse, Call, CallsData } from "@/lib/types";

import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      callerId,
      receiverId,
      conversationId,
      status,
      startedAt,
      answeredAt,
      endedAt,
      duration,
    } = body;

    // التحقق من الحقول المطلوبة
    if (!callerId || !receiverId || !conversationId || !status) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message:
            "callerId, receiverId, conversationId, and status are required",
        },
        { status: 400 },
      );
    }

    // التحقق من صحة الحالة
    const validStatuses = [
      "pending",
      "active",
      "rejected",
      "canceled",
      "missed",
      "ended",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    // تجهيز البيانات للإدراج
    const insertData: InsertCall = {
      caller_id: callerId,
      receiver_id: receiverId,
      conversation_id: conversationId,
      status: status,
      started_at: null,
      answered_at: null,
      ended_at: null,
      duration: null,
    };

    if (startedAt) insertData.started_at = startedAt;
    if (answeredAt) insertData.answered_at = answeredAt;
    if (endedAt) insertData.ended_at = endedAt;
    if (duration !== undefined) insertData.duration = Math.round(duration);

    // إدراج المكالمة في قاعدة البيانات
    const { data: call, error } = await supabaseServer
      .from("calls")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating call:", error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to create call" },
        { status: 500 },
      );
    }

    return NextResponse.json<ApiResponse<Call>>({
      success: true,
      message: "Call created successfully",
      data: call,
    });
  } catch (error) {
    console.error("Error in POST /api/calls:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
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

    // جلب المكالمات اللي المستخدم فيها caller أو receiver
    const { data: calls, error } = await supabaseServer
      .from("calls")
      .select(
        `
        *,
        caller:users!calls_caller_id_fkey (
          id,
          username,
          email,
          profile_image
        ),
        receiver:users!calls_receiver_id_fkey (
          id,
          username,
          email,
          profile_image
        )
      `,
      )
      .or(`caller_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user calls:", error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to fetch calls" },
        { status: 500 },
      );
    }

    return NextResponse.json<ApiResponse<CallsData>>({
      success: true,
      data: {
        calls: calls || [],
        count: calls?.length || 0,
        userId,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/calls/user/[userId]:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
