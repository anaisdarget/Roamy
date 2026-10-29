import { z } from "zod";

/**
 * Structured itinerary contract shared by the AI, the DB, the result
 * page, the email and the PDF. Anything that does not match is never sent.
 */

export const activitySchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().min(20).max(900),
  duration: z.string().min(2).max(60),
  cost: z.string().min(1).max(60),
  area: z.string().min(2).max(120),
  tip: z.string().max(400).optional(),
});

export const periodSchema = z.object({
  activities: z.array(activitySchema).min(1).max(4),
});

export const daySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  theme: z.string().min(3).max(140),
  morning: periodSchema,
  afternoon: periodSchema,
  evening: periodSchema,
  tip: z.string().max(500).optional(),
  transport: z.string().max(300).optional(),
});

export const restaurantSchema = z.object({
  name: z.string().min(2).max(120),
  cuisine: z.string().min(2).max(80),
  area: z.string().min(2).max(120),
  priceRange: z.string().min(1).max(30),
  why: z.string().min(10).max(300),
});

export const budgetSchema = z.object({
  accommodation: z.number().int().min(0),
  food: z.number().int().min(0),
  activities: z.number().int().min(0),
  transport: z.number().int().min(0),
  total: z.number().int().min(0),
  perPerson: z.number().int().min(0),
  currency: z.literal("EUR").default("EUR"),
});

export const practicalTipsSchema = z.object({
  weather: z.string().min(10).max(600),
  transport: z.string().min(10).max(600),
  safety: z.string().min(10).max(600),
  etiquette: z.string().min(10).max(600),
});

export const generatedItinerarySchema = z.object({
  summary: z.string().min(40).max(1200),
  days: z.array(daySchema).min(1).max(30),
  restaurants: z.array(restaurantSchema).min(3).max(15),
  budget: budgetSchema,
  practicalTips: practicalTipsSchema,
  packingHints: z.array(z.string().min(5).max(220)).min(3).max(12),
});

export const ITINERARY_DISCLAIMER =
  "Les prix, horaires et disponibilités sont des estimations au moment de la génération. Vérifie-les avant de réserver : une terrasse fermée, un musée en travaux ou un bateau annulé, ça arrive même aux meilleurs plans.";

export const storedItinerarySchema = generatedItinerarySchema.extend({
  disclaimer: z.string().min(20),
  promptVersion: z.string().min(1),
  model: z.string().min(1),
});

export type Activity = z.infer<typeof activitySchema>;
export type ItineraryDay = z.infer<typeof daySchema>;
export type Restaurant = z.infer<typeof restaurantSchema>;
export type ItineraryBudget = z.infer<typeof budgetSchema>;
export type GeneratedItinerary = z.infer<typeof generatedItinerarySchema>;
export type StoredItinerary = z.infer<typeof storedItinerarySchema>;

/** Extract the first JSON object from a model response that might include prose/fences. */
export function extractJsonObject(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model response");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

export function normaliseBudget(budget: ItineraryBudget, travelers: number): ItineraryBudget {
  const parts = budget.accommodation + budget.food + budget.activities + budget.transport;
  const total = parts > 0 ? parts : budget.total;
  const safeTravelers = Math.max(1, travelers);
  return {
    ...budget,
    total,
    perPerson: Math.round(total / safeTravelers),
    currency: "EUR",
  };
}
