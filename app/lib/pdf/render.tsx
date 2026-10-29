import "server-only";
import type { TripRequest } from "@prisma/client";
import type { StoredItinerary } from "@/lib/schemas/itinerary";
import { ItineraryPdfDocument } from "@/components/pdf/itinerary-pdf";

export async function renderItineraryPdf(
  trip: TripRequest,
  itinerary: StoredItinerary,
): Promise<Uint8Array<ArrayBuffer>> {
  const { renderToBuffer } = await import("@react-pdf/renderer");
  const buffer = await renderToBuffer(<ItineraryPdfDocument trip={trip} itinerary={itinerary} />);
  return Uint8Array.from(buffer);
}
