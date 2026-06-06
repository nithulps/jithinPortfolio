import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { About } from "@/models/About";
import { Page } from "@/models/Page";
import type { ProjectDTO, ServiceDTO, AboutDTO, PageDTO } from "@/types";

// Re-export so existing `@/lib/data` type imports keep working.
export type { ProjectDTO, ServiceDTO, AboutDTO, PageDTO };

// Convert Mongoose docs to plain, serialisable objects for React props.
function serialize<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export async function getAbout(): Promise<AboutDTO | null> {
  try {
    await connectDB();
    const doc = await About.findOne({ key: "main" }).lean();
    return doc ? serialize<AboutDTO>(doc) : null;
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<ProjectDTO[]> {
  try {
    await connectDB();
    const docs = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    return serialize<ProjectDTO[]>(docs);
  } catch {
    return [];
  }
}

export async function getFeaturedProjects(limit = 4): Promise<ProjectDTO[]> {
  try {
    await connectDB();
    const docs = await Project.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();
    const list = serialize<ProjectDTO[]>(docs);
    if (list.length > 0) return list;
    // fall back to most recent if nothing is flagged featured
    const recent = await Project.find().sort({ order: 1, createdAt: -1 }).limit(limit).lean();
    return serialize<ProjectDTO[]>(recent);
  } catch {
    return [];
  }
}

export async function getProject(slug: string): Promise<ProjectDTO | null> {
  try {
    await connectDB();
    const doc = await Project.findOne({ slug }).lean();
    return doc ? serialize<ProjectDTO>(doc) : null;
  } catch {
    return null;
  }
}

export async function getServices(): Promise<ServiceDTO[]> {
  try {
    await connectDB();
    const docs = await Service.find().sort({ order: 1 }).lean();
    return serialize<ServiceDTO[]>(docs);
  } catch {
    return [];
  }
}

const BUILT_IN_SEEDS = [
  { title: "Projects", slug: "projects", builtIn: true, builtInKey: "projects", showInNavbar: true, showOnHomepage: true, order: 1 },
  { title: "Services", slug: "services", builtIn: true, builtInKey: "services", showInNavbar: true, showOnHomepage: true, order: 3 },
  { title: "About", slug: "about", builtIn: true, builtInKey: "about", showInNavbar: true, showOnHomepage: false, order: 4 },
  { title: "Contact", slug: "contact", builtIn: true, builtInKey: "contact", showInNavbar: true, showOnHomepage: false, order: 5 },
];

let seeded = false;
async function ensureBuiltInPages() {
  if (seeded) return;
  try {
    const count = await Page.countDocuments({ builtIn: true });
    if (count < BUILT_IN_SEEDS.length) {
      for (const bp of BUILT_IN_SEEDS) {
        try {
          const { builtIn, builtInKey, slug, ...rest } = bp;
          await Page.findOneAndUpdate(
            { slug },
            { $set: { builtIn, builtInKey }, $setOnInsert: { slug, ...rest } },
            { upsert: true }
          );
        } catch {
          // ignore per-document errors
        }
      }
    }
  } catch {
    // ignore seeding errors
  }
  seeded = true;
}

export async function getPages(): Promise<PageDTO[]> {
  try {
    await connectDB();
    const docs = await Page.find().sort({ order: 1, createdAt: -1 }).lean();
    return serialize<PageDTO[]>(docs);
  } catch {
    return [];
  }
}

const BUILT_IN_SLUGS = ["projects", "services", "about", "contact"];

export async function getNavPages(): Promise<PageDTO[]> {
  try {
    await connectDB();
    // Only return custom pages; built-in nav links are hardcoded in Header
    const docs = await Page.find({
      showInNavbar: true,
      builtIn: { $ne: true },
      slug: { $nin: BUILT_IN_SLUGS },
    }).sort({ order: 1 }).lean();
    return serialize<PageDTO[]>(docs);
  } catch {
    return [];
  }
}

export async function getHomepagePages(): Promise<PageDTO[]> {
  try {
    await connectDB();
    await ensureBuiltInPages();
    const docs = await Page.find({ showOnHomepage: true }).sort({ order: 1 }).lean();
    // Fill missing defaults for fields added after initial creation
    const filled = docs.map((d: Record<string, unknown>) => ({
      ...d,
      displayMode: d.displayMode || "grid",
      gridColumns: d.gridColumns || 2,
      sections: ((d.sections as Array<Record<string, unknown>>) || []).map((s) => ({
        ...s,
        showOnHomepage: s.showOnHomepage ?? false,
        sectionOverlayTitle: s.sectionOverlayTitle ?? "",
        sectionOverlaySub: s.sectionOverlaySub ?? "",
      })),
    }));
    return serialize<PageDTO[]>(filled);
  } catch {
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<PageDTO | null> {
  try {
    await connectDB();
    const doc = await Page.findOne({ slug }).lean();
    return doc ? serialize<PageDTO>(doc) : null;
  } catch {
    return null;
  }
}

export async function getPageSection(
  pageSlug: string,
  sectionSlug: string
): Promise<{ page: PageDTO; section: PageDTO["sections"][number] } | null> {
  try {
    await connectDB();
    const doc = await Page.findOne({ slug: pageSlug }).lean();
    if (!doc) return null;
    const page = serialize<PageDTO>(doc);
    const toSlug = (t: string) => t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const section = page.sections.find(
      (s) => s.sectionSlug === sectionSlug || toSlug(s.sectionTitle) === sectionSlug
    );
    if (!section) return null;
    return { page, section };
  } catch {
    return null;
  }
}
