"use client";

import { Minus, Plus, Sparkles } from "lucide-react";
import {
  BUDGET_LEVELS,
  budgetLevelForAmount,
  INTERESTS,
  MAX_BUDGET,
  MIN_BUDGET,
  RHYTHMS,
  type BudgetLevel,
  type InterestSlug,
  type Rhythm,
} from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

export function SegmentedProgress({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="flex w-full gap-1"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={`Étape ${current} sur ${total}`}
    >
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-3.5 flex-1 rounded-full transition-colors duration-300",
            index < current ? "bg-orange" : "bg-butter",
          )}
        />
      ))}
    </div>
  );
}

export function Counter({
  id,
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="bg-cream-soft flex items-center justify-between gap-4 rounded-full px-5 py-3.5">
      <div>
        <p id={`${id}-label`} className="text-prune text-[15px] font-extrabold">
          {label}
        </p>
        <p className="text-prune/70 text-[12px] font-semibold">{sublabel}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label={`Retirer un ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="bg-paper text-prune hover:bg-butter flex size-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span
          id={id}
          aria-labelledby={`${id}-label`}
          aria-live="polite"
          className="text-prune w-6 text-center text-base font-extrabold"
        >
          {value}
        </span>
        <button
          type="button"
          aria-label={`Ajouter un ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="bg-paper text-prune hover:bg-butter flex size-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function BudgetPicker({
  amount,
  level,
  travelers,
  onChange,
}: {
  amount: number;
  level: BudgetLevel;
  travelers: number;
  onChange: (amount: number, level: BudgetLevel) => void;
}) {
  const percent = ((amount - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;
  const total = amount * Math.max(1, travelers);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-cream-soft rounded-[1.75rem] p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-framboise-dark text-[11px] font-extrabold tracking-[0.1em] uppercase">
              Ton budget par personne
            </p>
            <p className="font-display text-prune text-5xl leading-none uppercase md:text-6xl">
              {amount} €
            </p>
          </div>
          <p className="text-prune/70 text-right text-[12px] font-bold">
            Soit environ
            <span className="text-prune block text-[18px] font-extrabold">{total} €</span>
            pour {travelers} voyageur{travelers > 1 ? "s" : ""}
          </p>
        </div>

        <label htmlFor="budget-slider" className="sr-only">
          Budget par personne en euros
        </label>
        <input
          id="budget-slider"
          type="range"
          min={MIN_BUDGET}
          max={MAX_BUDGET}
          step={50}
          value={amount}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(next, budgetLevelForAmount(next));
          }}
          className="range-roamy mt-8"
          style={{
            background: `linear-gradient(to right, var(--color-orange) ${percent}%, var(--color-blush) ${percent}%)`,
          }}
          aria-valuetext={`${amount} euros par personne`}
        />
        <div className="text-prune/70 mt-2 flex justify-between text-[11px] font-bold">
          <span>{MIN_BUDGET} €</span>
          <span>{MAX_BUDGET} €</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {Object.values(BUDGET_LEVELS).map((preset) => {
          const selected = level === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(preset.amount, preset.id)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-[1.5rem] border-2 p-4 text-left transition-all",
                selected
                  ? "border-framboise bg-framboise text-white"
                  : "bg-butter/70 text-prune hover:border-framboise/40 hover:bg-butter border-transparent",
              )}
            >
              <span className="flex w-full items-center justify-between text-[13px] font-extrabold tracking-wide uppercase">
                {preset.label}
                <span aria-hidden="true">{preset.emoji}</span>
              </span>
              <span className={cn("text-[12px]", selected ? "text-white/80" : "text-prune/65")}>
                {preset.description}
              </span>
              <span className="mt-1 text-[13px] font-extrabold">~{preset.amount} € / pers</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InterestsPicker({
  selected,
  onToggle,
}: {
  selected: InterestSlug[];
  onToggle: (interest: InterestSlug) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {INTERESTS.map((interest, index) => {
          const isSelected = selected.includes(interest.slug);
          return (
            <button
              key={interest.slug}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onToggle(interest.slug)}
              className={cn(
                "flex items-center gap-2 rounded-full border-2 px-5 py-3 text-[14px] font-extrabold transition-all md:text-[15px]",
                index % 3 === 0 && "-rotate-1",
                index % 3 === 1 && "rotate-1",
                isSelected
                  ? "border-framboise bg-framboise text-white shadow-[0_3px_0_rgba(74,15,46,0.10)]"
                  : "bg-butter text-prune hover:border-framboise/30 hover:bg-sun border-transparent",
              )}
            >
              <span aria-hidden="true" className="text-lg">
                {interest.emoji}
              </span>
              {interest.label}
              {isSelected ? (
                <span aria-hidden="true" className="ml-0.5 text-[11px]">
                  ★
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="text-prune/70 mt-4 flex items-center gap-2 text-[12px] font-bold">
        <Sparkles className="text-orange-ink size-3.5" aria-hidden="true" />
        {selected.length === 0
          ? "Choisis 1 à 10 envies. Tu peux tout cocher, on ne juge pas."
          : `${selected.length} envie${selected.length > 1 ? "s" : ""} sélectionnée${selected.length > 1 ? "s" : ""}. Bonne nouvelle : on a des idées.`}
      </p>
    </div>
  );
}

export function RhythmPicker({
  selected,
  onChange,
}: {
  selected: Rhythm;
  onChange: (rhythm: Rhythm) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Choisis ton rythme de voyage"
      className="grid gap-3 md:grid-cols-3"
    >
      {RHYTHMS.map((rhythm) => {
        const isSelected = selected === rhythm.id;
        return (
          <button
            key={rhythm.id}
            id={`rhythm-${rhythm.id}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onKeyDown={(event) => {
              if (
                event.key !== "ArrowRight" &&
                event.key !== "ArrowDown" &&
                event.key !== "ArrowLeft" &&
                event.key !== "ArrowUp"
              ) {
                return;
              }
              event.preventDefault();
              const index = RHYTHMS.findIndex((item) => item.id === rhythm.id);
              const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
              const next = RHYTHMS[(index + direction + RHYTHMS.length) % RHYTHMS.length];
              onChange(next.id);
              document.getElementById(`rhythm-${next.id}`)?.focus();
            }}
            onClick={() => onChange(rhythm.id)}
            className={cn(
              "flex flex-col gap-3 rounded-[1.75rem] border-2 p-5 text-left transition-all",
              isSelected
                ? "border-framboise bg-framboise text-white shadow-[0_4px_0_rgba(74,15,46,0.10)]"
                : "bg-cream-soft text-prune hover:border-framboise/30 border-transparent hover:-translate-y-0.5",
            )}
          >
            <span className="flex items-center justify-between">
              <span className="text-2xl" aria-hidden="true">
                {rhythm.emoji}
              </span>
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border-2",
                  isSelected ? "text-framboise-dark border-white bg-white" : "border-prune/30",
                )}
                aria-hidden="true"
              >
                {isSelected ? "✓" : ""}
              </span>
            </span>
            <span className="font-display text-2xl leading-none uppercase">{rhythm.label}</span>
            <span
              className={cn(
                "text-[13px] leading-relaxed",
                isSelected ? "text-white/85" : "text-prune/70",
              )}
            >
              {rhythm.description}
            </span>
            <span
              className={cn(
                "text-[11px] font-extrabold tracking-wide uppercase",
                isSelected ? "text-butter" : "text-framboise-dark",
              )}
            >
              {rhythm.detail}
            </span>
          </button>
        );
      })}
    </div>
  );
}
