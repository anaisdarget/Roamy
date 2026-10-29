import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { LandingHero } from "@/components/marketing/landing-hero";
import { TickerBand } from "@/components/marketing/ticker-band";
import {
  DestinationsSection,
  FinalCta,
  HOME_FAQS,
  HowItWorks,
  PhoneSection,
  PricingSection,
  RoadbookPreview,
  Testimonials,
} from "@/components/marketing/landing-sections";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { Pill } from "@/components/ui/card";
import { PLANS } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Roamy — ton voyage, planifié pour toi",
  description:
    "Réponds à 6 questions, paie une fois, reçois un itinéraire de voyage sur mesure jour par jour, en PDF et par email. Fini les 42 onglets ouverts.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Roamy",
        url: "https://roamy.travel",
        logo: "https://roamy.travel/icon.svg",
      },
      {
        "@type": "Product",
        name: "Roadbook Roamy",
        description: "Itinéraire de voyage personnalisé généré par IA, livré en PDF et par email.",
        offers: Object.values(PLANS).map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          price: (plan.priceCents / 100).toFixed(2),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: HOME_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main id="contenu" className="pt-20">
        <LandingHero />
        <TickerBand />
        <HowItWorks />
        <DestinationsSection />
        <RoadbookPreview />
        <PhoneSection />

        <Testimonials />
        <PricingSection />
        <section id="faq" className="bg-blush scroll-mt-24 py-20 md:py-24">
          <div className="container-page max-w-4xl">
            <div className="mb-10 flex flex-col items-center gap-4 text-center">
              <Pill>Foire aux questions</Pill>
              <h2 className="display-section">Tout ce que tu dois savoir</h2>
              <p className="text-prune/75 max-w-xl text-[15px]">
                Une autre question ?{" "}
                <a
                  href="mailto:bonjour@roamy.travel"
                  className="hover:text-framboise-dark font-bold underline underline-offset-4"
                >
                  Écris-nous
                </a>
                , on répond vite (et avec le sourire).
              </p>
            </div>
            <FaqAccordion items={HOME_FAQS} />
          </div>
        </section>

        <FinalCta />

        <section className="bg-cream py-10">
          <div className="container-page flex flex-col items-center gap-2 text-center">
            <p className="text-prune/70 text-[13px] font-bold tracking-[0.1em] uppercase">
              Une question sur ton voyage ?
            </p>
            <p className="text-prune/80 text-[15px]">
              On est joignables 7j/7 ·{" "}
              <a
                href="mailto:bonjour@roamy.travel"
                className="hover:text-framboise-dark font-extrabold underline underline-offset-4"
              >
                bonjour@roamy.travel
              </a>
            </p>
            <p className="text-prune/70 max-w-lg text-[12px]">
              Roamy propose des recommandations et ne réalise aucune réservation. Les prix, horaires
              et disponibilités doivent être vérifiés avant réservation.
            </p>
            <Link
              href="/mentions-legales"
              className="text-prune/70 hover:text-framboise-dark text-[12px] underline underline-offset-4"
            >
              Mentions légales
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        // JSON-LD is generated from trusted local data.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
