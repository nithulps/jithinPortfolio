import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const ContactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    projectType: { type: String, default: "" },
    budget: { type: String, default: "" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type ContactType = InferSchemaType<typeof ContactSchema> & { _id: string };

export const Contact: Model<ContactType> =
  (mongoose.models.Contact as Model<ContactType>) ||
  mongoose.model<ContactType>("Contact", ContactSchema);
