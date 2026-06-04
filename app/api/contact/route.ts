import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, projectType, budget, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    await connectDB();
    await Contact.create({
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      projectType: String(projectType || "").slice(0, 200),
      budget: String(budget || "").slice(0, 200),
      message: String(message).slice(0, 5000),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
