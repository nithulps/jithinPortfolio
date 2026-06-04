import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
// Allow larger media uploads
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    const folder = (formData.get("folder") as string) || "portfolio";
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToCloudinary(buffer, folder);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
