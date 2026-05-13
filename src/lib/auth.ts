import bcrypt from "bcryptjs";

import { NextRequest } from "next/server";

import { getToken } from "./tokenManager";

// Import Types
import { VerifyToken } from "./types";

import jwt, { Secret } from "jsonwebtoken";

// This Is Function For Password Encryption => (Register)
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// This Is Function For Password Comparison => (Login)
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// This Is Function To Create JWT Token => (Login)
export const generateToken = (
  userId: string,
  username: string,
  email: string,
): string => {
  return jwt.sign(
    { userId, username, email, iat: Math.floor(Date.now() / 1000) },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );
};

// This Is Function To Verfiy Token
export const verifyToken = async (
  tokenPlace: "headers" | "cookies",
  request?: NextRequest,
): Promise<VerifyToken | null> => {
  try {
    let token: string | undefined;

    if (tokenPlace === "headers") {
      const authHeader = request?.headers.get("authorization");

      if (!authHeader) return null;

      token = authHeader.replace("Bearer ", "");
    } else {
      token = await getToken({ tokenName: "yalla_chat_user_token" });
    }

    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as Secret,
    );

    return { decoded, token };
  } catch (error) {
    console.error(error);

    return null;
  }
};
