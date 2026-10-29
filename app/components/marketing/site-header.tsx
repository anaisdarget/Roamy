"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoLink } from "@/components/brand/logo";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/#comment", label: "Comment ça marche" },
  { href: "/itineraire-demo", label: "Exemple d'itinéraire" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="border-blush/70 bg-cream/95 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <LogoLink />

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-prune hover:text-framboise-dark text-[14px] font-bold transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div
            className="bg-blush hidden items-center rounded-full px-2.5 py-1.5 sm:flex"
            aria-label="Langue"
          >
            <span className="text-prune rounded-full px-1.5 text-[13px] font-extrabold">FR</span>
            <span className="text-framboise-dark/40 px-1 text-[13px]">|</span>
            <button
              type="button"
              disabled
              title="La version anglaise arrive bientôt"
              className="text-prune/40 cursor-not-allowed px-1.5 text-[13px] font-bold"
            >
              EN
            </button>
          </div>

          <Button asChild size="md" className="hidden sm:inline-flex">
            <Link href="/planifier">Planifier mon voyage</Link>
          </Button>

          <Link
            href="/mes-voyages"
            aria-label="Mes voyages"
            className="bg-framboise hover:bg-orange hidden size-9 items-center justify-center rounded-full text-white transition-colors sm:flex"
          >
            <UserRound className="size-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="border-prune text-prune flex size-11 items-center justify-center rounded-full border-2 lg:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className={cn(
          "border-blush bg-cream border-t px-5 pt-4 pb-6 lg:hidden",
          open && "animate-fade-up",
        )}
      >
        <nav aria-label="Navigation mobile" className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-prune hover:bg-blush rounded-2xl px-4 py-3 text-lg font-extrabold"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/mes-voyages"
            onClick={() => setOpen(false)}
            className="text-prune hover:bg-blush rounded-2xl px-4 py-3 text-lg font-extrabold"
          >
            Mes voyages
          </Link>
          <Button asChild className="mt-3 w-full">
            <Link href="/planifier">Créer mon planning</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
