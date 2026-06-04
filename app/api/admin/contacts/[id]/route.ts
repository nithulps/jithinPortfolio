import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const updated = await Contact.findByIdAndUpdate(
      params.id,
      { read: body.read },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Could not update message." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Contact.findByIdAndDelete(params.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete message." }, { status: 500 });
  }
}
