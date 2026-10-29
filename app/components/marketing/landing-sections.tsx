import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MailCheck,
  Map,
  SlidersHorizontal,
  Sparkles,
  Star,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pill, SectionHeading } from "@/components/ui/card";
import { TRENDING_DESTINATIONS } from "@/lib/data/destinations";
import { PLAN_LIST, formatPrice } from "@/lib/config/site";
import {
  HibiscusSticker,
  LemonSticker,
  StarSticker,
  SunSticker,
} from "@/components/stickers/stickers";

const HOW_STEPS = [
  {
    number: 1,
    title: "Dis-nous ce que tu aimes",
    copy: "Tes dates, ton rythme, ton budget et tes envies : farniente, rando sauvage, street food ou culture pointue. Promis, c'est rapide.",
    badge: "⏱️ 3 min chrono",
    card: "bg-cream-warm",
    circle: "bg-butter text-prune",
    Icon: SlidersHorizontal,
  },
  {
    number: 2,
    title: "On te concocte ton roadbook sur mesure",
    copy: "Notre IA croise tes envies avec des pépites de locaux et un timing réaliste. Sans courir, sans t'ennuyer.",
    badge: "✨ Zéro piège à touriste",
    card: "bg-butter",
    circle: "bg-prune text-butter",
    Icon: Sparkles,
  },
  {
    number: 3,
    title: "Reçois ton itinéraire dans ta boîte mail",
    copy: "Un carnet clair, joli et prêt à glisser dans ta poche. PDF inclus, à ouvrir même au fond d'une calanque sans réseau.",
    badge: "📱 PDF hors-ligne",
    card: "bg-cream-warm",
    circle: "bg-orange text-prune",
    Icon: MailCheck,
  },
];

