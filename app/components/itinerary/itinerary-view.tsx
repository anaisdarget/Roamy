import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Gauge,
  Luggage,
  Mail,
  MapPin,
  Sparkles,
  Utensils,
  Wallet,
} from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { TickerBand } from "@/components/marketing/ticker-band";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/card";
import { DayTabs } from "@/components/itinerary/day-tabs";
import { PalmSticker, SunSticker, WaveSticker } from "@/components/stickers/stickers";
import type { TripDTO } from "@/lib/trips/dto";
import type { StoredItinerary } from "@/lib/schemas/itinerary";
import { formatDateFr, formatDateRange } from "@/lib/utils/date";

const DAY_IMAGES = [
  "/images/day-born.jpg",
  "/images/day-bogatell.jpg",
  "/images/hero-calanque.jpg",
  "/images/hero-apero.jpg",
  "/images/roadbook-costa-brava.jpg",
  "/images/dest-seville.jpg",
  "/images/dest-santorini.jpg",
  "/images/dest-bali.jpg",
  "/images/dest-split.jpg",
  "/images/hero-roadtrip.jpg",
];

const PERIOD_TIMES = {
  morning: "09:30",
  afternoon: "14:00",
  evening: "19:30",
} as const;

const PERIOD_STYLES = {
  morning: "bg-rose-soft text-prune border border-framboise/20",
  afternoon: "bg-orange text-prune",
  evening: "bg-framboise text-white",
} as const;

function dayPeriods(day: StoredItinerary["days"][number]) {
  return [
    { key: "morning" as const, label: "Matin", data: day.morning },
    { key: "afternoon" as const, label: "Après-midi", data: day.afternoon },
    { key: "evening" as const, label: "Soir", data: day.evening },
  ];
}

