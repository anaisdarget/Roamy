import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";
import { toTripDTO } from "@/lib/trips/dto";
import { PaymentExperience } from "@/components/payment/payment-experience";

export const metadata: Metadata = {
  title: "Paiement",
  robots: { index: false, follow: false },
};

type PageParams = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const trip = await prisma.tripRequest.findUnique({ where: { id } });

  if (!trip) notFound();
  if (["paid", "generating", "sent", "failed"].includes(trip.status)) {
    redirect(`/confirmation/${trip.id}`);
  }

  const canceled = (Array.isArray(query.canceled) ? query.canceled[0] : query.canceled) === "1";

  return (
    <PaymentExperience trip={toTripDTO(trip)} canceled={canceled} mockMode={env.PAYMENT_MOCK} />
  );
}
