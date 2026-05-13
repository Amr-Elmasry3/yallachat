import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";

// Types
type TokenName = {
  tokenName: string;
};
type Token = {
  token: string;
};
type SetToken = TokenName & {
  token: string;
  expireDays: number;
};
type RemoveToken = TokenName & Token;
type CheckToken = TokenName & {
  falseUrl: string;
  rightUrl: string;
  request: NextRequest;
};

// Set Token => Work On Client Component Or Server Component
export async function setToken({
  tokenName,
  token,
  expireDays,
}: SetToken): Promise<void> {
  const expires = new Date();
  expires.setDate(expires.getDate() + expireDays);

  // If Server Component
  if (typeof document === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    cookieStore.set(tokenName, token, {
      expires: expires,
      path: "/",
    });
    return;
  }

  // If Client Component
  document.cookie = `${tokenName}=${token}; expires=${expires.toUTCString()}; path=/`;
}

// Get Token => Work On Client Component Or Server Component
export async function getToken({
  tokenName,
}: TokenName): Promise<string | undefined> {
  // If Server Component
  if (typeof document === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    return cookieStore.get(tokenName)?.value;
  }

  // If Client Component
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${tokenName}=`))
    ?.split("=")[1];
}

// Remove Token => Work On Client Component Or Server Component
export async function removeToken({
  tokenName,
  token,
}: RemoveToken): Promise<void> {
  // If Server Component
  if (typeof document === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    cookieStore.set(tokenName, token, {
      expires: new Date(0),
      path: "/",
    });
    return;
  }

  // If Client Component
  document.cookie = `${tokenName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// Check Token
export async function checkToken({
  tokenName,
  falseUrl,
  rightUrl,
  request,
}: CheckToken): Promise<NextResponse> {
  const token = await getToken({ tokenName });
  const secret = process.env.JWT_SECRET;
  const currentPath = request.nextUrl.pathname;
  const authPaths = ["/login", "/register", "/"];

  // If Not Found Token
  if (!token || !secret) {
    if (authPaths.includes(currentPath)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL(falseUrl, request.url));
    }
  }

  // If Found Token => (Check If Is Expire Or Not)
  try {
    const decoded = jwt.verify(token as string, secret as string) as JwtPayload;

    const expTime = decoded.exp ?? 0;
    const currentTime = new Date().getTime() / 1000;

    if (expTime > currentTime) {
      // If Token Is Valid
      if (authPaths.includes(currentPath)) {
        return NextResponse.redirect(new URL(rightUrl, request.url));
      } else {
        return NextResponse.next();
      }
    } else {
      // If Token Is Not Valid
      if (authPaths.includes(currentPath)) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL(falseUrl, request.url));
      }
    }
  } catch (error) {
    console.error(error);
    // verification failed -> redirect to falseUrl
    if (authPaths.includes(currentPath)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL(falseUrl, request.url));
    }
  }
}
