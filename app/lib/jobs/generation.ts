import "server-only";
import { prisma } from "@/lib/db/prisma";
import { generateItinerary } from "@/lib/ai/generate";
import { PROMPT_VERSION } from "@/lib/ai/prompts";
import {
  ITINERARY_DISCLAIMER,
  storedItinerarySchema,
  type StoredItinerary,
} from "@/lib/schemas/itinerary";
import { renderItineraryPdf } from "@/lib/pdf/render";
import { sendItineraryEmail } from "@/lib/email/send";

const MAX_ATTEMPTS = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface JobResult {
  ok: boolean;
  skipped?: boolean;
  itineraryId?: string;
}

/**
 * DB-backed generation job. Claiming is atomic, so duplicate webhooks or
 * double clicks cannot generate twice. All errors are retried with backoff.
 */
export async function runGenerationJob(tripId: string): Promise<JobResult> {
  const claim = await prisma.tripRequest.updateMany({
    where: { id: tripId, status: "paid" },
    data: { status: "generating", lastError: null, generationAttempts: { increment: 1 } },
  });

  if (claim.count === 0) {
    return { ok: true, skipped: true };
  }

  const trip = await prisma.tripRequest.findUnique({ where: { id: tripId } });
  if (!trip) {
    return { ok: false, skipped: true };
  }

  let lastError = "Unknown error";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const result = await generateItinerary(trip);
      const stored: StoredItinerary = {
        ...result.itinerary,
        disclaimer: ITINERARY_DISCLAIMER,
        promptVersion: PROMPT_VERSION,
        model: result.model,
      };

      // Validate again before persisting: never store unvalidated content.
      const validated = storedItinerarySchema.parse(stored);
      const pdf = await renderItineraryPdf(trip, validated);

      const itinerary = await prisma.itinerary.upsert({
        where: { tripRequestId: trip.id },
        create: {
          tripRequestId: trip.id,
          json: JSON.stringify(validated),
          pdf,
          modelUsed: result.model,
          tokensUsed: result.tokensUsed,
        },
        update: {
          json: JSON.stringify(validated),
          pdf,
          modelUsed: result.model,
          tokensUsed: result.tokensUsed,
        },
        select: { id: true },
      });

      await sendItineraryEmail(trip, validated, itinerary.id);

      await prisma.tripRequest.update({
        where: { id: trip.id },
        data: { status: "sent", lastError: null },
      });

      console.info("[generation] itinerary sent", { tripId: trip.id, itineraryId: itinerary.id });
      return { ok: true, itineraryId: itinerary.id };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Unknown error";
      console.warn("[generation] attempt failed", {
        tripId,
        attempt,
        error: lastError.slice(0, 400),
      });
      if (attempt < MAX_ATTEMPTS) {
        await sleep(700 * 2 ** (attempt - 1));
      }
    }
  }

  await prisma.tripRequest.update({
    where: { id: tripId },
    data: { status: "failed", lastError: lastError.slice(0, 1000) },
  });
  console.error("[alert] itinerary generation failed", { tripId, attempts: MAX_ATTEMPTS });

  return { ok: false };
}

/** Used by the admin retry endpoint; makes the trip claimable again. */
export async function resetForRegeneration(tripId: string): Promise<void> {
  await prisma.tripRequest.update({
    where: { id: tripId },
    data: { status: "paid", lastError: null, generationAttempts: 0 },
  });
}
