import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Page } from "@/models/Page";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

const BUILT_IN_PAGES = [
  { title: "Projects", slug: "projects", builtIn: true, builtInKey: "projects", showInNavbar: true, showOnHomepage: true, order: 1 },
  { title: "Services", slug: "services", builtIn: true, builtInKey: "services", showInNavbar: true, showOnHomepage: true, order: 3 },
  { title: "About", slug: "about", builtIn: true, builtInKey: "about", showInNavbar: true, showOnHomepage: false, order: 4 },
  { title: "Contact", slug: "contact", builtIn: true, builtInKey: "contact", showInNavbar: true, showOnHomepage: false, order: 5 },
];

const BUILT_IN_SLUGS = new Set(BUILT_IN_PAGES.map((p) => p.slug));

async function seedBuiltIn() {
  for (const bp of BUILT_IN_PAGES) {
    try {
      const { builtIn, builtInKey, slug, ...rest } = bp;
      await Page.findOneAndUpdate(
        { slug },
        { $set: { builtIn, builtInKey }, $setOnInsert: { slug, ...rest } },
        { upsert: true }
      );
    } catch {
      // ignore duplicate-key or other per-document errors
    }
  }
}

export async function GET() {
  try {
    await connectDB();
    await seedBuiltIn();
    const pages = await Page.find().sort({ order: 1, createdAt: -1 }).lean();
    // Reliably mark built-in pages and fill missing defaults
    const result = pages.map((p) => {
      const bp = BUILT_IN_PAGES.find((b) => b.slug === p.slug);
      const sections = ((p.sections || []) as any[]).map((s) => ({
        ...s,
        sectionTitle: s.sectionTitle ?? "",
        sectionSlug: s.sectionSlug ?? "",
        sectionBody: s.sectionBody ?? "",
        sectionImage: s.sectionImage ?? "",
        sectionFiles: Array.isArray(s.sectionFiles) ? s.sectionFiles : [],
        showOnHomepage: s.showOnHomepage ?? false,
        sectionOverlayTitle: s.sectionOverlayTitle ?? "",
        sectionOverlaySub: s.sectionOverlaySub ?? "",
        categoryKey: s.categoryKey ?? "",
      }));
      const categories = ((p.categories || []) as any[]).map((c) => ({
        key: c.key ?? "",
        name: c.name ?? "",
        coverImage: c.coverImage ?? "",
        overlayTitle: c.overlayTitle ?? "",
        overlaySubtitle: c.overlaySubtitle ?? "",
      }));
      return {
        ...p,
        sections,
        categories,
        displayMode: p.displayMode || "grid",
        gridColumns: p.gridColumns || 2,
        builtIn: !!bp,
        builtInKey: bp ? bp.builtInKey : p.builtInKey || "",
      };
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    const slug = (body.slug && slugify(body.slug)) || slugify(body.title);

    // Prevent custom pages from using built-in slugs
    const reserved = BUILT_IN_PAGES.map((p) => p.slug);
    if (reserved.includes(slug)) {
      return NextResponse.json({ error: "This slug is reserved." }, { status: 409 });
    }

    const exists = await Page.findOne({ slug });
    if (exists) {
      return NextResponse.json({ error: "A page with this slug already exists." }, { status: 409 });
    }
    const created = await Page.create({ ...body, slug });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create page." }, { status: 500 });
  }
}
