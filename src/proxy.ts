import { type NextRequest, NextResponse } from "next/server";
import { checkToken } from "./lib/tokenManager";

export default async function proxy(request: NextRequest) {
  const response = await checkToken({
    tokenName: "yalla_chat_user_token",
    falseUrl: "/",
    rightUrl: "/dashboard/chats",
    request,
  });

  // Add custom headers to request for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-url", request.url);

  // If response is a redirect (from checkToken), return it
  if (response.status === 307 || response.status === 308) {
    return response;
  }

  // Otherwise, return response with custom headers added
  const nextResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return nextResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|pictures/).*)"],
};
