import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AdminUser } from "@/models/AdminUser";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { verifyCredentials, hashPassword, generateSalt } from "@/lib/auth-db";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newUsername, newPassword } = await request.json();

    if (!currentPassword || !newUsername || !newPassword) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const isValid = await verifyCredentials(session.username, currentPassword);
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    await connectDB();

    const salt = generateSalt();
    const hashedPassword = hashPassword(newPassword, salt);

    let admin = await AdminUser.findOne({ username: session.username });
    if (admin) {
      admin.username = newUsername;
      admin.password = hashedPassword;
      admin.salt = salt;
      await admin.save();
    } else {
      admin = new AdminUser({
        username: newUsername,
        password: hashedPassword,
        salt,
      });
      await admin.save();
    }

    const res = NextResponse.json({ ok: true, message: "Credentials updated. Please log in again." });
    res.cookies.set({
      name: SESSION_COOKIE,
      value: "",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (err) {
    console.error("Credentials update error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
