import { z } from "zod";
import {
  INTEREST_SLUGS,
  MAX_BUDGET,
  MIN_BUDGET,
  RHYTHM_IDS,
  TRAVELER_LIMITS,
} from "@/lib/config/site";
import { todayParis, tripLength } from "@/lib/utils/date";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choisis une date valide.")
  .refine(
    (value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)),
    "Cette date n'existe pas.",
  );

export const interestSchema = z.enum(INTEREST_SLUGS);
export const rhythmSchema = z.enum(RHYTHM_IDS);
export const budgetLevelSchema = z.enum(["petit", "confort", "plaisir"]);
export const planSchema = z.enum(["essential", "premium"]);

const tripBaseSchema = z.object({
  destination: z
    .string()
    .trim()
    .min(2, "Dis-nous où tu veux aller (ou laisse-nous te surprendre).")
    .max(120, "Ta destination est un peu trop longue."),
  startDate: isoDate,
  endDate: isoDate,
  flexibleDates: z.boolean(),
  adults: z
    .number()
    .int()
    .min(TRAVELER_LIMITS.adults.min, "Il faut au moins un adulte.")
    .max(TRAVELER_LIMITS.adults.max, "On peut planifier jusqu'à 12 adultes."),
  children: z
    .number()
    .int()
    .min(TRAVELER_LIMITS.children.min)
    .max(TRAVELER_LIMITS.children.max, "Maximum 10 enfants par voyage."),
  babies: z
    .number()
    .int()
    .min(TRAVELER_LIMITS.babies.min)
    .max(TRAVELER_LIMITS.babies.max, "Maximum 6 bébés par voyage."),
  budgetLevel: budgetLevelSchema,
  budgetAmount: z
    .number()
    .int("Indique un budget en euros.")
    .min(MIN_BUDGET, `Compte au moins ${MIN_BUDGET} € par personne.`)
    .max(MAX_BUDGET, `On plafonne à ${MAX_BUDGET} € par personne pour rester réaliste.`),
  interests: z
    .array(interestSchema)
    .min(1, "Choisis au moins une envie.")
    .max(INTEREST_SLUGS.length),
  rhythm: rhythmSchema,
  dietary: z.string().trim().max(300, "300 caractères max.").optional().or(z.literal("")),
  accommodation: z.string().trim().max(300, "300 caractères max.").optional().or(z.literal("")),
  transport: z.string().trim().max(300, "300 caractères max.").optional().or(z.literal("")),
  notes: z.string().trim().max(1000, "1000 caractères max.").optional().or(z.literal("")),
  firstName: z
    .string()
    .trim()
    .min(2, "Ton prénom, pour qu'on te parle comme à un pote.")
    .max(60, "Ton prénom est un peu long."),
  email: z.string().trim().toLowerCase().email("Cette adresse email n'a pas l'air valide."),
  consent: z.boolean().refine((value) => value, {
    message: "Il nous faut ton accord pour t'envoyer ton roadbook.",
  }),
  plan: planSchema,
  locale: z.literal("fr"),
  website: z.string().max(0, "Beau try, petit robot.").optional(),
});

export const tripAnswersSchema = tripBaseSchema.superRefine((data, ctx) => {
  if (data.startDate < todayParis()) {
    ctx.addIssue({
      code: "custom",
      path: ["startDate"],
      message: "Le départ est déjà passé. On remonte le temps, mais pas encore.",
    });
  }
  if (data.endDate < data.startDate) {
    ctx.addIssue({
      code: "custom",
      path: ["endDate"],
      message: "Le retour doit être après l'aller. Logique, non ?",
    });
  }
  if (data.endDate >= data.startDate && tripLength(data.startDate, data.endDate) > 30) {
    ctx.addIssue({
      code: "custom",
      path: ["endDate"],
      message: "30 jours max par itinéraire. On t'aime, mais on a nos limites.",
    });
  }
  const travelers = data.adults + data.children + data.babies;
  if (travelers > 20) {
    ctx.addIssue({
      code: "custom",
      path: ["adults"],
      message: "Pour un groupe de plus de 20 personnes, écris-nous directement.",
    });
  }
});

export type TripAnswers = z.infer<typeof tripAnswersSchema>;

export const destinationStepSchema = tripBaseSchema.pick({ destination: true });
export const datesStepSchema = tripBaseSchema.pick({
  startDate: true,
  endDate: true,
  flexibleDates: true,
  adults: true,
  children: true,
  babies: true,
});
export const budgetStepSchema = tripBaseSchema.pick({ budgetLevel: true, budgetAmount: true });
export const interestsStepSchema = tripBaseSchema.pick({ interests: true });
export const rhythmStepSchema = tripBaseSchema.pick({ rhythm: true });
export const identityStepSchema = tripBaseSchema.pick({
  firstName: true,
  email: true,
  consent: true,
  notes: true,
  dietary: true,
  accommodation: true,
  transport: true,
});

export const TRIP_STEPS = [
  { id: "destination", label: "Destination", fields: ["destination"] },
  {
    id: "dates",
    label: "Dates & voyageurs",
    fields: ["startDate", "endDate", "flexibleDates", "adults", "children", "babies"],
  },
  { id: "budget", label: "Budget", fields: ["budgetLevel", "budgetAmount"] },
  { id: "interests", label: "Envies", fields: ["interests"] },
  { id: "rhythm", label: "Rythme", fields: ["rhythm"] },
  {
    id: "identity",
    label: "Prénom & email",
    fields: ["firstName", "email", "consent", "notes", "dietary", "accommodation", "transport"],
  },
] as const;

export type StepId = (typeof TRIP_STEPS)[number]["id"];

export const STEP_INDEX: Record<StepId, number> = TRIP_STEPS.reduce(
  (acc, step, index) => ({ ...acc, [step.id]: index }),
  {} as Record<StepId, number>,
);

export function stepFromNumber(value: number): StepId {
  const clamped = Math.min(Math.max(value, 1), TRIP_STEPS.length);
  return TRIP_STEPS[clamped - 1].id;
}

export function stepToNumber(step: StepId): number {
  return STEP_INDEX[step] + 1;
}

/** Parse the `step` query param into a 1-based index. */
export function parseStepParam(value: string | string[] | null | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(Math.max(parsed, 1), TRIP_STEPS.length);
}
