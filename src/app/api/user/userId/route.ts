// Import Next Types
import { NextResponse } from "next/server";

// Import Auth Functions
import { verifyToken } from "@/lib/auth";

// Import Token Manager Functions
import { removeToken } from "@/lib/tokenManager";

// Import My Types
import { ApiResponse, UserIdData } from "@/lib/types";

import jwt from "jsonwebtoken";

export async function GET() {
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

    // Get User Id
    const userId = (verifyTokenConfig?.decoded as jwt.JwtPayload).userId;

    return NextResponse.json<ApiResponse<UserIdData>>(
      {
        success: true,
        message: "Get User Id Successful",
        data: {
          id: userId,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error in POST /api/user/status:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Server error occurred",
      },
      { status: 500 },
    );
  }
}
