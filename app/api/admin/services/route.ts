import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET() {
  await connectDB();
  const services = await Service.find().sort({ order: 1 }).lean();
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    const slug = (body.slug && slugify(body.slug)) || slugify(body.title);
    const exists = await Service.findOne({ slug });
    if (exists) {
      return NextResponse.json({ error: "A service with this slug already exists." }, { status: 409 });
    }
    const created = await Service.create({ ...body, slug });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create service." }, { status: 500 });
  }
}
