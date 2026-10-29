import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, LogOut, Plus, Sparkles, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/card";
import { PalmSticker, SunSticker } from "@/components/stickers/stickers";
import { DashboardLogin } from "@/components/dashboard/dashboard-login";
import { prisma } from "@/lib/db/prisma";
import { getSessionEmail } from "@/lib/auth/session";
import { toTripDTO, type TripDTO } from "@/lib/trips/dto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mes voyages",
  description: "Retrouve tous tes roadbooks Roamy.",
  robots: { index: false, follow: false },
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  sent: { label: "Prêt au départ", className: "bg-mint text-prune" },
  generating: { label: "En préparation", className: "bg-butter text-prune" },
  paid: { label: "En préparation", className: "bg-butter text-prune" },
  failed: { label: "À relancer", className: "bg-blush text-prune" },
  pending_payment: { label: "Paiement en attente", className: "bg-cream-warm text-prune" },
};

function imageForDestination(destination: string): string {
  const d = destination
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (d.includes("barcelone")) return "/images/day-born.jpg";
  if (d.includes("seville")) return "/images/dest-seville.jpg";
  if (d.includes("santorin")) return "/images/dest-santorini.jpg";
  if (d.includes("bali")) return "/images/dest-bali.jpg";
  if (d.includes("split") || d.includes("croatie")) return "/images/dest-split.jpg";
  if (d.includes("lisbonne") || d.includes("portugal")) return "/images/hero-apero.jpg";
  if (d.includes("grece") || d.includes("crete")) return "/images/hero-calanque.jpg";
  if (d.includes("road") || d.includes("islande")) return "/images/hero-roadtrip.jpg";
  return "/images/roadbook-costa-brava.jpg";
}

interface DashboardCard {
  trip: TripDTO;
  itineraryId: string | null;
}