export function ItineraryView({
  trip,
  itinerary,
  itineraryId,
  isDemo = false,
}: {
  trip: TripDTO;
  itinerary: StoredItinerary;
  itineraryId: string;
  isDemo?: boolean;
}) {
  const city = trip.destination.split(",")[0]?.trim() || trip.destination;
  const pdfHref = isDemo ? "/itineraire-demo/pdf" : `/api/itineraries/${itineraryId}/pdf`;
  const allActivities = itinerary.days.flatMap((day) => [
    ...day.morning.activities,
    ...day.afternoon.activities,
    ...day.evening.activities,
  ]);
  const spotsCount = allActivities.length + itinerary.restaurants.length;
  const dailyAverage = Math.round(itinerary.budget.perPerson / Math.max(1, trip.days));
  const areas = Array.from(new Set(allActivities.map((activity) => activity.area))).slice(0, 4);
  const tickerItems = [
    ...trip.interestLabels,
    "Spots secrets",
    "Food locale",
    "Zéro piège à touristes",
  ];
  const budgetRows = [
    { label: "Hébergement", value: itinerary.budget.accommodation, color: "bg-framboise" },
    { label: "Food & drinks", value: itinerary.budget.food, color: "bg-orange" },
    { label: "Activités", value: itinerary.budget.activities, color: "bg-sun" },
    { label: "Transports", value: itinerary.budget.transport, color: "bg-blush" },
  ];
  const total = itinerary.budget.total || 1;

  return (
    <>
      <SiteHeader />
      <main id="contenu" className="bg-cream pt-20">
        <section className="bg-framboise relative overflow-hidden px-5 py-12 text-white md:py-16">
          <SunSticker
            className="absolute -top-8 -right-8 size-40 opacity-25 md:size-64"
            rotate={10}
          />
          <WaveSticker className="absolute right-[18%] -bottom-10 size-32 opacity-30" rotate={-4} />
          <div className="container-page relative z-10 flex flex-col gap-7">
            <Link
              href={isDemo ? "/" : "/mes-voyages"}
              className="text-butter inline-flex w-fit items-center gap-2 text-[13px] font-bold transition-colors hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {isDemo ? "Retour à l'accueil" : "Retour à mes voyages"}
            </Link>

            <div className="flex max-w-4xl flex-col gap-3">
              <p className="text-butter text-[11px] font-extrabold tracking-[0.12em] uppercase">
                {isDemo ? "Exemple de roadbook" : "Ton roadbook sur mesure"}
              </p>
              <h1 className="font-display text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[0.95] text-white uppercase">
                Ton séjour à {city} :{" "}
                <span className="text-sun">
                  {trip.days} jour{trip.days > 1 ? "s" : ""} au soleil
                </span>
              </h1>
              <p className="text-cream max-w-2xl text-[16px] leading-relaxed font-medium md:text-lg">
                Itinéraire généré sur mesure pour {trip.firstName} et ses {trip.travelers} voyageur
                {trip.travelers > 1 ? "s" : ""}. Rythme {trip.rhythmLabel.toLowerCase()}, envies de{" "}
                {trip.interestLabels.slice(0, 3).join(", ").toLowerCase()}. Testé par des locaux,
                validé pour maximiser la vitamine D et éviter les pièges à touristes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <a href={pdfHref}>
                  <Download className="size-4" aria-hidden="true" />
                  Télécharger le PDF complet
                </a>
              </Button>
              {isDemo ? (
                <Button asChild variant="outlineLight" size="lg">
                  <Link href="/planifier">
                    Créer le mien
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              ) : (
                <span className="bg-prune/30 text-cream rounded-full px-4 py-2 text-[11px] font-bold tracking-[0.06em] uppercase">
                  Commande {trip.id.slice(-6).toUpperCase()}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 md:grid-cols-4">
              {[
                { label: "Durée", value: `${trip.days} jours`, Icon: CalendarDays },
                { label: "Pépites", value: `${spotsCount} spots`, Icon: MapPin },
                { label: "Moyenne", value: `~${dailyAverage} € / jour`, Icon: Wallet },
                { label: "Cadence", value: trip.rhythmLabel, Icon: Gauge },
              ].map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="border-sun bg-sun text-prune shadow-soft flex items-center gap-3 rounded-full border px-4 py-3"
                >
                  <Icon className="text-orange-ink-ink size-6 shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-prune/70 text-[9px] font-extrabold tracking-[0.08em] uppercase">
                      {label}
                    </p>
                    <p className="font-display text-base leading-[1.05] uppercase md:text-xl">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TickerBand items={tickerItems} />

        <section className="container-page grid gap-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-prune text-[12px] font-extrabold tracking-[0.09em] uppercase">
                  Sélectionner un jour
                </span>
                <span className="text-framboise-dark text-[12px] font-bold">
                  {formatDateRange(trip.startISO, trip.endISO)}
                </span>
              </div>
              <DayTabs
                days={itinerary.days.map((day, index) => ({
                  date: day.date,
                  theme: day.theme,
                  label: `Jour ${index + 1}`,
                }))}
              />
            </div>

            {itinerary.days.map((day, index) => (
              <article
                key={day.date}
                id={`jour-${index + 1}`}
                className="border-blush bg-paper shadow-soft scroll-mt-40 rounded-[2rem] border p-6 md:p-9"
              >
                <header className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold tracking-[0.06em] uppercase ${
                        index % 2 === 0 ? "bg-orange text-prune" : "bg-framboise text-white"
                      }`}
                    >
                      {formatDateFr(day.date, "day")}
                    </span>
                    <span className="text-framboise-dark text-[12px] font-bold">{day.theme}</span>
                  </div>
                  <h2 className="font-display text-prune text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[0.98] uppercase">
                    Jour {index + 1} • {day.theme}
                  </h2>
                </header>

                <div className="flex justify-center py-6">
                  <figure
                    className={`border-rose-tint bg-cream-warm shadow-soft w-full max-w-md rounded-[1.4rem] border p-3 transition-transform duration-300 hover:rotate-0 ${
                      index % 2 === 0 ? "-rotate-2" : "rotate-2"
                    }`}
                  >
                    <div className="bg-blush relative h-56 overflow-hidden rounded-2xl md:h-64">
                      <Image
                        src={DAY_IMAGES[index % DAY_IMAGES.length]}
                        alt={`Ambiance du jour ${index + 1} à ${city}`}
                        fill
                        loading="eager"
                        sizes="(max-width: 768px) 90vw, 420px"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="text-prune/75 pt-3 text-center text-[12px] font-semibold italic">
                      {day.morning.activities[0]?.area ?? city} — repéré par Roamy
                    </figcaption>
                  </figure>
                </div>

                <div className="flex flex-col gap-6">
                  {dayPeriods(day).map((period) => (
                    <section key={period.key} className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-[0.05em] uppercase ${PERIOD_STYLES[period.key]}`}
                        >
                          {PERIOD_TIMES[period.key]} • {period.label}
                        </span>
                      </div>
                      {period.data.activities.map((item, itemIndex) => (
                        <div key={`${period.key}-${itemIndex}`} className="flex flex-col gap-1.5">
                          <h3 className="text-prune text-[16px] leading-snug font-extrabold">
                            {item.title}
                          </h3>
                          <p className="text-prune/80 text-[14px] leading-relaxed">
                            {item.description}
                          </p>
                          <div className="text-prune/70 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold">
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="text-orange-ink size-3.5" aria-hidden="true" />
                              {item.duration}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Wallet className="text-orange-ink size-3.5" aria-hidden="true" />
                              {item.cost}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="text-orange-ink size-3.5" aria-hidden="true" />
                              {item.area}
                            </span>
                          </div>
                          {item.tip ? (
                            <p className="text-framboise-dark/80 text-[12px] font-semibold italic">
                              Astuce : {item.tip}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </section>
                  ))}
                </div>

                {day.tip ? (
                  <div className="border-orange bg-butter mt-6 flex items-start gap-3 rounded-[1.25rem] border-l-4 p-4">
                    <SunSticker className="size-9 shrink-0" rotate={0} />
                    <div>
                      <p className="text-prune text-[10px] font-extrabold tracking-[0.08em] uppercase">
                        Astuce Roamy de local
                      </p>
                      <p className="text-prune mt-1 text-[13px] leading-relaxed font-medium">
                        {day.tip}
                      </p>
                    </div>
                  </div>
                ) : null}

                {day.transport ? (
                  <div className="border-rose-tint bg-rose-soft mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4">
                    <span className="text-prune flex items-center gap-2 text-[13px] font-semibold">
                      <MapPin className="text-framboise-dark size-4" aria-hidden="true" />
                      {day.transport}
                    </span>
                    <Pill tone="butter" className="px-3 py-1 text-[10px]">
                      Repéré pour toi
                    </Pill>
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <aside className="flex flex-col gap-6 lg:col-span-5">
            <section className="border-blush bg-paper shadow-soft rounded-[2rem] border p-5 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-2xl leading-none uppercase">Carte des spots</h2>
                <Pill tone="butter" className="px-3 py-1 text-[10px]">
                  {spotsCount} adresses
                </Pill>
              </div>
              <p className="text-prune/65 mt-2 text-[12px] leading-relaxed">
                Tous les points d&apos;intérêt de ton séjour, regroupés par quartier et prêts à
                ouvrir dans Maps.
              </p>

              <div className="border-prune/10 relative mt-4 h-72 overflow-hidden rounded-[1.25rem] border bg-[#E6F2E4]">
                <svg
                  viewBox="0 0 400 300"
                  className="absolute inset-0 size-full"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <rect width="400" height="300" fill="#E6F2E4" />
                  <path
                    d="M-20 230 C80 190 110 250 190 220 S320 160 420 200"
                    fill="none"
                    stroke="#9DC5E8"
                    strokeWidth="26"
                  />
                  <path
                    d="M-20 80 C60 120 120 60 200 100 S330 130 420 90"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="12"
                  />
                  <path
                    d="M60 -20 C90 70 40 140 90 220 S120 280 110 320"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="9"
                  />
                  <path
                    d="M300 -20 C280 70 330 130 290 210 S250 280 270 320"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="9"
                  />
                  <path d="M0 160 H400" fill="none" stroke="#FFFFFF" strokeWidth="7" />
                  <path d="M150 0 V300" fill="none" stroke="#FFFFFF" strokeWidth="6" />
                  <circle cx="335" cy="75" r="34" fill="#BFE3B4" />
                  <circle cx="70" cy="245" r="26" fill="#BFE3B4" />
                  <circle cx="215" cy="155" r="10" fill="#FFE99A" />
                </svg>
                {[
                  { left: "22%", top: "30%", color: "bg-framboise" },
                  { left: "58%", top: "48%", color: "bg-orange" },
                  { left: "38%", top: "70%", color: "bg-prune" },
                  { left: "76%", top: "26%", color: "bg-orange" },
                  { left: "68%", top: "76%", color: "bg-framboise" },
                ].map((pin, index) => (
                  <span
                    key={index}
                    className={`absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white ${pin.color} shadow-soft text-white`}
                    style={{ left: pin.left, top: pin.top }}
                    aria-hidden="true"
                  >
                    <MapPin className="size-3.5" />
                  </span>
                ))}
                <div className="bg-paper shadow-soft absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-full px-3 py-2">
                  <span className="text-prune truncate text-[11px] font-bold">
                    {areas.join(" • ") || city}
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.destination)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="bg-framboise hover:bg-orange shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold text-white transition-colors"
                  >
                    Ouvrir la carte
                  </a>
                </div>
              </div>
            </section>

            <section className="border-blush bg-paper shadow-soft rounded-[2rem] border p-6">
              <div className="flex items-center gap-3">
                <span className="bg-butter text-prune flex size-10 items-center justify-center rounded-full">
                  <CheckCircle2 className="text-orange-ink size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-2xl leading-none uppercase">
                    Ce qui est inclus
                  </h2>
                  <p className="text-framboise-dark text-[11px] font-bold">
                    Dans ton roadbook Roamy
                  </p>
                </div>
              </div>
              <ul className="text-prune mt-4 flex flex-col gap-3 text-[13px] font-semibold">
                {[
                  `Itinéraire détaillé heure par heure pour ${trip.days} jours`,
                  `${spotsCount} adresses repérées (restos, spots, pauses)`,
                  "Fichier PDF à télécharger et version email",
                  "Conseils météo, transports, sécurité et us locaux",
                  "Assistance par email 7j/7",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="text-orange-ink mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border-rose-tint bg-rose-soft mt-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3">
                <span className="text-prune text-[11px] font-bold">Statut du dossier :</span>
                <span className="text-orange-ink text-[12px] font-extrabold tracking-[0.04em] uppercase">
                  Prêt au départ ✈️
                </span>
              </div>
            </section>

            <section className="border-blush bg-paper shadow-soft rounded-[2rem] border p-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-2xl leading-none uppercase">
                  Répartition du budget
                </h2>
                <span className="text-framboise-dark text-[12px] font-extrabold">
                  ~{itinerary.budget.perPerson} € / pers
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {budgetRows.map((row) => (
                  <div key={row.label} className="flex flex-col gap-1">
                    <div className="text-prune flex justify-between text-[11px] font-bold">
                      <span>{row.label}</span>
                      <span>
                        {Math.round((row.value / total) * 100)} % ({row.value} €)
                      </span>
                    </div>
                    <div className="bg-rose-soft h-3 overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full ${row.color}`}
                        style={{ width: `${Math.max(2, Math.round((row.value / total) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-blush mt-4 flex items-baseline justify-between border-t pt-3">
                <span className="text-prune text-[12px] font-extrabold">Total groupe</span>
                <span className="font-display text-framboise-dark text-2xl">
                  {itinerary.budget.total} €
                </span>
              </div>
              <p className="text-prune/70 mt-2 text-center text-[10px] italic">
                Estimation hors vols internationaux, calculée au moment de la génération.
              </p>
            </section>

            <section className="border-blush bg-paper shadow-soft rounded-[2rem] border p-6">
              <div className="flex items-center gap-3">
                <span className="bg-butter text-prune flex size-10 items-center justify-center rounded-full">
                  <Utensils className="text-orange-ink size-5" aria-hidden="true" />
                </span>
                <h2 className="font-display text-2xl leading-none uppercase">
                  Nos tables repérées
                </h2>
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                {itinerary.restaurants.slice(0, 5).map((restaurant) => (
                  <li key={restaurant.name} className="border-blush border-b pb-2 last:border-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-prune text-[13px] font-extrabold">{restaurant.name}</p>
                        <p className="text-framboise-dark text-[10px] font-bold">
                          {restaurant.cuisine} · {restaurant.area}
                        </p>
                        <p className="text-prune/70 mt-1 text-[11px] leading-relaxed">
                          {restaurant.why}
                        </p>
                      </div>
                      <span className="bg-butter shrink-0 rounded-full px-2 py-1 text-[9px] font-extrabold">
                        {restaurant.priceRange}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-orange/40 bg-butter shadow-soft relative overflow-hidden rounded-[2rem] border-2 p-6">
              <div className="flex items-center justify-between gap-2">
                <Luggage className="text-orange-ink size-7" aria-hidden="true" />
                <span className="bg-prune text-sun rotate-3 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase">
                  Pack light !
                </span>
              </div>
              <h2 className="font-display mt-3 text-2xl leading-none uppercase">Notes & valise</h2>
              <ul className="text-prune mt-3 flex flex-col gap-2 text-[12px] leading-relaxed">
                {itinerary.packingHints.map((hint) => (
                  <li key={hint}>• {hint}</li>
                ))}
              </ul>
              <div className="border-prune/10 mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-prune text-[10px] font-bold">
                  Prêt pour l&apos;embarquement ?
                </span>
                <span className="text-orange-ink text-[10px] font-extrabold tracking-[0.06em] uppercase">
                  Vamos amigo 💃
                </span>
              </div>
              <PalmSticker className="absolute -right-4 -bottom-5 size-20 opacity-70" rotate={10} />
            </section>

            <p className="bg-blush/60 text-prune/65 rounded-[1.25rem] p-4 text-[10px] leading-relaxed">
              {itinerary.disclaimer}
            </p>
          </aside>
        </section>

        <section className="bg-framboise px-5 py-14 text-white md:py-16">
          <div className="container-page flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h2 className="font-display text-sun text-[clamp(2rem,4.5vw,3.2rem)] leading-[0.95] uppercase">
                Besoin d&apos;ajuster une journée ?
              </h2>
              <p className="max-w-xl text-[15px] font-medium text-white">
                Échange un musée contre une après-midi plage, ajoute un resto ou change de quartier
                : on s&apos;occupe de la nouvelle version.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/planifier">
                  Personnaliser ce roadbook
                  <Sparkles className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outlineLight" size="lg">
                <a href="mailto:bonjour@roamy.travel">
                  <Mail className="size-4" aria-hidden="true" />
                  Poser une question
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
