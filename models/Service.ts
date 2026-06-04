import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    icon: { type: String, default: "" }, // raw inline SVG markup
    shortDescription: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    features: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ServiceType = InferSchemaType<typeof ServiceSchema> & { _id: string };

export const Service: Model<ServiceType> =
  (mongoose.models.Service as Model<ServiceType>) ||
  mongoose.model<ServiceType>("Service", ServiceSchema);
