import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Pill } from "@/components/ui/card";

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export function LegalPage({
  title,
  subtitle,
  updated,
  sections,
}: {
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <SiteHeader />
      <main id="contenu" className="bg-cream pt-20">
        <section className="bg-blush relative overflow-hidden px-5 py-14 md:py-20">
          <div className="container-page max-w-4xl">
            <Link
              href="/"
              className="text-prune/65 hover:text-framboise-dark inline-flex items-center gap-2 text-[12px] font-bold transition-colors"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Retour à l&apos;accueil
            </Link>
            <div className="mt-6 flex flex-col gap-3">
              <Pill tone="butter">Informations légales</Pill>
              <h1 className="display-section">{title}</h1>
              <p className="text-prune/75 max-w-2xl text-[16px] leading-relaxed">{subtitle}</p>
              <p className="text-prune/70 text-[11px] font-bold tracking-[0.08em] uppercase">
                Dernière mise à jour : {updated}
              </p>
            </div>
          </div>
        </section>

        <section className="container-page grid max-w-5xl gap-10 py-12 md:py-16 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Sommaire" className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-2">
              <p className="text-prune/70 mb-1 text-[10px] font-extrabold tracking-[0.1em] uppercase">
                Au sommaire
              </p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-prune/65 hover:bg-blush hover:text-prune rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </nav>

          <div className="flex flex-col gap-6">
            <div className="border-butter bg-cream-warm flex items-start gap-3 rounded-[1.25rem] border-2 p-4">
              <AlertTriangle
                className="text-orange-ink mt-0.5 size-5 shrink-0"
                aria-hidden="true"
              />
              <p className="text-prune/80 text-[13px] leading-relaxed">
                <strong>À COMPLÉTER.</strong> Ce texte est un modèle de démonstration. Il doit être
                relu et complété par un juriste avant mise en production (raison sociale, adresse,
                numéro d&apos;immatriculation, hébergeur, etc.).
              </p>
            </div>

            <article className="bg-paper shadow-soft flex flex-col gap-8 rounded-[2rem] p-6 md:p-9">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="font-display text-prune text-2xl leading-none uppercase md:text-3xl">
                    {section.title}
                  </h2>
                  <div className="text-prune/80 mt-3 flex flex-col gap-3 text-[14px] leading-relaxed">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets ? (
                      <ul className="flex flex-col gap-2 pl-1">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2">
                            <span className="bg-orange mt-2 size-1.5 shrink-0 rounded-full" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              ))}

              <div className="bg-cream-soft text-prune/70 rounded-2xl p-4 text-[12px] leading-relaxed">
                Une question sur ce document ?{" "}
                <a
                  href="mailto:bonjour@roamy.travel"
                  className="text-framboise-dark font-bold underline underline-offset-2"
                >
                  bonjour@roamy.travel
                </a>
              </div>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
