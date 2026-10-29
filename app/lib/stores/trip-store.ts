"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DEFAULT_BUDGET,
  type BudgetLevel,
  type InterestSlug,
  type PlanId,
  type Rhythm,
} from "@/lib/config/site";

export interface TripDraft {
  destination: string;
  startDate: string;
  endDate: string;
  flexibleDates: boolean;
  adults: number;
  children: number;
  babies: number;
  budgetLevel: BudgetLevel;
  budgetAmount: number;
  interests: InterestSlug[];
  rhythm: Rhythm;
  dietary: string;
  accommodation: string;
  transport: string;
  notes: string;
  firstName: string;
  email: string;
  consent: boolean;
  plan: PlanId;
}

export const DEFAULT_TRIP_DRAFT: TripDraft = {
  destination: "",
  startDate: "",
  endDate: "",
  flexibleDates: false,
  adults: 2,
  children: 0,
  babies: 0,
  budgetLevel: "confort",
  budgetAmount: DEFAULT_BUDGET,
  interests: [],
  rhythm: "equilibre",
  dietary: "",
  accommodation: "",
  transport: "",
  notes: "",
  firstName: "",
  email: "",
  consent: false,
  plan: "premium",
};

interface TripStore extends TripDraft {
  setField: <K extends keyof TripDraft>(key: K, value: TripDraft[K]) => void;
  setMany: (values: Partial<TripDraft>) => void;
  toggleInterest: (interest: InterestSlug) => void;
  reset: () => void;
}

export const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
      ...DEFAULT_TRIP_DRAFT,
      setField: (key, value) => set({ [key]: value } as Partial<TripDraft>),
      setMany: (values) => set(values),
      toggleInterest: (interest) =>
        set((state) => ({
          interests: state.interests.includes(interest)
            ? state.interests.filter((item) => item !== interest)
            : [...state.interests, interest],
        })),
      reset: () => set(DEFAULT_TRIP_DRAFT),
    }),
    {
      name: "roamy-trip-draft",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => {
        const draft: Record<string, unknown> = { ...state };
        delete draft.setField;
        delete draft.setMany;
        delete draft.toggleInterest;
        delete draft.reset;
        return draft as unknown as TripDraft;
      },
    },
  ),
);

export function draftToFormValues(draft: TripDraft) {
  return {
    ...draft,
    locale: "fr" as const,
    website: "",
  };
}

/** Convert validated form values into the persisted draft shape. */
export function formValuesToDraft(
  values: Partial<TripDraft> & { website?: string },
): Partial<TripDraft> {
  const draft: Record<string, unknown> = { ...values };
  delete draft.website;
  return draft as Partial<TripDraft>;
}
