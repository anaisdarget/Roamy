import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";
import { generateMagicToken } from "@/lib/auth/session";
import { sendMagicLinkEmail } from "@/lib/email/magic-link";
import { assertSameOrigin, getClientIp, rateLimit, tooManyRequests } from "@/lib/api/guard";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

const GENERIC_MESSAGE =
  "Si un voyage existe avec cet email, tu vas recevoir un lien magique. Pense à vérifier tes spams.";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const ipLimit = rateLimit(`magic-ip:${getClientIp(request)}`, {
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (!ipLimit.ok) return tooManyRequests(ipLimit.resetAt);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Cette adresse email n'a pas l'air valide." },
      { status: 422 },
    );
  }

  const email = parsed.data.email;
  const emailLimit = rateLimit(`magic-email:${email}`, {
    limit: 3,
    windowMs: 15 * 60 * 1000,
  });
  if (!emailLimit.ok) return tooManyRequests(emailLimit.resetAt);

  const { token, tokenHash } = generateMagicToken();
  const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

  await prisma.magicLinkToken.create({
    data: { email, tokenHash, expiresAt },
  });
  await prisma.magicLinkToken.deleteMany({
    where: { email, expiresAt: { lt: new Date() } },
  });

  const appUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const url = `${appUrl}/api/auth/verify?token=${encodeURIComponent(token)}`;
  const delivered = await sendMagicLinkEmail(email, url);
  const devLink = !delivered && (env.AI_MOCK || env.NODE_ENV !== "production") ? url : undefined;

  return NextResponse.json({
    ok: true,
    message: GENERIC_MESSAGE,
    ...(devLink ? { devLink } : {}),
  });
}
