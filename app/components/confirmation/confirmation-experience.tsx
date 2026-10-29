"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Download, Mail, MailCheck, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoLink } from "@/components/brand/logo";
import { FishSticker, SunSticker, WaveSticker, StarSticker } from "@/components/stickers/stickers";
import type { TripDTO } from "@/lib/trips/dto";

const MESSAGES = [
  "On cherche les meilleurs spots…",
  "On évite les pièges à touristes…",
  "On goûte les pizzas pour toi…",
  "On vérifie que la terrasse vaut le détour…",
  "On cale les pauses sieste au bon moment…",
  "On demande aux locaux leurs adresses secrètes…",
  "On relit tout pour ne pas t'envoyer n'importe quoi…",
];

type Status = "paid" | "generating" | "sent" | "failed";

interface StatusResponse {
  status: Status;
  itineraryId: string | null;
  emailPreviewId: string | null;
}

export function ConfirmationExperience({
  trip,
  initialStatus,
  initialItineraryId,
  initialEmailPreviewId,
  mockMode,
}: {
  trip: TripDTO;
  initialStatus: Status;
  initialItineraryId: string | null;
  initialEmailPreviewId: string | null;
  mockMode: boolean;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [itineraryId, setItineraryId] = useState<string | null>(initialItineraryId);
  const [emailPreviewId, setEmailPreviewId] = useState<string | null>(initialEmailPreviewId);
  const [messageIndex, setMessageIndex] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "sent" || status === "failed") return;
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/trips/${trip.id}/status`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as StatusResponse;
        setStatus(data.status);
        if (data.itineraryId) setItineraryId(data.itineraryId);
        if (data.emailPreviewId) setEmailPreviewId(data.emailPreviewId);
      } catch {
        // Keep polling; the network will come back.
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [status, trip.id]);

  useEffect(() => {
    if (status === "sent" || status === "failed") return;
    const interval = setInterval(() => {
      setMessageIndex((index) => (index + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [status]);

  async function retry() {
    setRetrying(true);
    setRetryError(null);
    try {
      const response = await fetch(`/api/trips/${trip.id}/retry`, { method: "POST" });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setRetryError(data.error ?? "On n'a pas réussi à relancer. Écris-nous.");
        setRetrying(false);
        return;
      }
      setStatus("generating");
    } catch {
      setRetryError("Petit souci de connexion. Réessaie.");
    } finally {
      setRetrying(false);
    }
  }

  const sent = status === "sent";
  const failed = status === "failed";
  const progress = sent ? 100 : failed ? 55 : 68;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#FFD9E5_0%,#FFE0EA_38%,#FFD0B8_100%)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <SunSticker
          className="absolute -top-16 -right-16 size-64 opacity-80 md:size-80"
          rotate={12}
        />
        <FishSticker
          className="animate-float absolute top-[24%] left-[6%] size-16 md:size-24"
          rotate={-8}
        />
        <WaveSticker className="absolute bottom-[20%] -left-12 size-40 opacity-70" rotate={-4} />
        <FishSticker
          className="animate-float absolute right-[8%] bottom-[24%] size-14 [animation-delay:1.2s] md:size-20"
          rotate={10}
        />
        <StarSticker className="absolute top-[16%] right-[18%] size-10" rotate={8} />
        <StarSticker className="absolute bottom-[12%] left-[18%] size-8" rotate={-5} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-6">
        <div className="flex items-center justify-between">
          <LogoLink />
          <span className="text-prune rounded-full bg-white/60 px-4 py-2 text-[11px] font-extrabold tracking-[0.08em] uppercase backdrop-blur">
            {mockMode ? "Mode démo" : "Commande sécurisée"}
          </span>
        </div>

        <main id="contenu" className="flex flex-1 items-center justify-center py-10">
          {!sent && !failed ? (
            <div className="bg-paper/95 shadow-lift w-full rounded-[2.5rem] p-6 text-center backdrop-blur sm:p-10">
              <div className="mx-auto mb-6 flex size-28 items-center justify-center md:size-32">
                <SunSticker className="animate-spin-slow size-full" rotate={0} />
              </div>
              <p className="text-framboise-dark text-[11px] font-extrabold tracking-[0.1em] uppercase">
                Génération en cours
              </p>
              <h1 className="font-display text-prune mt-2 text-[clamp(2.4rem,7vw,4rem)] leading-[0.95] uppercase">
                On prépare ton roadbook
              </h1>
              <p
                className="text-prune/75 mx-auto mt-3 max-w-md text-[16px] font-semibold"
                aria-live="polite"
              >
                {MESSAGES[messageIndex]}
              </p>

              <div className="mx-auto mt-7 max-w-md">
                <div className="bg-blush h-4 overflow-hidden rounded-full">
                  <div
                    className="bg-orange h-full rounded-full transition-[width] duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-prune/70 mt-2 text-[11px] font-bold">
                  En général 1 à 3 minutes. Tu peux laisser cet onglet ouvert.
                </p>
              </div>

              <div className="mx-auto mt-8 grid max-w-lg gap-2 text-left">
                {[
                  { label: "Paiement confirmé", done: true },
                  { label: "On fouille les bons plans", done: status === "generating" },
                  { label: "On écrit ton itinéraire jour par jour", done: false },
                  { label: "On prépare ton email + PDF", done: false },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className="bg-cream-soft flex items-center gap-3 rounded-2xl px-4 py-3"
                  >
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${
                        item.done ? "bg-orange text-prune" : "bg-butter text-prune/70"
                      }`}
                    >
                      {item.done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
                    </span>
                    <span className="text-prune/75 text-[13px] font-bold">{item.label}</span>
                  </div>
                ))}
              </div>

              <p className="text-prune/70 mt-6 text-[12px] font-semibold">
                Destination : <strong className="text-prune">{trip.destination}</strong> ·{" "}
                {trip.datesLabel}
              </p>
            </div>
          ) : null}

          {sent ? (
            <div className="bg-paper/95 shadow-lift w-full rounded-[2.5rem] p-6 text-center backdrop-blur sm:p-10">
              <div className="bg-butter mx-auto mb-6 flex size-24 items-center justify-center rounded-full md:size-28">
                <MailCheck className="text-orange-ink size-12" aria-hidden="true" />
              </div>
              <p className="text-framboise-dark text-[11px] font-extrabold tracking-[0.1em] uppercase">
                C&apos;est parti
              </p>
              <h1 className="font-display text-prune mt-2 text-[clamp(2.4rem,7vw,4rem)] leading-[0.95] uppercase">
                C&apos;est dans ta boîte mail !
              </h1>
              <p className="text-prune/75 mx-auto mt-3 max-w-md text-[16px] font-semibold">
                Ton roadbook {trip.destination} vient de partir vers{" "}
                <strong className="text-prune">{trip.emailMasked}</strong>. Vérifie aussi les spams,
                on sait jamais.
              </p>
              <p className="text-prune/70 mt-1 text-[12px] font-bold">
                Pense à vérifier l&apos;adresse : si elle est fausse, écris-nous vite.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                {itineraryId ? (
                  <>
                    <Button asChild size="lg">
                      <Link href={`/itineraire/${itineraryId}`}>
                        Voir mon itinéraire
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <a href={`/api/itineraries/${itineraryId}/pdf`}>
                        <Download className="size-4" aria-hidden="true" />
                        Télécharger le PDF
                      </a>
                    </Button>
                  </>
                ) : (
                  <p className="text-prune/70 text-sm font-bold">
                    L&apos;itinéraire est en cours de finalisation, recharge dans 10 secondes.
                  </p>
                )}
              </div>

              {emailPreviewId ? (
                <a
                  href={`/api/emails/${emailPreviewId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-framboise-dark mt-4 inline-flex items-center gap-2 text-[12px] font-extrabold underline underline-offset-4"
                >
                  <Mail className="size-3.5" aria-hidden="true" />
                  Voir l&apos;email envoyé (démo)
                </a>
              ) : null}

              <div className="bg-cream-soft text-prune/65 mt-8 rounded-[1.5rem] p-4 text-[13px] font-semibold">
                Un souci ? Réponds à l&apos;email ou écris à{" "}
                <a href="mailto:bonjour@roamy.travel" className="text-framboise-dark font-bold">
                  bonjour@roamy.travel
                </a>
                . On répond vite, même le dimanche.
              </div>
            </div>
          ) : null}

          {failed ? (
            <div className="bg-paper/95 shadow-lift w-full rounded-[2.5rem] p-6 text-center backdrop-blur sm:p-10">
              <div className="bg-blush mx-auto mb-6 flex size-24 items-center justify-center rounded-full">
                <Sparkles className="text-framboise-dark size-10" aria-hidden="true" />
              </div>
              <p className="text-framboise-dark text-[11px] font-extrabold tracking-[0.1em] uppercase">
                Petit accroc
              </p>
              <h1 className="font-display text-prune mt-2 text-[clamp(2.2rem,6.5vw,3.6rem)] leading-[0.95] uppercase">
                On n&apos;a pas fini, mais on ne lâche rien
              </h1>
              <p className="text-prune/75 mx-auto mt-3 max-w-md text-[15px] font-semibold">
                La génération a coincé après plusieurs essais. Ton paiement est bien enregistré : on
                peut relancer tout de suite, ou tu peux nous écrire et on s&apos;en occupe à la
                main.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button size="lg" onClick={retry} disabled={retrying}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  {retrying ? "On relance…" : "Relancer la génération"}
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="mailto:bonjour@roamy.travel">Écrire au support</a>
                </Button>
              </div>
              {retryError ? (
                <p role="alert" className="text-framboise-dark mt-3 text-sm font-bold">
                  {retryError}
                </p>
              ) : null}
              <p className="text-prune/70 mt-6 text-[12px] font-semibold">
                Commande {trip.id} — garde cette référence si tu nous écris.
              </p>
            </div>
          ) : null}
        </main>

        <p className="text-prune/70 pb-2 text-center text-[11px] font-semibold">
          © Roamy · Fait avec du soleil et un peu de café.
        </p>
      </div>
    </div>
  );
}
