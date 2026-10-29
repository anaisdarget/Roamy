export const SITE = {
  name: "Roamy",
  tagline: "Ton copilote vacances 100 % sur-mesure",
  description:
    "Réponds à 6 questions. Reçois un itinéraire de voyage sur mesure, jour par jour, dans ta boîte mail.",
  supportEmail: "bonjour@roamy.travel",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
} as const;

export const CURRENCY = "EUR" as const;
export const MAX_TRIP_DAYS = 30;
export const MIN_BUDGET = 150;
export const MAX_BUDGET = 3000;
export const DEFAULT_BUDGET = 700;

export type PlanId = "essential" | "premium";

export interface Plan {
  id: PlanId;
  name: string;
  priceCents: number;
  badge: string;
  tagline: string;
  description: string;
  features: string[];
  maxDays: number;
  highlight: boolean;
}

function priceFromEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const PLANS: Record<PlanId, Plan> = {
  essential: {
    id: "essential",
    name: "Essentiel",
    priceCents: priceFromEnv("NEXT_PUBLIC_PLAN_ESSENTIAL_CENTS", 900),
    badge: "Week-end & court séjour",
    tagline: "L'essentiel, sans prise de tête",
    description: "Parfait pour une escapade de 2 à 4 jours, sans te prendre la tête.",
    features: [
      "Itinéraire détaillé de 1 à 4 jours",
      "Sélection de 8 restaurants & bars locaux",
      "Fichier PDF à télécharger",
      "Carte Google Maps interactive",
    ],
    maxDays: 4,
    highlight: false,
  },
  premium: {
    id: "premium",
    name: "Premium",
    priceCents: priceFromEnv("NEXT_PUBLIC_PLAN_PREMIUM_CENTS", 1900),
    badge: "Jusqu'à 15 jours",
    tagline: "L'expérience complète",
    description: "L'expérience complète pour tes vacances annuelles et tes road-trips.",
    features: [
      "Itinéraire personnalisé jusqu'à 15 jours",
      "Spots secrets & alternatives anti-pluie",
      "Planning heure par heure modifiable",
      "Carnet PDF + version email",
      "Assistance par email 7j/7",
    ],
    maxDays: 15,
    highlight: true,
  },
};

export const PLAN_LIST: Plan[] = [PLANS.essential, PLANS.premium];

export function getPlan(id: string | undefined | null): Plan {
  return id === "essential" ? PLANS.essential : PLANS.premium;
}

export function formatPrice(cents: number, options?: { withCents?: boolean }): string {
  const value = cents / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: options?.withCents ? 2 : Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export const BUDGET_LEVELS = {
  petit: {
    id: "petit",
    label: "Petit budget",
    amount: 350,
    emoji: "🪙",
    description: "Auberges, street food et bonnes affaires",
  },
  confort: {
    id: "confort",
    label: "Confort",
    amount: 700,
    emoji: "🌤️",
    description: "Le bon équilibre confort / plaisir",
  },
  plaisir: {
    id: "plaisir",
    label: "Je me fais plaisir",
    amount: 1400,
    emoji: "✨",
    description: "Belles adresses et expériences mémorables",
  },
} as const;

export type BudgetLevel = keyof typeof BUDGET_LEVELS;

export function budgetLevelForAmount(amount: number): BudgetLevel {
  if (amount < 500) return "petit";
  if (amount < 1000) return "confort";
  return "plaisir";
}

export const INTERESTS = [
  { slug: "plage", label: "Plage", emoji: "🏖️", color: "butter" },
  { slug: "surf", label: "Surf", emoji: "🏄", color: "mint" },
  { slug: "food", label: "Food", emoji: "🍜", color: "coral" },
  { slug: "culture", label: "Culture", emoji: "🏛️", color: "lavender" },
  { slug: "rando", label: "Rando", emoji: "🥾", color: "leaf" },
  { slug: "fiesta", label: "Fiesta", emoji: "🪩", color: "hotpink" },
  { slug: "shopping", label: "Shopping", emoji: "🛍️", color: "rose-soft" },
  { slug: "spa", label: "Spa", emoji: "🧖", color: "sky-soft" },
  { slug: "nature", label: "Nature", emoji: "🌿", color: "mint" },
  { slug: "spots-secrets", label: "Spots secrets", emoji: "🗺️", color: "butter" },
] as const;

export type InterestSlug = (typeof INTERESTS)[number]["slug"];
export const INTEREST_SLUGS = INTERESTS.map((interest) => interest.slug) as [
  InterestSlug,
  ...InterestSlug[],
];

export const RHYTHMS = [
  {
    id: "chill",
    label: "Chill",
    emoji: "🍹",
    description: "2 à 3 activités par jour, beaucoup de sieste et de terrasses.",
    detail: "On garde du temps libre. Beaucoup.",
  },
  {
    id: "equilibre",
    label: "Équilibré",
    emoji: "🌞",
    description: "Le bon tempo : des visites, mais aussi de vrais moments off.",
    detail: "Le sweet spot des vacances réussies.",
  },
  {
    id: "a-fond",
    label: "À fond",
    emoji: "⚡",
    description: "On optimise chaque heure. Tu dormiras en rentrant.",
    detail: "Pour les voyageurs qui ne tiennent pas en place.",
  },
] as const;

export type Rhythm = (typeof RHYTHMS)[number]["id"];
export const RHYTHM_IDS = RHYTHMS.map((rhythm) => rhythm.id) as [Rhythm, ...Rhythm[]];

export const TRAVELER_LIMITS = {
  adults: { min: 1, max: 12 },
  children: { min: 0, max: 10 },
  babies: { min: 0, max: 6 },
} as const;
