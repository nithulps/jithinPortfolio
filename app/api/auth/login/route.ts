import { NextResponse } from "next/server";
import { createSession, SESSION_COOKIE } from "@/lib/auth";
import { verifyCredentials } from "@/lib/auth-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const isValid = await verifyCredentials(username || "", password || "");
    if (!isValid) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const token = await createSession(username);

    // Set the cookie directly on the response so the Set-Cookie header is
    // reliably sent (mutating next/headers cookies() then returning a new
    // response can drop it in the App Router).
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