function TripCard({ card, index }: { card: DashboardCard; index: number }) {
  const { trip, itineraryId } = card;
  const status = STATUS_LABELS[trip.status] ?? {
    label: trip.status,
    className: "bg-cream-warm text-prune",
  };
  const href =
    trip.status === "sent" && itineraryId
      ? `/itineraire/${itineraryId}`
      : trip.status === "pending_payment"
        ? `/paiement/${trip.id}`
        : `/confirmation/${trip.id}`;
  const cta =
    trip.status === "sent" && itineraryId
      ? "Voir le roadbook"
      : trip.status === "pending_payment"
        ? "Finaliser le paiement"
        : trip.status === "failed"
          ? "Relancer"
          : "Suivre la préparation";

  return (
    <figure
      className={`group bg-paper shadow-soft rounded-[1.5rem] p-3 pb-6 transition-transform duration-300 hover:rotate-0 ${
        index % 3 === 0 ? "-rotate-2" : index % 3 === 1 ? "rotate-1" : "rotate-2"
      }`}
    >
      <div className="bg-blush relative aspect-[4/3] overflow-hidden rounded-[1.1rem]">
        <Image
          src={imageForDestination(trip.destination)}
          alt={`Aperçu de ${trip.destination}`}
          fill
          sizes="(max-width: 768px) 90vw, 360px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute top-2.5 left-2.5 rounded-full px-3 py-1 text-[9px] font-extrabold tracking-[0.06em] uppercase ${status.className}`}
        >
          {status.label}
        </span>
      </div>
      <figcaption className="px-1 pt-4">
        <p className="font-display text-prune text-2xl leading-none uppercase">
          {trip.destination}
        </p>
        <p className="text-prune/70 mt-1 text-[12px] font-bold">
          {trip.datesLabel} · {trip.days} jour{trip.days > 1 ? "s" : ""} · {trip.travelers} pers.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={href}
            className="text-framboise-dark hover:text-prune inline-flex items-center gap-1.5 text-[12px] font-extrabold"
          >
            {cta}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          {trip.status === "sent" && itineraryId ? (
            <a
              href={`/api/itineraries/${itineraryId}/pdf`}
              className="text-prune/70 hover:text-framboise-dark inline-flex items-center gap-1.5 text-[12px] font-bold"
            >
              <Download className="size-3.5" aria-hidden="true" />
              PDF
            </a>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}

export default async function MyTripsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [email, query] = await Promise.all([getSessionEmail(), searchParams]);
  const error = Array.isArray(query.error) ? query.error[0] : query.error;
  const welcome = (Array.isArray(query.welcome) ? query.welcome[0] : query.welcome) === "1";

  if (!email) {
    return (
      <>
        <SiteHeader />
        <main id="contenu" className="bg-cream relative overflow-hidden pt-28 pb-20">
          <SunSticker className="absolute top-20 -right-16 size-56 opacity-30" rotate={8} />
          <div className="container-page max-w-4xl">
            <DashboardLogin linkError={error} />
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const trips = await prisma.tripRequest.findMany({
    where: { email, status: { not: "draft" } },
    orderBy: { createdAt: "desc" },
    include: { itinerary: { select: { id: true } } },
  });

  const cards: DashboardCard[] = trips.map((trip) => ({
    trip: toTripDTO(trip),
    itineraryId: trip.itinerary?.id ?? null,
  }));
  const firstName = cards[0]?.trip.firstName ?? "toi";

  return (
    <>
      <SiteHeader />
      <main id="contenu" className="bg-cream min-h-screen pt-28 pb-20">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Pill tone="blush">Carnet de voyage</Pill>
              <h1 className="display-section mt-3">Salut {firstName}, on repart ?</h1>
              <p className="text-prune/70 mt-2 max-w-xl text-[15px] leading-relaxed">
                Tous tes roadbooks, prêts à être ouverts, téléchargés ou relus au fond d&apos;une
                calanque sans réseau.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/planifier">
                  <Plus className="size-4" aria-hidden="true" />
                  Nouveau voyage
                </Link>
              </Button>
              <a
                href="/api/auth/logout"
                className="border-prune/20 text-prune/65 hover:border-prune hover:text-prune inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2.5 text-[12px] font-bold transition-colors"
              >
                <LogOut className="size-3.5" aria-hidden="true" />
                Se déconnecter
              </a>
            </div>
          </div>

          {welcome ? (
            <div
              role="status"
              className="bg-butter/70 text-prune mt-6 flex items-center gap-3 rounded-[1.25rem] p-4 text-[13px] font-semibold"
            >
              <Sparkles className="text-orange-ink size-4 shrink-0" aria-hidden="true" />
              Bienvenue à bord. Tes voyages sont juste là, en dessous.
            </div>
          ) : null}

          {cards.length === 0 ? (
            <div className="bg-paper shadow-soft relative mt-10 overflow-hidden rounded-[2.5rem] p-8 text-center md:p-14">
              <SunSticker className="absolute -top-8 -right-8 size-40 opacity-50" rotate={6} />
              <PalmSticker className="absolute -bottom-8 -left-6 size-32 opacity-80" rotate={-8} />
              <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center gap-4">
                <span className="bg-butter flex size-16 items-center justify-center rounded-full">
                  <Sparkles className="text-orange-ink size-7" aria-hidden="true" />
                </span>
                <h2 className="font-display text-3xl leading-none uppercase">
                  Ton premier roadbook t&apos;attend
                </h2>
                <p className="text-prune/70 text-[15px] leading-relaxed">
                  Aucun voyage pour cet email pour l&apos;instant. Réponds à 6 questions et on te
                  prépare un itinéraire qui te ressemble.
                </p>
                <Button asChild size="lg">
                  <Link href="/planifier">
                    Créer mon planning
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card, index) => (
                <TripCard key={card.trip.id} card={card} index={index} />
              ))}
            </div>
          )}

          <div className="border-prune/10 text-prune/70 mt-12 flex flex-col items-center gap-2 border-t pt-6 text-center text-[11px]">
            <p>
              Connecté en tant que <strong className="text-prune/70">{email}</strong>
            </p>
            <a
              href="mailto:bonjour@roamy.travel?subject=Suppression%20de%20mes%20donn%C3%A9es"
              className="hover:text-framboise-dark inline-flex items-center gap-1 underline underline-offset-2"
            >
              <Trash2 className="size-3" aria-hidden="true" />
              Demander la suppression de mes données
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
