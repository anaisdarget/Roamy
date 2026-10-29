import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api/guard";
import { prisma } from "@/lib/db/prisma";
import { runGenerationJob } from "@/lib/jobs/generation";

export const dynamic = "force-dynamic";

/** Recover paid jobs that were not picked up (server restart, crash, etc.). */
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const stuck = await prisma.tripRequest.findMany({
    where: { status: "paid" },
    select: { id: true },
    take: 20,
  });

  for (const trip of stuck) {
    await runGenerationJob(trip.id);
  }

  return NextResponse.json({ ok: true, processed: stuck.length });
}
