import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { About } from "@/models/About";
import type { ProjectDTO, ServiceDTO, AboutDTO } from "@/types";

// Re-export so existing `@/lib/data` type imports keep working.
export type { ProjectDTO, ServiceDTO, AboutDTO };

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
