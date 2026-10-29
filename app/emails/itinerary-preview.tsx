import type { TripRequest } from "@prisma/client";
import { ItineraryEmail } from "../components/emails/itinerary-email";
import { buildMockItinerary } from "../lib/ai/mock";
import { PROMPT_VERSION } from "../lib/ai/prompts";
import { ITINERARY_DISCLAIMER, storedItinerarySchema } from "../lib/schemas/itinerary";

const trip = {
  id: "preview",
  createdAt: new Date("2026-10-01T10:00:00.000Z"),
  updatedAt: new Date("2026-10-01T10:00:00.000Z"),
  destination: "Barcelone, Espagne",
  startDate: new Date("2027-06-12T00:00:00.000Z"),
  endDate: new Date("2027-06-16T00:00:00.000Z"),
  flexibleDates: true,
  adults: 2,
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
  notes: null,
  firstName: "Camille",
  email: "camille@example.com",
  consent: true,
  plan: "premium",
  status: "sent",
  locale: "fr",
  stripeSessionId: null,
  paymentIntentId: null,
  generationAttempts: 1,
  lastError: null,
} as unknown as TripRequest;

const itinerary = storedItinerarySchema.parse({
  ...buildMockItinerary(trip),
  disclaimer: ITINERARY_DISCLAIMER,
  promptVersion: PROMPT_VERSION,
  model: "preview:roamy-fixture-v1",
});

export default function ItineraryPreview() {
  return (
    <ItineraryEmail
      trip={trip}
      itinerary={itinerary}
      itineraryId="preview"
      baseUrl="http://localhost:3000"
    />
  );
}
