import type { Metadata } from "next";
import { Suspense } from "react";
import { PlannerExperience } from "@/components/form/planner-experience";
import { SunIcon } from "@/components/brand/icons";
import type { PlanId } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Créer mon planning",
  description:
    "6 questions, 3 minutes. Dis-nous où, quand, avec qui et à quel rythme tu veux partir : Roamy s'occupe du reste.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function PlannerFallback() {
  return (
    <div className="bg-cream-soft flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <SunIcon className="animate-spin-slow text-orange-ink size-12" />
        <p className="text-prune/70 text-sm font-bold">On prépare ton questionnaire…</p>
      </div>
    </div>
  );
}

async function PlannerContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const destinationParam = first(params.destination);
  const planParam = first(params.plan);
  const plan: PlanId | undefined =
    planParam === "essential" || planParam === "premium" ? planParam : undefined;
  const destination = destinationParam?.slice(0, 120);

  return <PlannerExperience initialDestination={destination} initialPlan={plan} />;
}

export default function PlanifierPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<PlannerFallback />}>
      <PlannerContent searchParams={searchParams} />
    </Suspense>
  );
}
