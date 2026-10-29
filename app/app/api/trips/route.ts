import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { tripAnswersSchema } from "@/lib/schemas/trip";
import { assertSameOrigin, getClientIp, rateLimit, tooManyRequests } from "@/lib/api/guard";
import { isoToDate } from "@/lib/utils/date";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const limit = rateLimit(`trips:${getClientIp(request)}`, {
    limit: 8,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.ok) return tooManyRequests(limit.resetAt);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = tripAnswersSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Certaines réponses sont incomplètes.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  if (data.website) {
    // Honeypot filled: pretend everything is fine to avoid teaching bots.
    return NextResponse.json({ id: "bot", ok: true });
  }

  try {
    const trip = await prisma.tripRequest.create({
      data: {
        destination: data.destination,
        startDate: isoToDate(data.startDate),
        endDate: isoToDate(data.endDate),
        flexibleDates: data.flexibleDates,
        adults: data.adults,
        children: data.children,
        babies: data.babies,
        budgetLevel: data.budgetLevel,
        budgetAmount: data.budgetAmount,
        interests: JSON.stringify(data.interests),
        rhythm: data.rhythm,
        dietary: data.dietary || null,
        accommodation: data.accommodation || null,
        transport: data.transport || null,
        notes: data.notes || null,
        firstName: data.firstName,
        email: data.email,
        consent: data.consent,
        plan: data.plan,
        locale: data.locale,
        status: "draft",
      },
      select: { id: true },
    });

    return NextResponse.json({ id: trip.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("[trips] database error", { code: error.code });
    } else {
      console.error("[trips] unexpected error", {
        name: error instanceof Error ? error.name : "unknown",
      });
    }
    return NextResponse.json(
      { error: "On n'a pas réussi à sauvegarder ton voyage. Réessaie dans un instant." },
      { status: 500 },
    );
  }
}
