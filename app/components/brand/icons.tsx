import { cn } from "@/lib/utils/cn";

export function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={cn("size-6", className)}>
      <circle cx="50" cy="50" r="20" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="8" strokeLinecap="round">
        <path d="M50 4v13M50 83v13M4 50h13M83 50h13M17 17l9 9M74 74l9 9M17 83l9-9M74 26l9-9" />
      </g>
    </svg>
  );
}

export function FlowerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("size-6", className)}>
      <path
        d="M50 18C58 2 78 12 70 30c18-2 24 18 10 30 14 12 0 32-16 22-8 16-28 12-26-4-18 8-28-12-12-26C10 44 20 22 34 30c-4-14 12-24 16-12Z"
        fill="currentColor"
      />
      <circle cx="50" cy="50" r="9" fill="#FFE99A" />
    </svg>
  );
}
