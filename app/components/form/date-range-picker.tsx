"use client";

import { useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { addDaysISO, formatDateFr, isoToDate, dateToISO, todayParis } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

const QUICK_RANGES = [
  { label: "Week-end prochain", days: 2, weekend: true },
  { label: "Une semaine", days: 7, offset: 30 },
  { label: "10 jours", days: 10, offset: 45 },
];

function nextWeekendISO(): string {
  const today = todayParis();
  const day = isoToDate(today).getUTCDay();
  const daysUntilSaturday = day === 6 ? 7 : (6 - day + 7) % 7;
  return addDaysISO(today, daysUntilSaturday || 7);
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  error,
}: {
  startDate: string;
  endDate: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);

  const selected: DateRange | undefined = useMemo(() => {
    if (!startDate) return undefined;
    return {
      from: isoToDate(startDate),
      to: endDate ? isoToDate(endDate) : undefined,
    };
  }, [startDate, endDate]);

  const today = isoToDate(todayParis());
  const maxDate = startDate ? isoToDate(addDaysISO(startDate, 29)) : undefined;

  function handleSelect(range: DateRange | undefined) {
    if (!range?.from) {
      onChange({ startDate: "", endDate: "" });
      return;
    }
    const from = dateToISO(range.from);
    if (!range.to) {
      onChange({ startDate: from, endDate: "" });
      return;
    }
    const to = dateToISO(range.to);
    if (to === from) {
      onChange({ startDate: from, endDate: to });
      setOpen(false);
      return;
    }
    onChange({ startDate: from, endDate: to });
    setOpen(false);
  }

  function applyQuick(quick: (typeof QUICK_RANGES)[number]) {
    const start = quick.weekend ? nextWeekendISO() : addDaysISO(todayParis(), quick.offset ?? 30);
    const end = addDaysISO(start, quick.days - 1);
    onChange({ startDate: start, endDate: end });
    setOpen(false);
  }

  const nights =
    startDate && endDate
      ? Math.max(
          0,
          Number((isoToDate(endDate).getTime() - isoToDate(startDate).getTime()) / 86_400_000),
        )
      : 0;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-prune mb-1.5 block pl-1 text-[12px] font-extrabold">Aller</span>
          <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
              <button
                type="button"
                aria-label="Choisir les dates du voyage"
                className={cn(
                  "border-blush bg-paper text-prune hover:border-orange focus-visible:border-orange flex h-14 w-full items-center gap-2 rounded-full border-2 px-4 text-left text-[14px] font-bold transition-colors",
                  !startDate && "text-prune/40",
                  error && "border-framboise",
                )}
              >
                <CalendarDays className="text-orange-ink size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {startDate ? formatDateFr(startDate, "short") : "Choisir"}
                </span>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="start"
                sideOffset={8}
                className="border-prune/10 bg-paper shadow-lift z-50 w-[min(94vw,360px)] rounded-[1.75rem] border p-4"
              >
                <DayPicker
                  mode="range"
                  selected={selected}
                  onSelect={handleSelect}
                  locale={fr}
                  defaultMonth={startDate ? isoToDate(startDate) : today}
                  disabled={[{ before: today }, ...(maxDate ? [{ after: maxDate }] : [])]}
                  showOutsideDays={false}
                  classNames={{
                    root: "rdp-root w-full",
                    months: "w-full",
                    month: "w-full",
                    month_caption: "flex justify-center py-2 font-display text-lg uppercase",
                    caption_label: "font-display text-lg uppercase",
                    nav: "absolute inset-x-2 top-2 flex justify-between",
                    button_previous:
                      "flex size-8 items-center justify-center rounded-full bg-butter text-prune hover:bg-orange hover:text-prune",
                    button_next:
                      "flex size-8 items-center justify-center rounded-full bg-butter text-prune hover:bg-orange hover:text-prune",
                    month_grid: "w-full border-collapse",
                    weekdays: "text-[11px] font-extrabold uppercase text-prune/70",
                    weekday: "pb-1",
                    day: "p-0.5 text-center",
                    day_button:
                      "size-9 rounded-full text-[13px] font-bold transition-colors hover:bg-blush",
                    selected: "bg-framboise text-white",
                    range_start: "rounded-l-full bg-framboise text-white",
                    range_end: "rounded-r-full bg-framboise text-white",
                    range_middle: "bg-blush text-prune",
                    today:
                      "font-extrabold underline decoration-orange decoration-2 underline-offset-2",
                    outside: "opacity-30",
                    disabled: "opacity-25",
                  }}
                  components={{
                    Chevron: ({ orientation }) =>
                      orientation === "left" ? (
                        <ChevronLeft className="size-4" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="size-4" aria-hidden="true" />
                      ),
                  }}
                />
                <div className="border-blush mt-3 flex items-center justify-between border-t pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      onChange({ startDate: "", endDate: "" });
                      setOpen(false);
                    }}
                    className="text-prune/70 hover:text-framboise-dark flex items-center gap-1 text-[12px] font-bold"
                  >
                    <X className="size-3" aria-hidden="true" />
                    Effacer
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="bg-prune text-cream rounded-full px-4 py-2 text-[12px] font-extrabold"
                  >
                    C&apos;est bon
                  </button>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        <div>
          <span className="text-prune mb-1.5 block pl-1 text-[12px] font-extrabold">Retour</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Choisir la date de retour"
            className={cn(
              "border-blush bg-paper text-prune hover:border-orange flex h-14 w-full items-center gap-2 rounded-full border-2 px-4 text-left text-[14px] font-bold transition-colors",
              !endDate && "text-prune/40",
              error && "border-framboise",
            )}
          >
            <CalendarDays className="text-orange-ink size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{endDate ? formatDateFr(endDate, "short") : "Choisir"}</span>
          </button>
        </div>
      </div>

      {startDate && endDate ? (
        <p className="text-prune/70 mt-2 pl-1 text-[12px] font-bold" aria-live="polite">
          {nights + 1} jour{nights + 1 > 1 ? "s" : ""} sur place · {nights} nuit
          {nights > 1 ? "s" : ""}
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-framboise-dark mt-2 pl-1 text-sm font-bold">
          {error}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK_RANGES.map((quick) => (
          <button
            key={quick.label}
            type="button"
            onClick={() => applyQuick(quick)}
            className="bg-cream-soft text-prune/80 hover:bg-butter hover:text-prune rounded-full px-3.5 py-2 text-[12px] font-bold transition-colors"
          >
            {quick.label}
          </button>
        ))}
      </div>
    </div>
  );
}
