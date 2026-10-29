"use client";

import { useState } from "react";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { SunSticker, PalmSticker } from "@/components/stickers/stickers";

export function DashboardLogin({ linkError }: { linkError?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);
    setDevLink(null);
    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
        devLink?: string;
      };
      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "On n'a pas réussi à envoyer le lien.");
        return;
      }
      setStatus("sent");
      setMessage(data.message ?? "Regarde ta boîte mail !");
      if (data.devLink) setDevLink(data.devLink);
    } catch {
      setStatus("error");
      setMessage("Petit souci de connexion. Réessaie.");
    }
  }

  return (
    <div className="bg-paper shadow-soft grid overflow-hidden rounded-[2.5rem] lg:grid-cols-2">
      <div className="bg-framboise relative hidden overflow-hidden p-8 text-white lg:flex lg:flex-col lg:justify-between">
        <SunSticker className="absolute -top-10 -right-10 size-44 opacity-30" rotate={10} />
        <PalmSticker className="absolute -right-8 -bottom-12 size-40 opacity-60" rotate={10} />
        <div className="relative z-10">
          <p className="text-butter text-[11px] font-extrabold tracking-[0.12em] uppercase">
            Tes voyages
          </p>
          <h2 className="font-display mt-3 text-4xl leading-[0.95] text-white uppercase">
            Tous tes roadbooks,
            <br />
            <span className="text-sun">au même endroit</span>
          </h2>
        </div>
        <div className="relative z-10 flex flex-col gap-3">
          <p className="text-cream max-w-xs text-[15px] leading-relaxed">
            Pas de mot de passe à retenir. Tu entres ton email, on t&apos;envoie un lien magique, et
            tes itinéraires t&apos;attendent.
          </p>
          <ul className="text-cream flex flex-col gap-2 text-[12px] font-bold">
            <li>✓ Tous tes roadbooks au même endroit</li>
            <li>✓ PDF à télécharger à tout moment</li>
            <li>✓ Zéro mot de passe, zéro spam</li>
          </ul>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        <div className="bg-butter mb-6 flex size-12 items-center justify-center rounded-full">
          <Mail className="text-orange-ink size-5" aria-hidden="true" />
        </div>
        <h1 className="font-display text-prune text-3xl leading-none uppercase">
          Retrouve tes roadbooks
        </h1>
        <p className="text-prune/70 mt-2 text-[14px] leading-relaxed">
          Entre l&apos;email utilisé pour ta commande. On t&apos;envoie un lien sécurisé, valable 20
          minutes.
        </p>

        {linkError ? (
          <p
            role="status"
            className="bg-butter/70 text-prune mt-4 rounded-2xl p-3 text-[13px] font-semibold"
          >
            {linkError === "lien-expire"
              ? "Ce lien a expiré. Demande-en un nouveau, c'est gratuit."
              : "Ce lien n'est plus valide. Demande-en un nouveau, c'est gratuit."}
          </p>
        ) : null}

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <div>
            <Label htmlFor="login-email" className="mb-1.5 block pl-1">
              Ton email
            </Label>
            <Input
              id="login-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="toi@exemple.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button type="submit" disabled={status === "loading"} className="w-full">
            {status === "loading" ? "On envoie le lien…" : "Recevoir mon lien magique"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </form>

        {message ? (
          <div className="bg-cream-soft text-prune/75 mt-4 rounded-2xl p-4 text-[13px] leading-relaxed">
            <p className="flex items-start gap-2 font-semibold">
              <Sparkles className="text-orange-ink mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {message}
            </p>
            {devLink ? (
              <a
                href={devLink}
                className="text-framboise-dark mt-3 inline-flex items-center gap-1 text-[12px] font-extrabold underline underline-offset-4"
              >
                Ouvrir mon lien de démo
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        ) : null}

        <p className="text-prune/70 mt-6 text-[11px] leading-relaxed">
          Aucune inscription, aucun spam. Si tu n&apos;as jamais commandé, tu ne recevras rien.{" "}
          <a href="mailto:bonjour@roamy.travel" className="underline underline-offset-2">
            Besoin d&apos;aide ?
          </a>
        </p>
      </div>
    </div>
  );
}
