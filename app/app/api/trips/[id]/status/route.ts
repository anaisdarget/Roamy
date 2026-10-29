import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await prisma.tripRequest.findUnique({
    where: { id },
    select: {
      status: true,
      itinerary: { select: { id: true } },
      emailLogs: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, status: true },
      },
    },
  });

  if (!trip) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  return NextResponse.json(
    {
      status: trip.status,
      itineraryId: trip.status === "sent" ? (trip.itinerary?.id ?? null) : null,
      emailPreviewId:
        env.AI_MOCK && trip.status === "sent" ? (trip.emailLogs[0]?.id ?? null) : null,
    },
    {
      headers: { "Cache-Control": "no-store, max-age=0" },
    },
  );
}
