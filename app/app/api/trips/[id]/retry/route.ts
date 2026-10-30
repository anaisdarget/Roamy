import { after, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { runGenerationJob } from "@/lib/jobs/generation";
import { assertSameOrigin, getClientIp, rateLimit, tooManyRequests } from "@/lib/api/guard";

export const maxDuration = 60;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const limit = rateLimit(`retry:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 30 * 60 * 1000,
  });
  if (!limit.ok) return tooManyRequests(limit.resetAt);

  const { id } = await params;
  const trip = await prisma.tripRequest.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!trip) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  if (trip.status !== "failed") {
    return NextResponse.json({ ok: true, message: "Ce voyage n'a pas besoin d'être relancé." });
  }

  await prisma.tripRequest.update({
    where: { id },
    data: { status: "paid", lastError: null, generationAttempts: 0 },
  });
  after(() => runGenerationJob(id));

  return NextResponse.json({ ok: true, message: "C'est reparti." });
}