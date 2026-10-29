import { SunIcon } from "@/components/brand/icons";

const DEFAULT_ITEMS = ["Pack light", "Travel happy", "Roam free"];

export function TickerBand({
  items = DEFAULT_ITEMS,
  className = "bg-sun",
}: {
  items?: string[];
  className?: string;
}) {
  const repeated = [...items, ...items, ...items];
  return (
    <div
      className={`border-prune/10 overflow-hidden border-y py-4 ${className}`}
      aria-hidden="true"
    >
      <div className="flex w-max items-center gap-8 whitespace-nowrap">
        {repeated.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="font-display text-prune flex items-center gap-8 text-2xl tracking-wide uppercase md:text-[28px]"
          >
            {item}
            <SunIcon className="text-orange-ink size-6" />
          </span>
        ))}
      </div>
    </div>
  );
}