export function HowItWorks() {
  return (
    <section id="comment" className="bg-framboise text-white scroll-mt-24 py-20 md:py-24">
      <div className="container-page flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Simplicité totale"
            eyebrowTone="prune"
            title={<span className="text-white">Comment ça marche</span>}
            titleClassName="text-white"
          />
          <p className="text-white max-w-md text-[16px] leading-relaxed md:text-[17px]">
            Oublie les 42 onglets ouverts et les guides poussiéreux. Roamy structure ton périple
            sans prise de tête.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {HOW_STEPS.map(({ number, title, copy, badge, card, circle, Icon }) => (
            <article
              key={number}
              className={`text-prune flex min-h-[340px] flex-col justify-between rounded-[2rem] p-7 md:p-8 ${card}`}
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-display flex size-14 items-center justify-center rounded-full text-2xl ${circle}`}
                  >
                    {number}
                  </span>
                  <Icon className="text-orange size-9" aria-hidden="true" />
                </div>
                <h3 className="font-display text-[26px] leading-[1.08] uppercase">{title}</h3>
                <p className="text-prune/85 text-[15px] leading-relaxed">{copy}</p>
              </div>
              <span className="text-prune mt-6 inline-flex w-fit items-center rounded-full bg-white/80 px-4 py-2 text-[12px] font-bold">
                {badge}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DestinationsSection() {
  return (
    <section id="destinations" className="bg-cream scroll-mt-24 overflow-hidden py-20 md:py-24">
      <div className="container-page">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Coup de cœur de saison"
            title={
              <>
                Les destinations qui font
                <br />
                bronzer les group chats
              </>
            }
          />
          <p className="text-prune/75 max-w-sm text-[16px]">
            Quatre ambiances, quatre excuses pour partir. Clique, tu verras, ça donne envie.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {TRENDING_DESTINATIONS.map((destination, index) => (
            <Link
              key={destination.label}
              href={`/planifier?destination=${encodeURIComponent(destination.label)}`}
              className="group relative"
            >
              <div
                className={`bg-blush relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] ${
                  index % 2 === 0 ? "rotate-[-1.5deg]" : "rotate-[1.5deg]"
                } transition-transform duration-300 group-hover:rotate-0`}
              >
                <Image
                  src={destination.image ?? "/images/hero-calanque.jpg"}
                  alt={`${destination.name}, ${destination.country}`}
                  fill
                  sizes="(max-width: 768px) 45vw, 280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="bg-cream/95 text-prune absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-[11px] font-extrabold tracking-wider uppercase">
                  {destination.tag} {destination.emoji}
                </span>
              </div>
              <p className="font-display mt-3 text-xl leading-none uppercase">{destination.name}</p>
              <p className="text-framboise-dark text-[12px] font-bold">{destination.country}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RoadbookPreview() {
  return (
    <section id="apercu" className="bg-cream scroll-mt-24 overflow-hidden py-20 md:py-24">
      <div className="container-page grid items-center gap-14 lg:grid-cols-12">
        <div className="flex flex-col items-start gap-6 lg:col-span-6">
          <SectionHeading
            eyebrow="Carnet d'évasion"
            title={
              <>
                Un aperçu concret
                <br />
                de ton roadbook
              </>
            }
            intro="Pas de blabla générique de guide Wikipédia. Tu reçois un vrai itinéraire prêt à l'emploi, conçu pour maximiser chaque rayon de soleil."
          />

          <ul className="flex w-full flex-col gap-3 pt-2">
            {[
              {
                title: "Activités testées & recommandées",
                copy: "Adresses pépites, spots de baignade préservés et restaurants typiques sans la foule.",
                Icon: Star,
              },
              {
                title: "Timing réaliste et optimisé",
                copy: "Temps de trajet calculés, créneaux de visite idéaux et vraies pauses de détente.",
                Icon: Clock3,
              },
              {
                title: "Cartes interactives intégrées",
                copy: "Liens Google Maps et adresses en un clic depuis ton téléphone. Même en mode avion.",
                Icon: Map,
              },
            ].map(({ title, copy, Icon }) => (
              <li key={title} className="bg-blush/65 flex items-start gap-4 rounded-[1.25rem] p-4">
                <span className="bg-butter text-prune flex size-10 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-prune font-sans text-[15px] font-extrabold tracking-normal normal-case">
                    {title}
                  </h3>
                  <p className="text-prune/80 text-[14px] leading-relaxed">{copy}</p>
                </div>
              </li>
            ))}
          </ul>

          <Button asChild variant="prune" size="lg" className="mt-2">
            <Link href="/itineraire-demo">
              Découvrir un carnet type
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="relative flex justify-center lg:col-span-6">
          <SunSticker className="absolute -top-12 -right-2 size-28 md:size-32" rotate={10} />
          <div className="border-blush bg-paper shadow-lift relative z-10 w-full max-w-md rotate-2 rounded-[2rem] border p-5 md:p-6">
            <div className="border-blush flex items-center justify-between border-b-2 pb-5">
              <span className="font-display flex items-center gap-1.5 text-2xl lowercase">
                roamy <SunSticker className="size-5" rotate={0} />
              </span>
              <Pill tone="butter" className="px-3 py-1 text-[10px]">
                PDF • 7 jours
              </Pill>
            </div>

            <div className="py-5">
              <p className="text-framboise-dark text-[11px] font-extrabold tracking-[0.1em] uppercase">
                Itinéraire sur mesure
              </p>
              <h3 className="font-display mt-1 text-3xl leading-none uppercase">
                Costa Brava sauvage
              </h3>
              <p className="text-prune/75 text-[14px]">Gérone • Calella • Cadaqués</p>
            </div>

            <div className="bg-blush relative mb-5 h-44 overflow-hidden rounded-2xl">
              <Image
                src="/images/roadbook-costa-brava.jpg"
                alt="Village blanc de la Costa Brava avec bougainvilliers face à la mer"
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                {
                  day: "J1",
                  title: "Arrivée & Vieux Gérone",
                  sub: "Tapas cachées au Bar del Carmen",
                  tone: "bg-prune text-cream",
                },
                {
                  day: "J2",
                  title: "Criques de Begur à pied",
                  sub: "Cala Aiguablava sans les foules",
                  tone: "bg-orange text-prune",
                },
                {
                  day: "J3",
                  title: "Cap de Creus & Cadaqués",
                  sub: "Coucher de soleil au phare",
                  tone: "bg-prune text-cream",
                },
              ].map((row) => (
                <div
                  key={row.day}
                  className="bg-blush/55 flex items-center justify-between rounded-2xl p-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-8 items-center justify-center rounded-full text-[12px] font-extrabold ${row.tone}`}
                    >
                      {row.day}
                    </span>
                    <div>
                      <p className="text-[14px] leading-tight font-extrabold">{row.title}</p>
                      <p className="text-prune/70 text-[12px]">{row.sub}</p>
                    </div>
                  </div>
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
          <HibiscusSticker className="absolute -bottom-6 -left-2 size-20" rotate={-8} />
        </div>
      </div>
    </section>
  );
}

export function PhoneSection() {
  return (
    <section className="bg-cream-warm overflow-hidden py-20 md:py-24">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <div className="order-2 flex justify-center lg:order-1">
          <div className="border-prune bg-prune shadow-lift relative w-[270px] rotate-[-4deg] rounded-[3rem] border-[10px] p-1 md:w-[300px]">
            <div className="bg-prune absolute top-2 left-1/2 z-20 h-5 w-24 -translate-x-1/2 rounded-full" />
            <div className="bg-cream overflow-hidden rounded-[2.4rem]">
              <div className="bg-framboise px-5 pt-8 pb-5 text-white">
                <p className="font-display text-xl lowercase">roamy</p>
                <p className="text-butter mt-3 text-[10px] font-extrabold tracking-widest uppercase">
                  Ton roadbook
                </p>
                <p className="font-display text-2xl leading-none uppercase">Barcelone • 5 jours</p>
              </div>
              <div className="space-y-2 p-4">
                <div className="flex gap-1.5">
                  {["J1", "J2", "J3", "J4", "J5"].map((day, index) => (
                    <span
                      key={day}
                      className={`flex-1 rounded-full py-1 text-center text-[9px] font-extrabold ${
                        index === 0 ? "bg-framboise text-white" : "bg-butter text-prune"
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
                <div className="relative h-28 overflow-hidden rounded-2xl">
                  <Image
                    src="/images/day-born.jpg"
                    alt="Ruelle du quartier El Born à Barcelone"
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                </div>
                <p className="text-framboise-dark text-[9px] font-extrabold tracking-widest uppercase">
                  Jour 1 · Arrivée
                </p>
                <p className="font-display text-lg leading-none uppercase">Tapas dans El Born</p>
                {[
                  { time: "11:30", label: "Balade Passeig del Born" },
                  { time: "13:30", label: "Bar del Pla" },
                  { time: "21:00", label: "El Xampanyet" },
                ].map((item) => (
                  <div
                    key={item.time}
                    className="bg-blush/60 flex items-center gap-2 rounded-xl px-2 py-1.5"
                  >
                    <span className="text-framboise-dark text-[8px] font-extrabold">
                      {item.time}
                    </span>
                    <span className="text-[10px] font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <SunSticker className="absolute -top-6 -right-7 z-20 size-16" rotate={12} />
          </div>
        </div>

        <div className="order-1 flex flex-col items-start gap-6 lg:order-2">
          <SectionHeading
            eyebrow="Toujours avec toi"
            title={
              <>
                Ton roadbook
                <br />
                dans la poche
              </>
            }
            intro="Matin, aprèm, soir : tout est calé. Tu ouvres, tu suis, tu profites. Et si tu changes d'avis, tu peux adapter chaque journée."
          />
          <ul className="flex flex-col gap-3">
            {[
              "Planning heure par heure, sans surcharge",
              "Adresses, durée et budget pour chaque activité",
              "Astuce de local + plan B en cas de pluie",
              "Version PDF téléchargeable et email",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-[15px] font-semibold">
                <CheckCircle2 className="text-orange-ink size-5 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <Button asChild variant="prune">
            <Link href="/itineraire-demo">
              Voir le carnet en vrai
              <Smartphone className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    name: "Léa & ses potes",
    trip: "Lisbonne, 4 jours",
    quote:
      "On a arrêté de se disputer sur le programme au bout de 10 minutes. Le roadbook était tellement bien fichu qu'on a juste suivi le courant.",
    color: "bg-butter",
  },
  {
    name: "Malo",
    trip: "Barcelone, 5 jours",
    quote:
      "Les restos étaient exactement notre vibe : pas un piège à touristes, pas une ruine. La pause sieste de 15 h, masterclass.",
    color: "bg-blush",
  },
  {
    name: "Inès & Théo",
    trip: "Crète, 7 jours",
    quote:
      "On voulait plage + rando sans louer de voiture. Roamy a trouvé le combo parfait. Même le plan B pluie était cool.",
    color: "bg-mint",
  },
];

export function Testimonials() {
  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="container-page">
        <div className="flex flex-col items-center gap-3 text-center">
          <Pill tone="blush">Ils ont testé (exemples)</Pill>
          <h2 className="display-section">Des vacances, pas un devoir</h2>
          <p className="text-prune/70 max-w-xl text-[15px]">
            Témoignages de démonstration — à remplacer par de vrais avis clients avant mise en
            ligne.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <figure
              key={testimonial.name}
              className={`border-prune/10 relative rounded-[2rem] border p-7 ${
                index === 1 ? "md:-translate-y-4" : ""
              } ${testimonial.color}`}
            >
              <div className="text-orange-ink mb-4 flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-[16px] leading-relaxed font-semibold">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="bg-prune text-cream flex size-10 items-center justify-center rounded-full text-[11px] font-extrabold">
                  {testimonial.name.slice(0, 2).toUpperCase()}
                </span>
                <span>
                  <span className="block text-[14px] font-extrabold">{testimonial.name}</span>
                  <span className="text-prune/70 block text-[12px] font-bold">
                    {testimonial.trip}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section id="tarifs" className="bg-cream-warm scroll-mt-24 py-20 md:py-24">
      <div className="container-page flex flex-col gap-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <Pill>Tarifs transparents</Pill>
          <h2 className="display-section">Un prix fixe, zéro mauvaise surprise</h2>
          <p className="text-prune/80 text-[17px]">
            Moins cher qu&apos;une heure de ton temps passée à scroller des sites contradictoires.
            Et tu gardes ton roadbook pour toujours.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-4xl items-stretch gap-6 md:grid-cols-2 md:gap-8">
          {PLAN_LIST.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-[2rem] p-7 md:p-9 ${
                plan.highlight
                  ? "bg-framboise text-white"
                  : "border-blush bg-paper text-prune border"
              }`}
            >
              {plan.highlight ? (
                <span className="bg-orange absolute -top-4 right-7 rounded-full px-4 py-1.5 text-[11px] font-extrabold tracking-[0.09em] text-prune uppercase">
                  Le plus aimé
                </span>
              ) : null}

              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3
                    className={`font-display text-3xl leading-none uppercase ${
                      plan.highlight ? "text-butter" : "text-prune"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <Pill tone={plan.highlight ? "prune" : "blush"} className="px-3 py-1 text-[10px]">
                    {plan.badge}
                  </Pill>
                </div>

                <div className="flex items-baseline gap-2">
                  <span
                    className={`font-display text-5xl leading-none uppercase ${
                      plan.highlight ? "text-butter" : "text-prune"
                    }`}
                  >
                    {formatPrice(plan.priceCents)}
                  </span>
                  <span
                    className={`text-[14px] ${plan.highlight ? "text-white" : "text-prune/70"}`}
                  >
                    / itinéraire complet
                  </span>
                </div>

                <p
                  className={`text-[15px] leading-relaxed ${
                    plan.highlight ? "text-white" : "text-prune/80"
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="flex flex-col gap-3 pt-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[14px]">
                      <CheckCircle2
                        className={`mt-0.5 size-5 shrink-0 ${
                          plan.highlight ? "text-butter" : "text-orange-ink"
                        }`}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Button asChild variant={plan.highlight ? "primary" : "outline"} className="w-full">
                  <Link href={`/planifier?plan=${plan.id}`}>Choisir la formule {plan.name}</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
        <p className="text-prune/70 text-center text-[13px]">
          Paiement unique. Pas d&apos;abonnement caché. TVA incluse.{" "}
          <Link href="/cgv" className="hover:text-framboise-dark underline underline-offset-4">
            Voir les CGV
          </Link>
        </p>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="bg-framboise-deep text-white relative overflow-hidden py-20 md:py-24">
      <SunSticker className="absolute -right-20 -bottom-24 size-80 opacity-20" rotate={0} />
      <LemonSticker className="absolute top-10 -left-10 size-32 opacity-90" rotate={-12} />
      <StarSticker className="absolute top-10 right-[18%] size-14" rotate={8} />
      <div className="container-page relative z-10 flex flex-col items-center gap-7 text-center">
        <span className="bg-butter text-prune flex size-16 items-center justify-center rounded-full">
          <SunSticker className="size-10" rotate={0} />
        </span>
        <h2 className="font-display text-butter max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] uppercase">
          Prêt pour ta prochaine aventure ?
        </h2>
        <p className="text-white max-w-xl text-[17px] md:text-lg">
          Réponds au questionnaire en quelques clics et laisse Roamy s&apos;occuper du reste. Tes
          vacances parfaites commencent ici.
        </p>
        <Button asChild size="xl" className="mt-2">
          <Link href="/planifier">
            Planifier mon voyage maintenant
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </Button>
        <div className="text-white flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px]">
          <span>🔒 Paiement sécurisé</span>
          <span aria-hidden="true">•</span>
          <span>⚡ Génération en 3 min</span>
          <span aria-hidden="true">•</span>
          <span>🙂 Garantie sourire</span>
        </div>
      </div>
    </section>
  );
}

export const HOME_FAQS = [
  {
    question: "En combien de temps est livré mon itinéraire ?",
    answer:
      "Quelques minutes après le paiement. On génère ton roadbook complet, on vérifie la cohérence, puis on t'envoie le lien et le PDF par email. Si tu es pressé, tu peux suivre la génération en direct depuis la page de confirmation.",
  },
  {
    question: "Est-ce que Roamy réserve les hôtels et les vols pour moi ?",
    answer:
      "Non, on n'est pas une agence de voyages et on ne prend aucune commission sur tes réservations. On te donne les meilleures adresses et les liens directs pour réserver au prix réel, sans intermédiaire.",
  },
  {
    question: "Le carnet fonctionne-t-il sans connexion internet ?",
    answer:
      "Oui. Le PDF est 100 % hors-ligne une fois téléchargé sur ton téléphone. Les adresses restent visibles même en plein désert ou au fond d'une calanque sans réseau.",
  },
  {
    question: "Et si la météo est mauvaise sur place ?",
    answer:
      "Chaque journée Premium contient un plan B au sec : musées, ateliers d'artisans, halles gourmandes. Tu peux aussi nous écrire pour ajuster une journée.",
  },
  {
    question: "Vous gardez mes données combien de temps ?",
    answer:
      "Le temps nécessaire à la génération et à ton accès au roadbook. Tu peux demander la suppression de ton compte et de tes voyages à tout moment depuis la page confidentialité ou par email.",
  },
  {
    question: "Je peux modifier mon planning après réception ?",
    answer:
      "Oui : chaque voyage est accessible depuis « Mes voyages » avec ton email. Tu peux nous demander une régénération ou une adaptation d'une journée via le support.",
  },
];
