import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const AdminUserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, default: "" },
  },
  { timestamps: true }
);

export type AdminUserType = InferSchemaType<typeof AdminUserSchema> & { _id: string };

export const AdminUser: Model<AdminUserType> =
  (mongoose.models.AdminUser as Model<AdminUserType>) ||
  mongoose.model<AdminUserType>("AdminUser", AdminUserSchema);
