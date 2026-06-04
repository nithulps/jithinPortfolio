import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

// Singleton document holding the About-page + hero content.
const AboutSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true }, // always "main"
    name: { type: String, default: "Jithin" },
    heroPhrases: { type: [String], default: [] }, // rotating hero designation
    heroDescription: { type: String, default: "" },
    headline: { type: String, default: "" }, // about-page big headline
    aboutPhrases: { type: [String], default: [] }, // rotating "I love to test ..."
    bioParagraphs: { type: [String], default: [] },
    image: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    competencyText: { type: String, default: "" },
    socials: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export type AboutType = InferSchemaType<typeof AboutSchema> & { _id: string };

export const About: Model<AboutType> =
  (mongoose.models.About as Model<AboutType>) ||
  mongoose.model<AboutType>("About", AboutSchema);
