import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowerIcon } from "@/components/brand/icons";
import { SunSticker, HibiscusSticker, PalmSticker } from "@/components/stickers/stickers";

const POLAROIDS = [
  {
    src: "/images/hero-calanque.jpg",
    alt: "Une calanque turquoise bordée de falaises dorées sous le soleil",
    caption: "calanque secrète • 11:30",
    className: "z-30 left-0 top-0 w-[54%] -rotate-3 sm:w-[56%] lg:left-2 lg:top-0 lg:w-60",
    sizes: "(max-width: 768px) 55vw, 240px",
    priority: true,
  },
  {
    src: "/images/hero-apero.jpg",
    alt: "Deux cocktails colorés posés sur une table face au coucher de soleil",
    caption: "apéro coucher de soleil • 19:45",
    className: "z-20 right-0 top-[16%] w-[56%] rotate-3 sm:w-[58%] lg:right-0 lg:top-20 lg:w-64",
    sizes: "(max-width: 768px) 54vw, 256px",
    priority: false,
  },
  {
    src: "/images/hero-roadtrip.jpg",
    alt: "Deux amis souriants dans un cabriolet sur une route côtière",
    caption: "road trip liberté • jour 3",
    className:
      "z-10 bottom-0 left-0 w-[48%] -rotate-1 sm:w-[50%] lg:bottom-[-1rem] lg:left-0 lg:w-52",
    sizes: "(max-width: 768px) 52vw, 224px",
    priority: false,
  },
];

export function LandingHero() {
  return (
    <section className="bg-cream relative overflow-hidden pt-8 pb-20 md:pt-12 md:pb-28">
      <div className="container-page relative z-10 grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col items-start gap-6 lg:col-span-7">
          <span className="bg-butter text-prune inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-extrabold tracking-[0.09em] uppercase md:text-xs">
            <SunSticker className="size-5" rotate={0} />
            Ton copilote vacances 100 % sur-mesure
          </span>

          <h1 className="display-hero text-prune">
            Ton voyage,
            <br />
            planifié pour toi.
          </h1>

          <p className="text-prune/85 max-w-xl text-[18px] leading-relaxed md:text-xl">
            Remplis ton questionnaire en 3 minutes. Reçois instantanément ton itinéraire
            personnalisé jour par jour en PDF dans ta boîte mail.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="xl">
              <Link href="/planifier">
                Créer mon planning
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link href="/itineraire-demo">Voir un exemple</Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-3">
            <div className="flex -space-x-2" aria-hidden="true">
              {[
                { initials: "LC", color: "bg-butter text-prune" },
                { initials: "MB", color: "bg-framboise text-white" },
                { initials: "TS", color: "bg-orange text-prune" },
              ].map((avatar) => (
                <span
                  key={avatar.initials}
                  className={`border-cream flex size-10 items-center justify-center rounded-full border-2 text-[11px] font-extrabold ${avatar.color}`}
                >
                  {avatar.initials}
                </span>
              ))}
            </div>
            <div>
              <div className="text-orange flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-prune text-[13px] font-bold">
                4,9/5 par plus de 1 200 explorateurs
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto min-h-[440px] w-full max-w-[520px] sm:min-h-[520px] lg:col-span-5 lg:min-h-[540px]">
          <SunSticker className="absolute -top-8 -right-2 z-0 size-20 sm:size-24" rotate={8} />
          <FlowerIcon className="text-coral absolute bottom-3 -left-4 z-0 size-20" />
          <HibiscusSticker className="absolute top-1/2 -right-3 z-0 size-16" rotate={-10} />
          <PalmSticker className="absolute -top-4 -left-2 z-0 size-16 opacity-90" rotate={-10} />

          {POLAROIDS.map((polaroid) => (
            <figure
              key={polaroid.src}
              className={`bg-paper shadow-lift absolute rounded-[1.25rem] p-2.5 pb-8 transition-transform duration-300 hover:rotate-0 ${polaroid.className}`}
            >
              <div className="bg-blush relative aspect-[4/4.6] overflow-hidden rounded-2xl">
                <Image
                  src={polaroid.src}
                  alt={polaroid.alt}
                  fill
                  priority={polaroid.priority}
                  sizes={polaroid.sizes}
                  className="object-cover"
                />
              </div>
              <figcaption className="text-prune pt-3 text-center text-[12px] font-bold tracking-wide lowercase">
                {polaroid.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
