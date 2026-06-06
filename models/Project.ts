import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, default: "" }, // primary label, e.g. "Test Automation"
    tags: { type: [String], default: [] },
    excerpt: { type: String, default: "" },
    description: { type: String, default: "" }, // paragraphs separated by blank lines
    coverImage: { type: String, default: "" },
    visuals: { type: [String], default: [] }, // gallery image/video URLs
    client: { type: String, default: "" },
    role: { type: String, default: "" },
    year: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    overlayTitle: { type: String, default: "" },
    overlaySub: { type: String, default: "" },
  },
  { timestamps: true }
);

export type ProjectType = InferSchemaType<typeof ProjectSchema> & { _id: string };

export const Project: Model<ProjectType> =
  (mongoose.models.Project as Model<ProjectType>) ||
  mongoose.model<ProjectType>("Project", ProjectSchema);
