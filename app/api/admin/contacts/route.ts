import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

export const runtime = "nodejs";
// Never cache — always return the latest messages (Vercel would otherwise
// statically cache this GET handler and serve stale data).
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  await connectDB();
  const messages = await Contact.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(messages);
}
