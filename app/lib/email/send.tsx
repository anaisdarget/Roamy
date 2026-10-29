import "server-only";
import { render } from "@react-email/render";
import { Resend } from "resend";
import type { TripRequest } from "@prisma/client";
import type { StoredItinerary } from "@/lib/schemas/itinerary";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";
import { tripLength } from "@/lib/utils/date";
import { ItineraryEmail } from "@/components/emails/itinerary-email";

export interface RenderedEmail {
  html: string;
  subject: string;
}

export async function renderItineraryEmail(
  trip: TripRequest,
  itinerary: StoredItinerary,
  itineraryId: string,
): Promise<RenderedEmail> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const html = await render(
    <ItineraryEmail
      trip={trip}
      itinerary={itinerary}
      itineraryId={itineraryId}
      baseUrl={baseUrl}
    />,
  );
  const startISO = trip.startDate.toISOString().slice(0, 10);
  const endISO = trip.endDate.toISOString().slice(0, 10);
  const subject = `Ton roadbook ${trip.destination} est prêt 🌞 (${tripLength(startISO, endISO)} jours)`;
  return { html, subject };
}

export async function sendItineraryEmail(
  trip: TripRequest,
  itinerary: StoredItinerary,
  itineraryId: string,
): Promise<{ status: string; logId: string }> {
  const { html, subject } = await renderItineraryEmail(trip, itinerary, itineraryId);

  if (!env.RESEND_API_KEY) {
    const log = await prisma.emailLog.create({
      data: {
        tripRequestId: trip.id,
        status: "mock_sent",
        subject,
        previewHtml: html,
      },
      select: { id: true },
    });
    console.info("[email] mock delivery stored", { tripId: trip.id, logId: log.id });
    return { status: "mock_sent", logId: log.id };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: trip.email,
    subject,
    html,
    tags: [{ name: "type", value: "itinerary" }],
  });

  if (error) {
    await prisma.emailLog.create({
      data: {
        tripRequestId: trip.id,
        status: "failed",
        subject,
      },
    });
    throw new Error(`Resend error: ${error.name}`);
  }

  const log = await prisma.emailLog.create({
    data: {
      tripRequestId: trip.id,
      resendId: data?.id ?? null,
      status: "sent",
      subject,
    },
    select: { id: true },
  });

  return { status: "sent", logId: log.id };
}
