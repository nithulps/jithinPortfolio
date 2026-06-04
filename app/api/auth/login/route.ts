import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkCredentials, createSession, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!checkCredentials(username || "", password || "")) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const token = await createSession(username);
    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
