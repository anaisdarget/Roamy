import "server-only";
import type { TripRequest } from "@prisma/client";
import { buildMockItinerary } from "@/lib/ai/mock";
import { PROMPT_VERSION } from "@/lib/ai/prompts";
import {
  ITINERARY_DISCLAIMER,
  storedItinerarySchema,
  type StoredItinerary,
} from "@/lib/schemas/itinerary";

const SAMPLE_ID = "demo";

export function getSampleData(): { trip: TripRequest; itinerary: StoredItinerary } {
  const trip = {
    id: SAMPLE_ID,
    createdAt: new Date("2026-05-01T10:00:00.000Z"),
    updatedAt: new Date("2026-05-01T10:00:00.000Z"),
    destination: "Barcelone, Espagne",
    startDate: new Date("2027-06-12T00:00:00.000Z"),
    endDate: new Date("2027-06-16T00:00:00.000Z"),
    flexibleDates: true,
    adults: 4,
    children: 0,
    babies: 0,
    budgetLevel: "confort",
    budgetAmount: 700,
    currency: "EUR",
    interests: JSON.stringify(["plage", "food", "culture", "fiesta"]),
    rhythm: "equilibre",
    dietary: null,
    accommodation: "Appartement dans El Born",
    transport: "Métro + marche",
    notes: "On veut voir un match et éviter les files d'attente.",
    firstName: "Julien",
    email: "julien@example.com",
    consent: true,
    plan: "premium",
    status: "sent",
    locale: "fr",
    stripeSessionId: null,
    paymentIntentId: null,
    generationAttempts: 1,
    lastError: null,
  } as unknown as TripRequest;

  const generated = buildMockItinerary(trip);
  const itinerary = storedItinerarySchema.parse({
    ...generated,
    disclaimer: ITINERARY_DISCLAIMER,
    promptVersion: PROMPT_VERSION,
    model: "sample:roamy-fixture-v1",
  });

  return { trip, itinerary };
}
