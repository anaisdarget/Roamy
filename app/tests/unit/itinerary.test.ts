import { describe, expect, it } from "vitest";
import type { TripRequest } from "@prisma/client";
import { buildMockItinerary } from "@/lib/ai/mock";
import { generatedItinerarySchema, extractJsonObject } from "@/lib/schemas/itinerary";

function trip(overrides: Partial<TripRequest> = {}): TripRequest {
  return {
    id: "test",
    createdAt: new Date(),
    updatedAt: new Date(),
    destination: "Lisbonne, Portugal",
    startDate: new Date("2030-06-10T00:00:00.000Z"),
    endDate: new Date("2030-06-14T00:00:00.000Z"),
    flexibleDates: false,
    adults: 2,
    children: 0,
    babies: 0,
    budgetLevel: "confort",
    budgetAmount: 700,
    currency: "EUR",
    interests: JSON.stringify(["plage", "food"]),
    rhythm: "equilibre",
    dietary: null,
    accommodation: null,
    transport: null,
    notes: null,
    firstName: "Ana",
    email: "ana@example.com",
    consent: true,
    plan: "premium",
    status: "paid",
    locale: "fr",
    stripeSessionId: null,
    paymentIntentId: null,
    generationAttempts: 0,
    lastError: null,
    ...overrides,
  } as TripRequest;
}

describe("mock itinerary", () => {
  it("matches the generated itinerary schema and expected dates", () => {
    const result = buildMockItinerary(trip());
    const parsed = generatedItinerarySchema.safeParse(result);
    expect(parsed.success).toBe(true);
    expect(result.days).toHaveLength(5);
    expect(result.days[0]?.date).toBe("2030-06-10");
    expect(result.days.at(-1)?.date).toBe("2030-06-14");
  });

  it("sums the budget from its parts", () => {
    const result = buildMockItinerary(trip());
    const { accommodation, food, activities, transport, total, perPerson } = result.budget;
    expect(accommodation + food + activities + transport).toBe(total);
    expect(perPerson).toBe(Math.round(total / 2));
  });

  it("supports a 15-day, chill family trip", () => {
    const result = buildMockItinerary(
      trip({
        startDate: new Date("2030-07-01T00:00:00.000Z"),
        endDate: new Date("2030-07-15T00:00:00.000Z"),
        adults: 2,
        children: 1,
        babies: 1,
        rhythm: "chill",
        budgetAmount: 1400,
      }),
    );
    expect(result.days).toHaveLength(15);
    expect(generatedItinerarySchema.safeParse(result).success).toBe(true);
    expect(result.packingHints.length).toBeGreaterThanOrEqual(3);
  });

  it("adds two activities per period in a-fond mode", () => {
    const result = buildMockItinerary(trip({ rhythm: "a-fond" }));
    expect(result.days[0]?.morning.activities.length).toBe(2);
    expect(result.days[0]?.afternoon.activities.length).toBe(2);
  });
});

describe("extractJsonObject", () => {
  it("extracts JSON wrapped in markdown fences", () => {
    const value = extractJsonObject('Voici le résultat:\n```json\n{"hello":"world"}\n```');
    expect(value).toEqual({ hello: "world" });
  });

  it("throws when no object is present", () => {
    expect(() => extractJsonObject("sorry, no json here")).toThrow();
  });
});
