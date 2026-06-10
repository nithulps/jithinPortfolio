import { NextResponse } from "next/server";
import { getAbout } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Streams the uploaded resume with a Content-Disposition header so the browser
// downloads it as a properly named PDF. PDFs are stored on Cloudinary as raw,
// extensionless files (a ".pdf" URL is blocked with 401 by default), so we
// re-label the response here with the correct type and filename.
export async function GET() {
  const about = await getAbout();
  if (!about?.resumeUrl) {
    return NextResponse.json({ error: "No resume uploaded." }, { status: 404 });
  }

  let buffer: ArrayBuffer;
  try {
    const upstream = await fetch(about.resumeUrl, { cache: "no-store" });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Could not fetch resume (${upstream.status}).` },
        { status: 502 }
      );
    }
    buffer = await upstream.arrayBuffer();
  } catch {
    return NextResponse.json({ error: "Could not fetch resume." }, { status: 502 });
  }

  const safeName =
    (about.name ? `${about.name}_Resume` : "Resume")
      .replace(/[^a-z0-9_-]+/gi, "_")
      .replace(/^_|_$/g, "") || "Resume";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
      "Content-Length": String(buffer.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
