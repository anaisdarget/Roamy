import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const itinerary = await prisma.itinerary.findUnique({
    where: { id },
    select: {
      pdf: true,
      tripRequest: { select: { destination: true } },
    },
  });

  if (!itinerary?.pdf) {
    return new Response("PDF introuvable.", { status: 404 });
  }

  const filename = `roadbook-roamy-${slugify(itinerary.tripRequest.destination) || "voyage"}.pdf`;
  const body = new Uint8Array(itinerary.pdf);

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(body.byteLength),
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}
