import type { TripRequest } from "@prisma/client";
import { BUDGET_LEVELS, INTERESTS, RHYTHMS, getPlan, type PlanId } from "@/lib/config/site";
import { formatDateRange, tripLength } from "@/lib/utils/date";

export interface TripDTO {
  id: string;
  destination: string;
  startISO: string;
  endISO: string;
  datesLabel: string;
  days: number;
  flexibleDates: boolean;
  adults: number;
  children: number;
  babies: number;
  travelers: number;
  budgetLevel: string;
  budgetLevelLabel: string;
  budgetAmount: number;
  interests: string[];
  interestLabels: string[];
  rhythm: string;
  rhythmLabel: string;
  dietary: string | null;
  accommodation: string | null;
  transport: string | null;
  notes: string | null;
  firstName: string;
  email: string;
  emailMasked: string;
  plan: PlanId;
  planName: string;
  priceCents: number;
  status: string;
  createdAtISO: string;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "ton email";
  return `${local.slice(0, 1)}***@${domain}`;
}

export function toTripDTO(trip: TripRequest): TripDTO {
  const startISO = trip.startDate.toISOString().slice(0, 10);
  const endISO = trip.endDate.toISOString().slice(0, 10);
  const interests = (JSON.parse(trip.interests || "[]") as string[]).filter((slug) =>
    INTERESTS.some((interest) => interest.slug === slug),
  );
  const plan = getPlan(trip.plan);
  const travelers = trip.adults + trip.children + trip.babies;

  return {
    id: trip.id,
    destination: trip.destination,
    startISO,
    endISO,
    datesLabel: formatDateRange(startISO, endISO),
    days: tripLength(startISO, endISO),
    flexibleDates: trip.flexibleDates,
    adults: trip.adults,
    children: trip.children,
    babies: trip.babies,
    travelers,
    budgetLevel: trip.budgetLevel,
    budgetLevelLabel:
      BUDGET_LEVELS[trip.budgetLevel as keyof typeof BUDGET_LEVELS]?.label ?? trip.budgetLevel,
    budgetAmount: trip.budgetAmount,
    interests,
    interestLabels: interests.map(
      (slug) => INTERESTS.find((interest) => interest.slug === slug)?.label ?? slug,
    ),
    rhythm: trip.rhythm,
    rhythmLabel: RHYTHMS.find((rhythm) => rhythm.id === trip.rhythm)?.label ?? trip.rhythm,
    dietary: trip.dietary,
    accommodation: trip.accommodation,
    transport: trip.transport,
    notes: trip.notes,
    firstName: trip.firstName,
    email: trip.email,
    emailMasked: maskEmail(trip.email),
    plan: plan.id,
    planName: plan.name,
    priceCents: plan.priceCents,
    status: trip.status,
    createdAtISO: trip.createdAt.toISOString(),
  };
}
