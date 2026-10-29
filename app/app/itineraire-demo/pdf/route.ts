import { getSampleData } from "@/lib/data/sample";
import { renderItineraryPdf } from "@/lib/pdf/render";

export async function GET() {
  const { trip, itinerary } = getSampleData();
  const pdf = await renderItineraryPdf(trip, itinerary);
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="roamy-exemple-barcelone.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
