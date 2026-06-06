import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { AdminUser } from "@/models/AdminUser";

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  try {
    await connectDB();
    const admin = await AdminUser.findOne({ username });
    if (admin) {
      if (admin.salt) {
        const hash = hashPassword(password, admin.salt);
        return admin.password === hash;
      }
      return admin.password === password;
    }
  } catch (err) {
    console.error("DB credentials verify error:", err);
  }

  // Fallback to env variables if no admin user exists in the database
  const u = process.env.ADMIN_USERNAME || "admin";
  const p = process.env.ADMIN_PASSWORD || "admin";
  return username === u && password === p;
}
