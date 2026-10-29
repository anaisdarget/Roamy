import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";
import { FishSticker, PalmSticker, SunSticker } from "@/components/stickers/stickers";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="contenu"
        className="bg-cream relative flex min-h-[75vh] items-center overflow-hidden pt-28"
      >
        <SunSticker className="absolute top-10 -right-20 size-72 opacity-40" rotate={8} />
        <PalmSticker className="absolute -bottom-10 -left-8 size-48 opacity-80" rotate={-8} />
        <FishSticker className="animate-float absolute top-[22%] left-[16%] size-16" rotate={-6} />
        <div className="container-page relative z-10 flex flex-col items-center py-16 text-center">
          <p className="font-display text-framboise-dark text-[clamp(7rem,22vw,15rem)] leading-[0.75]">
            404
          </p>
          <h1 className="display-section mt-4">Cette page a pris le large</h1>
          <p className="text-prune/70 mt-3 max-w-md text-[16px] leading-relaxed">
            Soit elle n&apos;existe plus, soit elle est partie chercher un spot secret sans
            prévenir. On peut te ramener sur la terre ferme.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/">
                Retour à l&apos;accueil
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/planifier">Créer mon planning</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
