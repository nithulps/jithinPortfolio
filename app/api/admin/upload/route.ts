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

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isVideo = file.type.startsWith("video/");
    const subFolder = isPdf ? "pdfs" : isVideo ? "videos" : "images";
    const resourceType = isPdf ? "raw" : "auto";
    const result = await uploadToCloudinary(buffer, `${folder}/${subFolder}`, resourceType);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
