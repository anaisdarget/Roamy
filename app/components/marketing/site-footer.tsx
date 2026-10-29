import Link from "next/link";
import { Camera, Mail, Music2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SITE } from "@/lib/config/site";

const COLUMNS = [
  {
    title: "L'expérience",
    links: [
      { href: "/#comment", label: "Comment ça marche" },
      { href: "/#tarifs", label: "Formules & tarifs" },
      { href: "/#faq", label: "Foire aux questions" },
      { href: "/itineraire-demo", label: "Voir un exemple" },
    ],
  },
  {
    title: "Explorer",
    links: [
      { href: "/planifier", label: "Créer mon planning" },
      { href: "/mes-voyages", label: "Mes voyages" },
      { href: "/#destinations", label: "Destinations soleil" },
      { href: "/#apercu", label: "Le roadbook" },
    ],
  },
  {
    title: "Légal & support",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/cgv", label: "CGV" },
      { href: "mailto:bonjour@roamy.travel", label: "Nous écrire" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-framboise bg-prune text-cream relative overflow-hidden border-t-4 pt-20 pb-10">
      <div className="container-page">
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Logo tone="cream" />
            <p className="text-cream max-w-sm text-[15px] leading-relaxed">
              Le copain bienveillant et stylé qui transforme tes envies d&apos;évasion en
              itinéraires sur mesure. Zéro stress, 100 % soleil.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { href: SITE.instagram, label: "Instagram", Icon: Camera },
                { href: SITE.tiktok, label: "TikTok", Icon: Music2 },
                { href: `mailto:${SITE.supportEmail}`, label: "Email", Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="border-framboise/40 bg-prune-dark text-butter hover:bg-orange hover:text-prune flex size-10 items-center justify-center rounded-full border transition-colors"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h3 className="text-butter font-sans text-[13px] font-extrabold tracking-[0.09em] uppercase">
                {column.title}
              </h3>
              <ul className="text-cream/85 flex flex-col gap-3 text-[14px]">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-butter inline-block py-1 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-framboise/30 text-cream/70 flex flex-col gap-2 border-t py-6 text-[12px] md:flex-row md:items-center md:justify-between">
          <p>© Roamy. Fait avec du soleil et un peu de café.</p>
          <p>
            Prix et disponibilités à vérifier avant réservation. Roamy n&apos;est pas une agence de
            voyages.
          </p>
        </div>

        <div className="pointer-events-none overflow-hidden pt-2 pb-10 select-none" aria-hidden="true">
          <p className="font-display text-framboise pb-4 text-center text-[clamp(5rem,21vw,17rem)] leading-[1] tracking-tight whitespace-nowrap">
            roamy
          </p>
        </div>
      </div>
    </footer>
  );
}
