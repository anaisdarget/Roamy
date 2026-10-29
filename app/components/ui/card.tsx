import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-prune/10 bg-paper shadow-soft rounded-[2rem] border p-8", className)}
      {...props}
    />
  );
}

export function Pill({
  className,
  tone = "butter",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "butter" | "blush" | "framboise" | "prune" | "cream" | "mint" | "outline";
}) {
  const tones = {
    butter: "bg-butter text-prune",
    blush: "bg-blush text-prune",
    framboise: "bg-framboise text-white",
    prune: "bg-prune text-butter",
    cream: "bg-cream-soft text-prune border border-prune/10",
    mint: "bg-mint text-prune",
    outline: "border-2 border-prune text-prune",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold tracking-[0.08em] uppercase",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  titleClassName,
  eyebrowTone = "butter",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  titleClassName?: string;
  eyebrowTone?: "butter" | "blush" | "prune" | "cream";
}) {
  return (
    <div className={cn("flex flex-col gap-4", align === "center" && "items-center text-center")}>
      {eyebrow ? <Pill tone={eyebrowTone}>{eyebrow}</Pill> : null}
      <h2 className={cn("display-section", titleClassName)}>{title}</h2>
      {intro ? (
        <p className="text-prune/80 max-w-2xl text-[17px] leading-relaxed md:text-lg">{intro}</p>
      ) : null}
    </div>
  );
}
