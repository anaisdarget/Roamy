import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { TripRequest } from "@prisma/client";
import { env } from "@/lib/config/env";
import {
  generatedItinerarySchema,
  extractJsonObject,
  normaliseBudget,
  type GeneratedItinerary,
} from "@/lib/schemas/itinerary";
import { dateRange } from "@/lib/utils/date";
import { buildMockItinerary } from "./mock";
import { buildUserPrompt, PROMPT_VERSION, SYSTEM_PROMPT } from "./prompts";

export interface GenerationResult {
  itinerary: GeneratedItinerary;
  model: string;
  tokensUsed: number;
}

function expectedDates(trip: TripRequest): string[] {
  return dateRange(
    trip.startDate.toISOString().slice(0, 10),
    trip.endDate.toISOString().slice(0, 10),
  );
}

function schemaForTrip(trip: TripRequest) {
  const dates = expectedDates(trip);
  return generatedItinerarySchema.superRefine((data, ctx) => {
    if (data.days.length !== dates.length) {
      ctx.addIssue({
        code: "custom",
        path: ["days"],
        message: `Expected exactly ${dates.length} days, received ${data.days.length}.`,
      });
    }
    data.days.forEach((day, index) => {
      if (dates[index] && day.date !== dates[index]) {
        ctx.addIssue({
          code: "custom",
          path: ["days", index, "date"],
          message: `Expected date ${dates[index]}, received ${day.date}.`,
        });
      }
    });
  });
}

function validate(trip: TripRequest, raw: unknown): GeneratedItinerary {
  const parsed = schemaForTrip(trip).safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(z.prettifyError(parsed.error));
  }
  const travelers = Math.max(1, trip.adults + trip.children + trip.babies);
  return {
    ...parsed.data,
    budget: normaliseBudget(parsed.data.budget, travelers),
  };
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export async function generateItinerary(trip: TripRequest): Promise<GenerationResult> {
  if (env.AI_MOCK) {
    const fixture = buildMockItinerary(trip);
    const itinerary = validate(trip, fixture);
    // Small, human-scale delay so the confirmation screen can breathe.
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { itinerary, model: "mock:roamy-fixture-v1", tokensUsed: 0 };
  }

  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is missing while AI_MOCK is disabled.");
  }

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: buildUserPrompt(trip) }];
  let tokensUsed = 0;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await client.messages.create({
      model: env.ANTHROPIC_MODEL,
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages,
    });

    tokensUsed += response.usage.input_tokens + response.usage.output_tokens;
    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!text) {
      messages.push(
        { role: "assistant", content: " " },
        { role: "user", content: "Réponse vide. Renvoie uniquement l'objet JSON complet." },
      );
      continue;
    }

    try {
      const raw = extractJsonObject(text);
      const itinerary = validate(trip, raw);
      return { itinerary, model: env.ANTHROPIC_MODEL, tokensUsed };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown validation error";
      console.warn("[ai] itinerary validation failed", {
        attempt,
        promptVersion: PROMPT_VERSION,
        reason: reason.slice(0, 500),
      });
      messages.push(
        { role: "assistant", content: text },
        {
          role: "user",
          content: `Ta réponse est invalide. Corrige-la et renvoie UNIQUEMENT l'objet JSON complet, sans Markdown. Voici les erreurs de validation :\n${reason.slice(0, 3500)}`,
        },
      );
    }
  }

  throw new Error("Itinerary generation failed after 3 validation attempts.");
}
