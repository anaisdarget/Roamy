import "server-only";
import { createHmac, randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "@/lib/config/env";

export const SESSION_COOKIE = "roamy_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function sign(email: string): string {
  return createHmac("sha256", env.SESSION_SECRET).update(email).digest("base64url");
}

export function createSessionValue(email: string): string {
  return `${Buffer.from(email, "utf8").toString("base64url")}.${sign(email)}`;
}

export function readSessionValue(value: string | undefined): string | null {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  let email: string;
  try {
    email = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expected = sign(email);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? email : null;
}

export async function getSessionEmail(): Promise<string | null> {
  const store = await cookies();
  return readSessionValue(store.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function generateMagicToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  return { token, tokenHash };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
