import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    if (body.slug) body.slug = slugify(body.slug);
    const updated = await Service.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Could not update service." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Service.findByIdAndDelete(params.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete service." }, { status: 500 });
  }
}
