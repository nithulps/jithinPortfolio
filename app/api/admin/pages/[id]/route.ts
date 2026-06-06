import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Page } from "@/models/Page";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

const BUILT_IN_SLUGS = new Set(["projects", "services", "about", "contact"]);

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();

    // Strip immutable / system fields that the frontend sends back
    const { _id, __v, createdAt, updatedAt, ...updateData } = body;

    const existing = await Page.findById(params.id);
    if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

    // For built-in pages, only allow updating visibility/order fields
    if (existing.builtIn || BUILT_IN_SLUGS.has(existing.slug)) {
      const allowed: Record<string, unknown> = {};
      const editableKeys = ["showInNavbar", "navLabel", "showOnHomepage", "homepageExcerpt", "order"];
      for (const k of editableKeys) {
        if (k in updateData) allowed[k] = updateData[k];
      }
      const updated = await Page.findByIdAndUpdate(params.id, allowed, { new: true });
      return NextResponse.json(updated);
    }

    if (updateData.slug) updateData.slug = slugify(updateData.slug);

    // Strip subdocument _id fields from sections to avoid cast errors
    if (Array.isArray(updateData.sections)) {
      updateData.sections = updateData.sections.map(
        ({ _id: _secId, ...sec }: Record<string, unknown>) => sec
      );
    }

    const updated = await Page.findByIdAndUpdate(params.id, { $set: updateData }, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/admin/pages/[id] error:", err);
    return NextResponse.json({ error: "Could not update page." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const existing = await Page.findById(params.id);
    if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (existing.builtIn || BUILT_IN_SLUGS.has(existing.slug)) {
      return NextResponse.json({ error: "Cannot delete a built-in page." }, { status: 403 });
    }
    await Page.findByIdAndDelete(params.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete page." }, { status: 500 });
  }
}
