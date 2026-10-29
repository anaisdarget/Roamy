"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";
import { FishSticker, SunSticker, WaveSticker } from "@/components/stickers/stickers";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <SiteHeader />
      <main
        id="contenu"
        className="bg-cream-soft relative flex min-h-[75vh] items-center overflow-hidden pt-28"
      >
        <SunSticker className="absolute bottom-0 -left-16 size-64 opacity-40" rotate={-8} />
        <WaveSticker className="absolute top-20 -right-8 size-48 opacity-50" rotate={6} />
        <FishSticker className="animate-float absolute top-[30%] right-[18%] size-14" rotate={8} />
        <div className="container-page relative z-10 flex flex-col items-center py-16 text-center">
          <span className="bg-butter text-prune rounded-full px-4 py-2 text-[11px] font-extrabold tracking-[0.1em] uppercase">
            Petit coup de vent
          </span>
          <h1 className="display-section mt-5">On a pris une vague</h1>
          <p className="text-prune/70 mt-3 max-w-md text-[16px] leading-relaxed">
            Une erreur inattendue a interrompu la page. Tes réponses sont sauvegardées, rien
            n&apos;est perdu. Tu peux réessayer ou revenir à l&apos;accueil.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Réessayer
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                Retour à l&apos;accueil
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          {error.digest ? (
            <p className="text-prune/35 mt-6 text-[10px] font-bold tracking-[0.08em] uppercase">
              Référence : {error.digest}
            </p>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
