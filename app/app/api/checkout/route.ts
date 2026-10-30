import { after, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";
import { getPlan } from "@/lib/config/site";
import { getStripe } from "@/lib/payments/stripe";
import { runGenerationJob } from "@/lib/jobs/generation";
import { assertSameOrigin, getClientIp, rateLimit, tooManyRequests } from "@/lib/api/guard";

const bodySchema = z.object({
  tripId: z.string().min(10).max(40),
});

export const maxDuration = 60;

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const limit = rateLimit(`checkout:${getClientIp(request)}`, {
    limit: 15,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.ok) return tooManyRequests(limit.resetAt);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Voyage introuvable." }, { status: 400 });
  }

  const trip = await prisma.tripRequest.findUnique({
    where: { id: parsed.data.tripId },
    select: {
      id: true,
      email: true,
      destination: true,
      plan: true,
      status: true,
    },
  });

  if (!trip) {
    return NextResponse.json({ error: "Voyage introuvable." }, { status: 404 });
  }

  if (["paid", "generating", "sent"].includes(trip.status)) {
    return NextResponse.json({ url: `/confirmation/${trip.id}`, alreadyPaid: true });
  }

  if (!["draft", "pending_payment"].includes(trip.status)) {
    return NextResponse.json(
      { error: "Ce voyage ne peut plus être payé. Contacte-nous si c'est une erreur." },
      { status: 409 },
    );
  }

  const plan = getPlan(trip.plan);

  if (env.PAYMENT_MOCK) {
    await prisma.tripRequest.update({
      where: { id: trip.id },
      data: {
        status: "paid",
        paymentIntentId: `mock_${Date.now()}`,
      },
    });
    after(() => runGenerationJob(trip.id));
    return NextResponse.json({
      url: `/confirmation/${trip.id}?mock=1`,
      mock: true,
    });
  }

  const appUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const priceId =
    plan.id === "essential" ? env.STRIPE_PRICE_ID_ESSENTIAL : env.STRIPE_PRICE_ID_PREMIUM;

  const lineItem = priceId
    ? { price: priceId, quantity: 1 }
    : {
        price_data: {
          currency: "eur",
          unit_amount: plan.priceCents,
          product_data: {
            name: `Roadbook Roamy — ${plan.name}`,
            description: `Itinéraire de voyage sur mesure pour ${trip.destination}`,
          },
        },
        quantity: 1,
      };

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItem],
      customer_email: trip.email,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      locale: "fr",
      metadata: { tripId: trip.id },
      payment_intent_data: { metadata: { tripId: trip.id } },
      success_url: `${appUrl}/confirmation/${trip.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/paiement/${trip.id}?canceled=1`,
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe n'a pas renvoyé de lien de paiement. Réessaie." },
        { status: 502 },
      );
    }

    await prisma.tripRequest.update({
      where: { id: trip.id },
      data: { status: "pending_payment", stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] Stripe session failed", {
      tripId: trip.id,
      name: error instanceof Error ? error.name : "unknown",
    });
    return NextResponse.json(
      { error: "Le paiement n'a pas pu démarrer. Réessaie dans un instant." },
      { status: 502 },
    );
  }
}