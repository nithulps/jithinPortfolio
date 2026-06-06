import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-insecure-secret-change-me"
);

export const SESSION_COOKIE = "admin_session";

export interface SessionPayload {
  username: string;
  [key: string]: unknown;
}

export async function createSession(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
