import { MAX_TRIP_DAYS } from "@/lib/config/site";

/** Date-only helpers. All trip dates are stored at UTC midnight. */

export function dateToISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isoToDate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

/** Today in Europe/Paris, as YYYY-MM-DD. */
export function todayParis(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDaysISO(iso: string, days: number): string {
  const date = isoToDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return dateToISO(date);
}

export function tripLength(startISO: string, endISO: string): number {
  const start = isoToDate(startISO).getTime();
  const end = isoToDate(endISO).getTime();
  return Math.round((end - start) / 86_400_000) + 1;
}

export function isValidTripLength(startISO: string, endISO: string): boolean {
  return tripLength(startISO, endISO) >= 1 && tripLength(startISO, endISO) <= MAX_TRIP_DAYS;
}

export function dateRange(startISO: string, endISO: string): string[] {
  const length = Math.max(0, tripLength(startISO, endISO));
  return Array.from({ length }, (_, index) => addDaysISO(startISO, index));
}

export function formatDateFr(
  input: string | Date,
  style: "short" | "long" | "day" | "month" = "long",
): string {
  const date = typeof input === "string" ? isoToDate(input) : input;
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    ...(style === "long" || style === "day" ? { year: "numeric" } : {}),
    ...(style === "day" ? { weekday: "long" } : {}),
    ...(style === "month" ? { year: "numeric" } : {}),
  };
  const formatted = new Intl.DateTimeFormat("fr-FR", options).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatDateRange(startISO: string, endISO: string): string {
  const start = isoToDate(startISO);
  const end = isoToDate(endISO);
  const sameMonth =
    start.getUTCMonth() === end.getUTCMonth() && start.getUTCFullYear() === end.getUTCFullYear();

  if (sameMonth) {
    const month = new Intl.DateTimeFormat("fr-FR", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    }).format(start);
    return `${start.getUTCDate()}–${end.getUTCDate()} ${month}`;
  }

  return `${formatDateFr(startISO, "short")} → ${formatDateFr(endISO, "short")}`;
}

export function nightsBetween(startISO: string, endISO: string): number {
  return Math.max(0, tripLength(startISO, endISO) - 1);
}

export function seasonFor(startISO: string): string {
  const month = isoToDate(startISO).getUTCMonth();
  if (month <= 1 || month === 11) return "hiver";
  if (month <= 4) return "printemps";
  if (month <= 7) return "été";
  return "automne";
}

export function toDateInputValue(date: Date | null): string {
  return date ? dateToISO(date) : "";
}
