import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  SESSION_COOKIE,
  createSessionValue,
  hashToken,
  sessionCookieOptions,
} from "@/lib/auth/session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const redirectUrl = new URL("/mes-voyages", url.origin);

  if (!token) {
    redirectUrl.searchParams.set("error", "lien-invalide");
    return NextResponse.redirect(redirectUrl);
  }

  const tokenHash = hashToken(token);
  const consumed = await prisma.magicLinkToken.updateMany({
    where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
    data: { usedAt: new Date() },
  });

  if (consumed.count === 0) {
    redirectUrl.searchParams.set("error", "lien-expire");
    return NextResponse.redirect(redirectUrl);
  }

  const record = await prisma.magicLinkToken.findUnique({
    where: { tokenHash },
    select: { email: true },
  });

  if (!record) {
    redirectUrl.searchParams.set("error", "lien-invalide");
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.redirect(new URL("/mes-voyages?welcome=1", url.origin));
  response.cookies.set(SESSION_COOKIE, createSessionValue(record.email), sessionCookieOptions());
  return response;
}
