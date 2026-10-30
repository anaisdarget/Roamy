import { after, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";
import { getStripe } from "@/lib/payments/stripe";
import { runGenerationJob } from "@/lib/jobs/generation";

export const maxDuration = 60;

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("[stripe] invalid webhook signature", {
      name: error instanceof Error ? error.name : "unknown",
    });
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const tripId = session.metadata?.tripId;
    if (!tripId) {
      return NextResponse.json({ received: true });
    }

    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : null;

    const updated = await prisma.tripRequest.updateMany({
      where: { id: tripId, status: { in: ["draft", "pending_payment"] } },
      data: {
        status: "paid",
        paymentIntentId,
        stripeSessionId: session.id,
      },
    });

    if (updated.count > 0) {
      after(() => runGenerationJob(tripId));
    } else {
      // Idempotent: duplicate webhooks or already-sent orders are fine.
      const existing = await prisma.tripRequest.findUnique({
        where: { id: tripId },
        select: { status: true },
      });
      if (existing && ["paid", "generating", "sent"].includes(existing.status)) {
        console.info("[stripe] duplicate webhook ignored", { tripId });
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tripId = session.metadata?.tripId;
    if (tripId) {
      await prisma.tripRequest.updateMany({
        where: { id: tripId, status: "pending_payment" },
        data: { status: "draft" },
      });
    }
  }

  return NextResponse.json({ received: true });
}