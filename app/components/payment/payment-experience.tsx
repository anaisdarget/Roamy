"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Lock,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/card";
import { Logo } from "@/components/brand/logo";
import type { TripDTO } from "@/lib/trips/dto";
import { PLANS, formatPrice } from "@/lib/config/site";

const STEP_LINKS: Record<string, number> = {
  destination: 1,
  dates: 2,
  budget: 3,
  interests: 4,
  rhythm: 5,
  identity: 6,
};

function EditLink({ step, label }: { step: keyof typeof STEP_LINKS; label?: string }) {
  return (
    <Link
      href={`/planifier?step=${STEP_LINKS[step]}`}
      className="text-framboise-dark hover:text-prune inline-flex items-center gap-1 text-[11px] font-extrabold tracking-[0.06em] uppercase transition-colors"
    >
      <Pencil className="size-3" aria-hidden="true" />
      {label ?? "Modifier"}
    </Link>
  );
}

export function PaymentExperience({
  trip,
  canceled,
  mockMode,
}: {
  trip: TripDTO;
  canceled: boolean;
  mockMode: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plan = PLANS[trip.plan];

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: trip.id }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setError(data.error ?? "Le paiement n'a pas pu démarrer. Réessaie.");
        setLoading(false);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError("Petit souci de connexion. Vérifie ton réseau et réessaie.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="border-blush bg-cream-soft border-b">
        <div className="container-page flex h-16 items-center justify-between">
          <Link
            href={`/planifier?step=6`}
            className="text-prune/70 hover:text-framboise-dark inline-flex items-center gap-2 text-[13px] font-bold transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour au questionnaire
          </Link>
          <Logo />
        </div>
      </div>

      <main id="contenu" className="container-page max-w-5xl pt-10 pb-20 md:pt-14">
        <div className="mx-auto mb-8 flex max-w-2xl flex-col items-center gap-3 text-center">
          <Pill tone="blush">Dernière étape</Pill>
          <h1 className="display-section">Ton voyage est prêt à décoller</h1>
          <p className="text-prune/75 max-w-xl text-[16px] leading-relaxed">
            Vérifie le programme, règle une fois, et ton roadbook sur mesure part en génération. Pas
            d&apos;abonnement, pas de frais cachés.
          </p>
          {mockMode ? (
            <Pill tone="butter" className="mt-1 px-3 py-1 text-[10px]">
              Mode démo · aucun paiement réel
            </Pill>
          ) : null}
        </div>

        {canceled ? (
          <div
            role="status"
            className="border-butter bg-cream-warm text-prune mx-auto mb-6 flex max-w-3xl items-start gap-3 rounded-[1.25rem] border-2 p-4 text-[14px]"
          >
            <Clock3 className="text-orange-ink mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p>
              <strong>Paiement annulé.</strong> Aucun souci : tes réponses sont gardées au chaud. Tu
              peux reprendre quand tu veux, le prix ne bouge pas.
            </p>
          </div>
        ) : null}

        <div className="bg-paper shadow-soft relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
          <div className="grid lg:grid-cols-[1fr_320px]">
            <div className="p-6 sm:p-8 md:p-10">
              <div className="border-blush flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed pb-5">
                <div className="text-framboise-dark flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] uppercase">
                  <MapPin className="size-4" aria-hidden="true" />
                  Billet d&apos;embarquement
                </div>
                <div className="bg-butter text-prune flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-[0.08em] uppercase">
                  {trip.planName} · {formatPrice(trip.priceCents)}
                </div>
              </div>

              <div className="py-6">
                <p className="text-prune/70 text-[11px] font-extrabold tracking-[0.1em] uppercase">
                  Destination
                </p>
                <h2 className="font-display text-prune text-[clamp(2.2rem,6vw,3.8rem)] leading-[0.95] uppercase">
                  {trip.destination}
                </h2>
                <p className="text-prune/70 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-bold">
                  <span>{trip.datesLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {trip.days} jour{trip.days > 1 ? "s" : ""}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {trip.travelers} voyageur{trip.travelers > 1 ? "s" : ""}
                  </span>
                </p>
              </div>

              <dl className="border-blush grid gap-x-6 gap-y-4 border-t border-dashed pt-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <span className="bg-blush text-prune flex size-9 shrink-0 items-center justify-center rounded-full">
                    <CalendarDays className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <dt className="text-prune/70 text-[10px] font-extrabold tracking-[0.08em] uppercase">
                      Dates
                    </dt>
                    <dd className="text-prune text-[15px] font-extrabold">{trip.datesLabel}</dd>
                    {trip.flexibleDates ? (
                      <dd className="text-framboise-dark text-[11px] font-semibold">
                        Flexible ±3 jours
                      </dd>
                    ) : null}
                  </div>
                  <EditLink step="dates" />
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-butter text-prune flex size-9 shrink-0 items-center justify-center rounded-full">
                    <Users className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <dt className="text-prune/70 text-[10px] font-extrabold tracking-[0.08em] uppercase">
                      Équipe
                    </dt>
                    <dd className="text-prune text-[15px] font-extrabold">
                      {trip.adults} adulte{trip.adults > 1 ? "s" : ""}
                      {trip.children > 0
                        ? ` · ${trip.children} enfant${trip.children > 1 ? "s" : ""}`
                        : ""}
                      {trip.babies > 0 ? ` · ${trip.babies} bébé${trip.babies > 1 ? "s" : ""}` : ""}
                    </dd>
                  </div>
                  <EditLink step="dates" />
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-cream-warm text-prune flex size-9 shrink-0 items-center justify-center rounded-full">
                    <Wallet className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <dt className="text-prune/70 text-[10px] font-extrabold tracking-[0.08em] uppercase">
                      Budget
                    </dt>
                    <dd className="text-prune text-[15px] font-extrabold">
                      {trip.budgetAmount} € / pers · {trip.budgetLevelLabel}
                    </dd>
                  </div>
                  <EditLink step="budget" />
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-mint/70 text-prune flex size-9 shrink-0 items-center justify-center rounded-full">
                    <Sparkles className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <dt className="text-prune/70 text-[10px] font-extrabold tracking-[0.08em] uppercase">
                      Rythme
                    </dt>
                    <dd className="text-prune text-[15px] font-extrabold">{trip.rhythmLabel}</dd>
                  </div>
                  <EditLink step="rhythm" />
                </div>
              </dl>

              {trip.interestLabels.length > 0 ? (
                <div className="border-blush mt-6 flex flex-wrap items-center gap-2 border-t border-dashed pt-5">
                  <span className="text-prune/70 mr-1 text-[10px] font-extrabold tracking-[0.08em] uppercase">
                    Envies
                  </span>
                  {trip.interestLabels.map((interest) => (
                    <span
                      key={interest}
                      className="bg-butter text-prune rounded-full px-3 py-1.5 text-[11px] font-extrabold"
                    >
                      {interest}
                    </span>
                  ))}
                  <span className="ml-auto">
                    <EditLink step="interests" />
                  </span>
                </div>
              ) : null}

              {trip.notes || trip.dietary || trip.accommodation || trip.transport ? (
                <div className="bg-cream-soft text-prune/75 mt-5 rounded-2xl p-4 text-[13px] leading-relaxed">
                  <p className="text-prune mb-1 text-[10px] font-extrabold tracking-[0.08em] uppercase">
                    Tes précisions
                  </p>
                  {trip.dietary ? <p>Alimentation : {trip.dietary}</p> : null}
                  {trip.accommodation ? <p>Hébergement : {trip.accommodation}</p> : null}
                  {trip.transport ? <p>Transport : {trip.transport}</p> : null}
                  {trip.notes ? <p className="mt-1 italic">“{trip.notes}”</p> : null}
                  <div className="mt-2">
                    <EditLink step="identity" label="Modifier mes précisions" />
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="border-prune/20 bg-cream-warm relative flex flex-col justify-between gap-6 border-t-2 border-dashed p-6 sm:p-8 lg:border-t-0 lg:border-l-2">
              <span
                aria-hidden="true"
                className="bg-cream absolute -top-3 -left-3 hidden size-6 rounded-full lg:block"
              />
              <span
                aria-hidden="true"
                className="bg-cream absolute -bottom-3 -left-3 hidden size-6 rounded-full lg:block"
              />

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="bg-orange text-prune flex size-32 rotate-6 flex-col items-center justify-center rounded-full shadow-[0_5px_0_rgba(74,15,46,0.12)]">
                  <span className="font-display text-4xl leading-none">
                    {formatPrice(trip.priceCents)}
                  </span>
                  <span className="mt-1 text-[10px] font-extrabold tracking-[0.08em] uppercase">
                    paiement unique
                  </span>
                </div>
                <p className="text-prune/70 text-[12px] font-semibold">
                  Un seul paiement pour tout le groupe,
                  <br />
                  quel que soit le nombre de voyageurs.
                </p>
              </div>

              <ul className="text-prune flex flex-col gap-2.5 text-[13px] font-semibold">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle2
                      className="text-orange-ink mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3">
                <Button size="lg" onClick={checkout} disabled={loading} className="w-full">
                  {loading ? (
                    "On prépare le paiement…"
                  ) : mockMode ? (
                    <>
                      <Zap className="size-4" aria-hidden="true" />
                      Simuler le paiement
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" aria-hidden="true" />
                      Payer {formatPrice(trip.priceCents)}
                    </>
                  )}
                </Button>
                <p className="text-prune/70 text-center text-[10px] leading-relaxed font-semibold">
                  Paiement sécurisé par Stripe
                  <br />
                  Apple Pay & Google Pay acceptés
                </p>
                {error ? (
                  <p
                    role="alert"
                    className="bg-framboise/10 text-framboise-dark rounded-xl p-3 text-[12px] font-bold"
                  >
                    {error}
                  </p>
                ) : null}
              </div>
            </aside>
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { Icon: ShieldCheck, label: "Paiement sécurisé" },
            { Icon: Zap, label: "Livraison en 3 min" },
            { Icon: Mail, label: "Email + PDF" },
            { Icon: BadgeCheck, label: "Satisfait ou on retente" },
          ].map(({ Icon, label }) => (
            <div
              key={label}
              className="bg-paper text-prune/70 flex items-center gap-2 rounded-2xl px-3 py-3 text-[10px] font-extrabold tracking-[0.04em] uppercase"
            >
              <Icon className="text-orange-ink size-4 shrink-0" aria-hidden="true" />
              {label}
            </div>
          ))}
        </div>

        <p className="text-prune/70 mx-auto mt-6 max-w-2xl text-center text-[11px] leading-relaxed">
          En validant, tu acceptes les{" "}
          <Link href="/cgv" className="underline underline-offset-2">
            CGV
          </Link>{" "}
          et la{" "}
          <Link href="/confidentialite" className="underline underline-offset-2">
            politique de confidentialité
          </Link>
          . Prix TTC. Aucun abonnement. Codes promo acceptés au moment du paiement.
        </p>
      </main>
    </div>
  );
}
