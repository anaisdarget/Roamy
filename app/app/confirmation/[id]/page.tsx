import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";
import { toTripDTO } from "@/lib/trips/dto";
import { ConfirmationExperience } from "@/components/confirmation/confirmation-experience";

export const metadata: Metadata = {
  title: "Ton roadbook arrive",
  robots: { index: false, follow: false },
};

type Status = "paid" | "generating" | "sent" | "failed";

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await prisma.tripRequest.findUnique({
    where: { id },
    include: {
      itinerary: { select: { id: true } },
      emailLogs: { orderBy: { createdAt: "desc" }, take: 1, select: { id: true } },
    },
  });

  if (!trip) notFound();
  if (["draft", "pending_payment"].includes(trip.status)) {
    redirect(`/paiement/${trip.id}`);
  }

  const status: Status = ["paid", "generating", "sent", "failed"].includes(trip.status)
    ? (trip.status as Status)
    : "generating";

  return (
    <ConfirmationExperience
      trip={toTripDTO(trip)}
      initialStatus={status}
      initialItineraryId={status === "sent" ? (trip.itinerary?.id ?? null) : null}
      initialEmailPreviewId={
        status === "sent" && env.AI_MOCK ? (trip.emailLogs[0]?.id ?? null) : null
      }
      mockMode={env.PAYMENT_MOCK || env.AI_MOCK}
    />
  );
}
