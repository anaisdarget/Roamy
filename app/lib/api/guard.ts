import { NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Simple fixed-window rate limiter for a single Node instance.
 * Production note: replace with Upstash Redis / Vercel KV for multi-instance.
 */
export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const bucket = { count: 1, resetAt: now + options.windowMs };
    buckets.set(key, bucket);
    return { ok: true, remaining: options.limit - 1, resetAt: bucket.resetAt };
  }

  existing.count += 1;
  return {
    ok: existing.count <= options.limit,
    remaining: Math.max(0, options.limit - existing.count),
    resetAt: existing.resetAt,
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

export function assertSameOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  const requestUrl = new URL(request.url);
  const expected = new URL(process.env.NEXT_PUBLIC_APP_URL ?? requestUrl.origin);
  if (origin !== expected.origin && origin !== requestUrl.origin) {
    return NextResponse.json({ error: "Origine non autorisée." }, { status: 403 });
  }
  return null;
}

export function tooManyRequests(resetAt: number): NextResponse {
  const seconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Trop de tentatives. Réessaie dans un petit moment." },
    { status: 429, headers: { "Retry-After": String(seconds) } },
  );
}

export function isAdminRequest(request: Request): boolean {
  const secret =
    request.headers.get("x-admin-secret") ??
    request.headers.get("authorization")?.replace("Bearer ", "");
  const expected = process.env.ADMIN_SECRET ?? "";
  return Boolean(expected) && secret === expected;
}

export function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      ...(init?.headers ?? {}),
    },
  });
}
