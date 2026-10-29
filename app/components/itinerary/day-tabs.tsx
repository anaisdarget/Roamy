"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function DayTabs({ days }: { days: Array<{ date: string; theme: string; label: string }> }) {
  const [active, setActive] = useState(0);

  return (
    <div className="bg-cream/95 no-scrollbar sticky top-20 z-20 -mx-1 flex gap-2 overflow-x-auto px-1 py-3 backdrop-blur">
      {days.map((day, index) => (
        <button
          key={day.date}
          type="button"
          aria-current={active === index ? "true" : undefined}
          onClick={() => {
            setActive(index);
            document.getElementById(`jour-${index + 1}`)?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className={cn(
            "shrink-0 rounded-full px-5 py-2.5 text-[14px] font-extrabold transition-all",
            active === index
              ? "bg-framboise shadow-soft text-white"
              : "bg-butter text-prune hover:bg-sun",
          )}
          title={day.theme}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
}
