import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Page } from "@/models/Page";

export const runtime = "nodejs";

export async function GET() {
  await connectDB();
  const pages = await Page.find().sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json(pages);
}
