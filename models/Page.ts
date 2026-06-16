import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    heading: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    // Categories group sections on the page. Each has its own cover media
    // and overlay text (same UI as a project cover).
    categories: {
      type: [
        {
          _id: false,
          key: { type: String, default: "" }, // stable id, referenced by sections
          name: { type: String, default: "" },
          coverImage: { type: String, default: "" }, // image / video / PDF
          overlayTitle: { type: String, default: "" },
          overlaySubtitle: { type: String, default: "" },
        },
      ],
      default: [],
    },
    sections: {
      type: [
        {
          sectionTitle: { type: String, default: "" },
          sectionSlug: { type: String, default: "" },
          sectionBody: { type: String, default: "" },
          sectionImage: { type: String, default: "" },
          sectionFiles: { type: [String], default: [] },
          showOnHomepage: { type: Boolean, default: false },
          sectionOverlayTitle: { type: String, default: "" },
          sectionOverlaySub: { type: String, default: "" },
          categoryKey: { type: String, default: "" }, // which category this maps to
        },
      ],
      default: [],
    },
    showInNavbar: { type: Boolean, default: false },
    navLabel: { type: String, default: "" }, // label shown in navbar (falls back to title)
    showOnHomepage: { type: Boolean, default: false },
    homepageExcerpt: { type: String, default: "" }, // short text shown on homepage section
    order: { type: Number, default: 0 },
    builtIn: { type: Boolean, default: false }, // true for system pages (hero, projects, etc.)
    builtInKey: { type: String, default: "" }, // key like "hero", "projects", "competency", "services", "about", "contact"
    displayMode: { type: String, default: "grid", enum: ["list", "grid"] }, // how sections render
    gridColumns: { type: Number, default: 2, enum: [2, 3] }, // columns when displayMode is grid
  },
  { timestamps: true }
);

export type PageType = InferSchemaType<typeof PageSchema> & { _id: string };

export const Page: Model<PageType> =
  (mongoose.models.Page as Model<PageType>) ||
  mongoose.model<PageType>("Page", PageSchema);
