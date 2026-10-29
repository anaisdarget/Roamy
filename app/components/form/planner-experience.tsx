"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cloud,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { Pill } from "@/components/ui/card";
import {
  DestinationCombobox,
  TrendingDestinationCards,
} from "@/components/form/destination-combobox";
import { DateRangePicker } from "@/components/form/date-range-picker";
import {
  BudgetPicker,
  Counter,
  InterestsPicker,
  RhythmPicker,
  SegmentedProgress,
} from "@/components/form/planner-controls";
import { STEP_STICKERS } from "@/components/stickers/stickers";
import { FlowerIcon, SunIcon } from "@/components/brand/icons";
import { LogoLink } from "@/components/brand/logo";
import { SURPRISE_DESTINATIONS } from "@/lib/data/destinations";
import { PLANS, TRAVELER_LIMITS, formatPrice, type PlanId } from "@/lib/config/site";
import {
  TRIP_STEPS,
  parseStepParam,
  stepFromNumber,
  tripAnswersSchema,
  type TripAnswers,
} from "@/lib/schemas/trip";
import {
  DEFAULT_TRIP_DRAFT,
  draftToFormValues,
  formValuesToDraft,
  useTripStore,
  type TripDraft,
} from "@/lib/stores/trip-store";
import { cn } from "@/lib/utils/cn";

const STEP_TONES: Record<string, string> = {
  destination: "bg-cream-soft",
  dates: "stripe-bg",
  budget: "bg-cream-warm",
  interests: "bg-mint/45",
  rhythm: "bg-lavender/30",
  identity: "bg-rose-soft",
};

const STEP_COPY: Record<
  string,
  { kicker: string; title: string; subtitle: string; micro: string }
> = {
  destination: {
    kicker: "On commence fort",
    title: "Où est-ce qu'on t'emmène ?",
    subtitle:
      "Dis-nous la ville, le pays ou l'envie vague. On s'occupe de transformer ça en vraie aventure.",
    micro: "Pas d'idée précise ? Le bouton « Surprends-moi » est là pour ça.",
  },
  dates: {
    kicker: "On cale le timing",
    title: "C'est quand, le grand départ ?",
    subtitle:
      "Choisis tes dates et dis-nous qui vient. Plus on sait de choses, moins tu te retrouves à dormir dans la voiture.",
    micro: "Un doute sur les dates ? Coche « flexible », on ajustera de ±3 jours.",
  },
  budget: {
    kicker: "On reste réalistes",
    title: "Tu as quel budget en tête ?",
    subtitle:
      "Un budget par personne, hors vols internationaux. On adapte les adresses, les restos et le rythme en conséquence.",
    micro: "Petit budget ne veut pas dire petit voyage. Promis.",
  },
  interests: {
    kicker: "Le plus important",
    title: "Qu'est-ce qui te fait vibrer ?",
    subtitle:
      "Coche tout ce qui te parle. C'est comme un moodboard, sauf que ça finit en itinéraire.",
    micro: "Tu peux en choisir plusieurs. On ne mettra pas 6 musées par jour, promis.",
  },
  rhythm: {
    kicker: "On trouve ton tempo",
    title: "Tu voyages à quel rythme ?",
    subtitle:
      "Métro-boulot-dodo, mais en vacances ? Ou réveil à 6h pour voir le lever de soleil ? Assume.",
    micro: "Aucune mauvaise réponse. Sauf si tu dis « à fond » et que tu dors 12 h.",
  },
  identity: {
    kicker: "Dernière ligne droite",
    title: "On te l'envoie où ?",
    subtitle:
      "Ton prénom pour qu'on te parle comme à un pote, ton email pour recevoir le roadbook. C'est tout.",
    micro: "Zéro spam. Juste ton itinéraire, le PDF et quelques pépites.",
  },
};

function usePersistHydrated() {
  return useSyncExternalStore(
    (callback) => {
      const unsubscribeFinish = useTripStore.persist.onFinishHydration(callback);
      const unsubscribeHydrate = useTripStore.persist.onHydrate(callback);
      return () => {
        unsubscribeFinish();
        unsubscribeHydrate();
      };
    },
    () => useTripStore.persist.hasHydrated(),
    () => false,
  );
}

