import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

// Protect the admin UI and admin API routes.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  const isLoginPage = pathname === "/admin/login";
  const isAuthApi = pathname.startsWith("/api/auth");

  // Allow the login page and auth endpoints through.
  if (isLoginPage || isAuthApi) {
    // If already logged in, bounce away from the login page.
    if (isLoginPage && session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Guard /admin/** pages.
  if (pathname.startsWith("/admin") && !session) {
    const url = new URL("/admin/login", request.url);
    return NextResponse.redirect(url);
  }

  // Guard /api/admin/** endpoints.
  if (pathname.startsWith("/api/admin") && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};
