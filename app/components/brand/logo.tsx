import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { SunIcon } from "./icons";

export function Logo({
  className,
  tone = "prune",
  size = "md",
}: {
  className?: string;
  tone?: "prune" | "cream";
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "text-2xl",
    md: "text-[2rem]",
    lg: "text-5xl",
    xl: "text-[clamp(4rem,16vw,12rem)]",
  } as const;

  return (
    <span
      className={cn(
        "font-display inline-flex items-baseline gap-1.5 leading-none tracking-tight lowercase",
        tone === "prune" ? "text-prune" : "text-cream",
        sizes[size],
        className,
      )}
    >
      roamy
      <SunIcon
        className={cn(
          "mb-[0.1em] shrink-0",
          size === "sm" && "size-5",
          size === "md" && "size-6",
          size === "lg" && "size-8",
          size === "xl" && "size-[0.32em]",
          tone === "prune" ? "text-orange" : "text-butter",
        )}
      />
    </span>
  );
}

export function LogoLink({ className, tone }: { className?: string; tone?: "prune" | "cream" }) {
  return (
    <Link href="/" aria-label="Roamy — retour à l'accueil" className={className}>
      <Logo tone={tone} />
    </Link>
  );
}
