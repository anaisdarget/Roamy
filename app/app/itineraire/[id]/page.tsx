import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { storedItinerarySchema } from "@/lib/schemas/itinerary";
import { toTripDTO } from "@/lib/trips/dto";
import { ItineraryView } from "@/components/itinerary/itinerary-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ton itinéraire",
  description: "Ton roadbook Roamy, jour par jour.",
  robots: { index: false, follow: false },
};

export default async function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.itinerary.findUnique({
    where: { id },
    include: { tripRequest: true },
  });

  if (!record) notFound();

  let parsed: unknown;
  try {
    parsed = JSON.parse(record.json);
  } catch {
    notFound();
  }

  const itinerary = storedItinerarySchema.safeParse(parsed);
  if (!itinerary.success) notFound();

  return (
    <ItineraryView
      trip={toTripDTO(record.tripRequest)}
      itinerary={itinerary.data}
      itineraryId={record.id}
    />
  );
}
