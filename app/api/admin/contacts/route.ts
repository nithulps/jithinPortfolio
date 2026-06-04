import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

export const runtime = "nodejs";

export async function GET() {
  await connectDB();
  const messages = await Contact.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(messages);
}
