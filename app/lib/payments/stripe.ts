import "server-only";
import Stripe from "stripe";
import { env } from "@/lib/config/env";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY or use PAYMENT_MOCK=true.");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
      appInfo: { name: "Roamy", version: "1.0.0" },
    });
  }
  return stripeClient;
}
