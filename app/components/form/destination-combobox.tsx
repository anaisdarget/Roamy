"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Compass, MapPin, Sparkles } from "lucide-react";
import {
  searchDestinations,
  SURPRISE_DESTINATIONS,
  type Destination,
} from "@/lib/data/destinations";
import { cn } from "@/lib/utils/cn";

export function DestinationCombobox({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const listId = useId();
  const inputId = "destination";
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousValue, setPreviousValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sync with an external selection (trending card, URL, reset) during render.
  if (value !== previousValue) {
    setPreviousValue(value);
    setQuery(value);
    setActiveIndex(0);
  }

  const results = useMemo(() => {
    const found = searchDestinations(query, 7);
    const exact = found.some(
      (destination) => destination.label.toLowerCase() === query.trim().toLowerCase(),
    );
    const trimmed = query.trim();
    const options: Array<
      Destination | { name: string; country: string; label: string; tag: string; emoji: string }
    > = [...found];
    if (trimmed.length >= 2 && !exact) {
      options.unshift({
        name: trimmed,
        country: "Destination libre",
        label: trimmed,
        tag: "À explorer",
        emoji: "📍",
      });
    }
    return options;
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const element = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    element?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function choose(destination: Destination | { label: string }) {
    onChange(destination.label);
    setQuery(destination.label);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      if (open && results[activeIndex]) {
        event.preventDefault();
        choose(results[activeIndex]);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  function surprise() {
    const random = SURPRISE_DESTINATIONS[Math.floor(Math.random() * SURPRISE_DESTINATIONS.length)];
    onChange(random);
    setQuery(random);
    setOpen(false);
  }

  const listVisible = open && results.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="relative flex-1">
          <Compass
            className="text-orange-ink pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            id={inputId}
            role="combobox"
            aria-expanded={listVisible}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={listVisible ? `${listId}-option-${activeIndex}` : undefined}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            autoComplete="off"
            value={query}
            placeholder="Tape une ville ou un pays…"
            className={cn(
              "border-blush bg-paper text-prune placeholder:text-prune/40 focus:border-orange h-14 w-full rounded-full border-2 pr-5 pl-12 text-[16px] font-semibold transition-colors outline-none placeholder:font-medium",
              error && "border-framboise",
            )}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
              onChange(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          type="button"
          onClick={surprise}
          className="bg-butter text-prune hover:bg-orange hover:text-prune flex h-14 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-extrabold transition-colors"
        >
          Surprends-moi !
          <Sparkles className="size-4" aria-hidden="true" />
        </button>
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-framboise-dark mt-2 pl-2 text-sm font-bold"
        >
          {error}
        </p>
      ) : null}

      {listVisible ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Suggestions de destinations"
          className="border-prune/10 bg-paper shadow-lift absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-[1.5rem] border p-2"
        >
          {results.map((destination, index) => (
            <li
              key={`${destination.label}-${index}`}
              id={`${listId}-option-${index}`}
              data-index={index}
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                choose(destination);
              }}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3",
                index === activeIndex ? "bg-blush" : "hover:bg-cream-soft",
              )}
            >
              <span className="flex items-center gap-3">
                <span className="text-xl" aria-hidden="true">
                  {destination.emoji}
                </span>
                <span>
                  <span className="block text-[15px] leading-tight font-extrabold">
                    {destination.name}
                  </span>
                  <span className="text-prune/70 block text-[12px] font-semibold">
                    {destination.country}
                  </span>
                </span>
              </span>
              <span className="bg-butter shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase">
                {destination.tag}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function TrendingDestinationCards({ onSelect }: { onSelect: (value: string) => void }) {
  const destinations = useMemo(() => searchDestinations("", 4), []);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {destinations.map((destination, index) => (
        <button
          key={destination.label}
          type="button"
          onClick={() => onSelect(destination.label)}
          className={cn(
            "group bg-cream-soft rounded-[1.4rem] p-2.5 text-left transition-transform duration-200 hover:-translate-y-1 hover:rotate-0",
            index % 2 === 0 ? "-rotate-2" : "rotate-2",
          )}
        >
          <span className="bg-blush relative block h-28 overflow-hidden rounded-[1rem] md:h-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={destination.image ?? "/images/hero-calanque.jpg"}
              alt=""
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </span>
          <span className="flex items-center justify-between gap-1 px-1 pt-2.5">
            <span className="text-prune text-[13px] font-extrabold">{destination.name}</span>
            <span className="text-orange-ink flex items-center gap-0.5 text-[10px] font-extrabold uppercase">
              {destination.tag}
              <MapPin className="size-3" aria-hidden="true" />
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
