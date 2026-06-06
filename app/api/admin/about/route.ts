import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { About } from "@/models/About";

export const runtime = "nodejs";

export async function GET() {
  await connectDB();
  const about = await About.findOne({ key: "main" }).lean();
  return NextResponse.json(about || {});
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    // Strip Mongoose meta so editors can safely PUT the whole document.
    delete body._id;
    delete body.__v;
    delete body.createdAt;
    delete body.updatedAt;
    const updated = await About.findOneAndUpdate(
      { key: "main" },
      { ...body, key: "main" },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Could not save about content." }, { status: 500 });
  }
}
