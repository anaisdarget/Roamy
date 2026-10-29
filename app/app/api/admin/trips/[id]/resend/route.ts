import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api/guard";
import { prisma } from "@/lib/db/prisma";
import { storedItinerarySchema } from "@/lib/schemas/itinerary";
import { sendItineraryEmail } from "@/lib/email/send";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const trip = await prisma.tripRequest.findUnique({
    where: { id },
    include: { itinerary: true },
  });

  if (!trip?.itinerary) {
    return NextResponse.json({ error: "Itinéraire introuvable." }, { status: 404 });
  }

  const parsed = storedItinerarySchema.safeParse(JSON.parse(trip.itinerary.json));
  if (!parsed.success) {
    return NextResponse.json({ error: "Itinéraire stocké invalide." }, { status: 500 });
  }

  const result = await sendItineraryEmail(trip, parsed.data, trip.itinerary.id);
  return NextResponse.json({ ok: true, ...result });
}