export function PlannerExperience({
  initialDestination,
  initialPlan,
}: {
  initialDestination?: string;
  initialPlan?: PlanId;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawStep = searchParams.get("step");
  const stepNumber = parseStepParam(rawStep);
  const stepId = stepFromNumber(stepNumber);
  const step = TRIP_STEPS[stepNumber - 1];
  const hydrated = usePersistHydrated();
  const hasAppliedQuery = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const setMany = useTripStore((state) => state.setMany);
  const toggleInterest = useTripStore((state) => state.toggleInterest);

  const form = useForm<TripAnswers>({
    resolver: zodResolver(tripAnswersSchema),
    mode: "onTouched",
    defaultValues: draftToFormValues(DEFAULT_TRIP_DRAFT),
    shouldFocusError: true,
  });

  const {
    register,
    watch,
    setValue,
    getValues,
    trigger,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  // Hydrate the form from sessionStorage once, then apply explicit URL intent.
  useEffect(() => {
    if (!hydrated) return;
    if (!hasAppliedQuery.current) {
      hasAppliedQuery.current = true;
      const current = useTripStore.getState();
      const next: Partial<TripDraft> = {};
      if (initialDestination) next.destination = initialDestination;
      if (initialPlan) next.plan = initialPlan;
      if (Object.keys(next).length > 0) setMany(next);
      reset(
        draftToFormValues({
          destination: next.destination ?? current.destination,
          startDate: current.startDate,
          endDate: current.endDate,
          flexibleDates: current.flexibleDates,
          adults: current.adults,
          children: current.children,
          babies: current.babies,
          budgetLevel: current.budgetLevel,
          budgetAmount: current.budgetAmount,
          interests: current.interests,
          rhythm: current.rhythm,
          dietary: current.dietary,
          accommodation: current.accommodation,
          transport: current.transport,
          notes: current.notes,
          firstName: current.firstName,
          email: current.email,
          consent: current.consent,
          plan: next.plan ?? current.plan,
        }),
      );
    }
  }, [hydrated, initialDestination, initialPlan, reset, setMany]);

  // Make the URL explicit (?step=1) so back/forward and shares behave.
  useEffect(() => {
    if (hydrated && rawStep === null) {
      router.replace(`${pathname}?step=${stepNumber}`, { scroll: false });
    }
  }, [hydrated, pathname, rawStep, router, stepNumber]);

  // Keep the persisted draft in sync on every change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form's watch is safe here.
    const subscription = watch((values) => {
      setMany(formValuesToDraft(values as Partial<TripDraft>));
    });
    return () => subscription.unsubscribe();
  }, [watch, setMany]);

  const destination = watch("destination");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const adults = watch("adults");
  const children = watch("children");
  const babies = watch("babies");
  const budgetAmount = watch("budgetAmount");
  const budgetLevel = watch("budgetLevel");
  const interests = watch("interests") ?? [];
  const rhythm = watch("rhythm");
  const plan = watch("plan") ?? "premium";
  const travelers = Math.max(1, (adults ?? 0) + (children ?? 0) + (babies ?? 0));
  const totalBudget = (budgetAmount ?? 0) * travelers;

  async function goNext() {
    setServerError(null);

    if (stepId === "destination" && !getValues("destination").trim()) {
      const random =
        SURPRISE_DESTINATIONS[Math.floor(Math.random() * SURPRISE_DESTINATIONS.length)];
      setValue("destination", random, { shouldValidate: true, shouldDirty: true });
    }

    const fields = step.fields as unknown as FieldPath<TripAnswers>[];
    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) return;

    if (stepNumber < TRIP_STEPS.length) {
      router.push(`${pathname}?step=${stepNumber + 1}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function onInvalid(formErrors: Record<string, { message?: string }>) {
    const firstField = Object.keys(formErrors)[0];
    const targetStep = TRIP_STEPS.findIndex((candidate) =>
      (candidate.fields as readonly string[]).includes(firstField),
    );
    if (targetStep > 0) {
      router.push(`${pathname}?step=${targetStep + 1}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setServerError("Il manque un petit quelque chose. On t'a ramené à la bonne étape.");
  }

  async function onFinalSubmit(values: TripAnswers) {
    setSubmitting(true);
    setServerError(null);
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !data.id) {
        setServerError(data.error ?? "On n'a pas réussi à sauvegarder ton voyage. Réessaie.");
        setSubmitting(false);
        return;
      }
      setMany(formValuesToDraft(values));
      router.push(`/paiement/${data.id}`);
    } catch {
      setServerError("Petit souci de connexion. Vérifie ton réseau et réessaie.");
      setSubmitting(false);
    }
  }

  function goBack() {
    if (stepNumber <= 1) return;
    router.push(`${pathname}?step=${stepNumber - 1}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (stepNumber === TRIP_STEPS.length) {
      void handleSubmit(onFinalSubmit, onInvalid)(event);
    } else {
      void goNext();
    }
  };

  if (!hydrated) {
    return (
      <div className="bg-cream-soft flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <SunIcon className="animate-spin-slow text-orange-ink size-12" />
          <p className="text-prune/70 text-sm font-bold">On récupère tes réponses…</p>
        </div>
      </div>
    );
  }

  const StepSticker = STEP_STICKERS[stepId];

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden pt-6 pb-16 md:pt-10",
        STEP_TONES[stepId],
      )}
    >
      <FlowerIcon className="text-framboise-dark/90 pointer-events-none absolute -top-52 -left-52 size-64 rotate-12 md:-top-56 md:-left-56 md:size-80" />
      <FlowerIcon className="text-hotpink pointer-events-none absolute top-56 -right-20 size-52 -rotate-12 md:-right-12" />
      <SunIcon className="text-orange pointer-events-none absolute -bottom-10 left-4 size-32 md:size-40" />

      <div className="container-page relative z-10">
        <div className="relative z-20 mb-4 flex items-center justify-between">
          <LogoLink />
          <a
            href="mailto:bonjour@roamy.travel"
            className="bg-paper/70 text-prune hover:bg-paper rounded-full px-4 py-2 text-[12px] font-bold backdrop-blur transition-colors"
          >
            Besoin d&apos;aide ?
          </a>
        </div>

        <div className="bg-paper shadow-soft mx-auto w-full max-w-[880px] rounded-[2.5rem] p-5 sm:p-8 md:p-10 lg:p-12">
          <header className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-prune flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] uppercase">
                <span className="bg-orange size-2.5 rounded-full" aria-hidden="true" />
                Étape {stepNumber} sur {TRIP_STEPS.length} • {step.label}
              </span>
              <Pill tone="butter" className="px-3 py-1 text-[10px] tracking-[0.06em]">
                {Math.round((stepNumber / TRIP_STEPS.length) * 100)} % complété
              </Pill>
            </div>
            <SegmentedProgress current={stepNumber} total={TRIP_STEPS.length} />
          </header>

          <div key={stepId} className="animate-fade-up">
            <div className="relative mt-7 flex flex-col gap-2 pr-20 md:mt-9">
              <span className="text-framboise-dark flex items-center gap-2 text-[12px] font-extrabold tracking-[0.09em] uppercase">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {STEP_COPY[stepId].kicker}
              </span>
              <h1 className="display-question text-prune">{STEP_COPY[stepId].title}</h1>
              <p className="text-prune/75 max-w-xl text-[15px] leading-relaxed md:text-[17px]">
                {STEP_COPY[stepId].subtitle}
              </p>
              <StepSticker className="absolute -top-8 -right-1 size-16 md:-top-12 md:-right-2 md:size-24" />
            </div>

            <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-8">
              {stepId === "destination" ? (
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <Label htmlFor="destination">Ta destination rêvée</Label>
                      <span className="text-framboise-dark text-[11px] font-semibold">
                        Tu peux aussi nous laisser carte blanche
                      </span>
                    </div>
                    <DestinationCombobox
                      value={destination}
                      onChange={(value) =>
                        setValue("destination", value, { shouldDirty: true, shouldValidate: true })
                      }
                      error={errors.destination?.message}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="text-prune text-[11px] font-extrabold tracking-[0.1em] uppercase">
                      Ou clique sur un coup de cœur de saison
                    </span>
                    <TrendingDestinationCards
                      onSelect={(value) => {
                        setValue("destination", value, { shouldDirty: true, shouldValidate: true });
                      }}
                    />
                  </div>
                </div>
              ) : null}

              {stepId === "dates" ? (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <span className="text-prune flex items-center gap-2 text-[15px] font-extrabold">
                      <span aria-hidden="true">📅</span> Tes dates de voyage
                    </span>
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      error={errors.startDate?.message ?? errors.endDate?.message}
                      onChange={({ startDate: from, endDate: to }) => {
                        setValue("startDate", from, { shouldDirty: true, shouldValidate: true });
                        setValue("endDate", to, { shouldDirty: true, shouldValidate: true });
                      }}
                    />
                    <label className="mt-1 flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-orange size-4"
                        {...register("flexibleDates")}
                      />
                      <span className="text-prune text-[12px] font-bold">
                        Je suis flexible sur mes dates (± 3 jours)
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="text-prune flex items-center gap-2 text-[15px] font-extrabold">
                      <span aria-hidden="true">👥</span> Les voyageurs
                    </span>
                    <Counter
                      id="adults"
                      label="Adultes"
                      sublabel="18 ans et plus"
                      value={adults}
                      min={TRAVELER_LIMITS.adults.min}
                      max={TRAVELER_LIMITS.adults.max}
                      onChange={(value) =>
                        setValue("adults", value, { shouldDirty: true, shouldValidate: true })
                      }
                    />
                    <Counter
                      id="children"
                      label="Enfants"
                      sublabel="0 à 17 ans (tarifs adaptés)"
                      value={children}
                      min={TRAVELER_LIMITS.children.min}
                      max={TRAVELER_LIMITS.children.max}
                      onChange={(value) =>
                        setValue("children", value, { shouldDirty: true, shouldValidate: true })
                      }
                    />
                    <Counter
                      id="babies"
                      label="Bébés"
                      sublabel="Moins de 2 ans"
                      value={babies}
                      min={TRAVELER_LIMITS.babies.min}
                      max={TRAVELER_LIMITS.babies.max}
                      onChange={(value) =>
                        setValue("babies", value, { shouldDirty: true, shouldValidate: true })
                      }
                    />
                    {errors.adults?.message ? (
                      <p role="alert" className="text-framboise-dark text-sm font-bold">
                        {errors.adults.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="bg-butter/60 text-prune/80 rounded-[1.5rem] p-4 text-[13px] leading-relaxed md:col-span-2">
                    <span className="text-prune font-extrabold">Le petit conseil :</span> partir du
                    samedi au samedi coûte souvent moins cher, et l&apos;IA garde une journée tampon
                    pour la flemme. Tu peux aussi choisir des dates flexibles : on ajustera de ±3
                    jours.
                  </div>
                </div>
              ) : null}

              {stepId === "budget" ? (
                <BudgetPicker
                  amount={budgetAmount}
                  level={budgetLevel}
                  travelers={travelers}
                  onChange={(amount, level) => {
                    setValue("budgetAmount", amount, { shouldDirty: true, shouldValidate: true });
                    setValue("budgetLevel", level, { shouldDirty: true, shouldValidate: true });
                  }}
                />
              ) : null}

              {stepId === "interests" ? (
                <div className="flex flex-col gap-4">
                  <InterestsPicker
                    selected={interests}
                    onToggle={(interest) => {
                      toggleInterest(interest);
                      const current = getValues("interests") ?? [];
                      const next = current.includes(interest)
                        ? current.filter((item) => item !== interest)
                        : [...current, interest];
                      setValue("interests", next, { shouldDirty: true, shouldValidate: true });
                    }}
                  />
                  {errors.interests?.message ? (
                    <p role="alert" className="text-framboise-dark text-sm font-bold">
                      {errors.interests.message}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {stepId === "rhythm" ? (
                <RhythmPicker
                  selected={rhythm}
                  onChange={(value) =>
                    setValue("rhythm", value, { shouldDirty: true, shouldValidate: true })
                  }
                />
              ) : null}

              {stepId === "identity" ? (
                <div className="flex flex-col gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName" className="mb-1.5 block pl-1">
                        Ton prénom
                      </Label>
                      <div className="relative">
                        <UserRound
                          className="text-orange-ink pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
                          aria-hidden="true"
                        />
                        <Input
                          id="firstName"
                          autoComplete="given-name"
                          placeholder="Comment on t'appelle ?"
                          className="pl-11"
                          hasError={Boolean(errors.firstName)}
                          aria-describedby={errors.firstName ? "firstName-error" : undefined}
                          {...register("firstName")}
                        />
                      </div>
                      {errors.firstName?.message ? (
                        <p
                          id="firstName-error"
                          role="alert"
                          className="text-framboise-dark mt-2 pl-1 text-sm font-bold"
                        >
                          {errors.firstName.message}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <Label htmlFor="email" className="mb-1.5 block pl-1">
                        Ton email
                      </Label>
                      <div className="relative">
                        <Mail
                          className="text-orange-ink pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
                          aria-hidden="true"
                        />
                        <Input
                          id="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="toi@exemple.com"
                          className="pl-11"
                          hasError={Boolean(errors.email)}
                          aria-describedby={errors.email ? "email-error" : undefined}
                          {...register("email")}
                        />
                      </div>
                      {errors.email?.message ? (
                        <p
                          id="email-error"
                          role="alert"
                          className="text-framboise-dark mt-2 pl-1 text-sm font-bold"
                        >
                          {errors.email.message}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="bg-cream-soft rounded-[1.5rem] p-4">
                    <p className="text-prune mb-2 text-[12px] font-extrabold tracking-[0.08em] uppercase">
                      Ta formule
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Object.values(PLANS).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={plan === item.id}
                          onClick={() => setValue("plan", item.id, { shouldDirty: true })}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-full border-2 px-4 py-3 text-left transition-colors",
                            plan === item.id
                              ? "border-framboise bg-framboise text-white"
                              : "bg-paper text-prune hover:border-framboise/30 border-transparent",
                          )}
                        >
                          <span className="text-[13px] font-extrabold">{item.name}</span>
                          <span className="text-[13px] font-extrabold">
                            {formatPrice(item.priceCents)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <details className="group bg-cream-soft rounded-[1.5rem] p-4">
                    <summary className="text-prune cursor-pointer list-none text-[13px] font-extrabold marker:hidden">
                      <span className="flex items-center justify-between">
                        Ajouter des précisions (facultatif)
                        <span className="text-framboise-dark text-[11px] font-bold group-open:hidden">
                          Ouvrir
                        </span>
                      </span>
                    </summary>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <Label htmlFor="notes" className="mb-1.5 block pl-1 text-[13px]">
                          Tes envies, contraintes, bonnes adresses…
                        </Label>
                        <Textarea
                          id="notes"
                          rows={3}
                          placeholder="Ex : je veux voir un match, éviter les files d'attente, dormir dans un van…"
                          {...register("notes")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dietary" className="mb-1.5 block pl-1 text-[13px]">
                          Alimentation / allergies
                        </Label>
                        <Input
                          id="dietary"
                          placeholder="Végé, sans gluten…"
                          {...register("dietary")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="accommodation" className="mb-1.5 block pl-1 text-[13px]">
                          Hébergement
                        </Label>
                        <Input
                          id="accommodation"
                          placeholder="Auberge, appart, chez l'habitant…"
                          {...register("accommodation")}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="transport" className="mb-1.5 block pl-1 text-[13px]">
                          Transport sur place
                        </Label>
                        <Input
                          id="transport"
                          placeholder="À pied, vélo, voiture de loc, transports en commun…"
                          {...register("transport")}
                        />
                      </div>
                    </div>
                  </details>

                  <div>
                    <label className="bg-blush/45 flex cursor-pointer items-start gap-3 rounded-[1.25rem] p-4">
                      <input
                        type="checkbox"
                        className="accent-orange mt-0.5 size-5 shrink-0"
                        aria-invalid={Boolean(errors.consent) || undefined}
                        aria-describedby={errors.consent ? "consent-error" : undefined}
                        {...register("consent")}
                      />
                      <span className="text-prune/85 text-[13px] leading-relaxed">
                        J&apos;accepte que Roamy utilise mes réponses pour générer mon itinéraire et
                        me l&apos;envoyer par email.{" "}
                        <a
                          href="/confidentialite"
                          className="hover:text-framboise-dark font-bold underline underline-offset-2"
                        >
                          Politique de confidentialité
                        </a>
                        .
                      </span>
                    </label>
                    {errors.consent?.message ? (
                      <p
                        id="consent-error"
                        role="alert"
                        className="text-framboise-dark mt-2 pl-1 text-sm font-bold"
                      >
                        {errors.consent.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website">Site web</label>
                    <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
                  </div>
                </div>
              ) : null}

              {serverError ? (
                <p
                  role="alert"
                  className="bg-framboise/10 text-framboise-dark rounded-2xl p-4 text-sm font-bold"
                >
                  {serverError}
                </p>
              ) : null}

              <div className="border-prune/10 sticky bottom-0 z-20 -mx-5 mt-2 border-t bg-white/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
                <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {stepNumber > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      className="w-full sm:w-auto"
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Retour
                    </Button>
                  ) : (
                    <Link
                      href="/"
                      className="text-prune/70 hover:bg-cream-soft hover:text-prune inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-extrabold transition-colors"
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Accueil
                    </Link>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto"
                    size="lg"
                  >
                    {stepNumber === TRIP_STEPS.length ? (
                      submitting ? (
                        <>On prépare ton voyage…</>
                      ) : (
                        <>
                          <Lock className="size-4" aria-hidden="true" />
                          Créer mon planning
                        </>
                      )
                    ) : (
                      <>
                        Suivant : {TRIP_STEPS[stepNumber].label.toLowerCase()}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <div className="border-prune/10 text-prune/70 mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5">
                <Cloud className="size-3.5" aria-hidden="true" />
                Réponses sauvegardées automatiquement
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Paiement sécurisé · Sans abonnement
              </span>
            </div>
          </div>
        </div>

        <div className="text-prune/70 mx-auto mt-6 flex max-w-[880px] flex-col items-center gap-2 text-center text-[12px] font-semibold">
          <p>{STEP_COPY[stepId].micro}</p>
          {stepId === "budget" ? (
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="text-orange-ink size-3.5" aria-hidden="true" />
              Estimation totale pour {travelers} voyageur{travelers > 1 ? "s" : ""} : {totalBudget}{" "}
              €
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
