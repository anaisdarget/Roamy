import * as React from "react";
import { cn } from "@/lib/utils/cn";

const CREAM = "#FFF6E0";

export function Sticker({
  children,
  className,
  rotate = 0,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block drop-shadow-[0_3px_0_rgba(74,15,46,0.10)] select-none",
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <svg
        viewBox="0 0 120 120"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className="size-full overflow-visible"
      >
        {children}
      </svg>
    </span>
  );
}

const outline = {
  stroke: CREAM,
  strokeWidth: 7,
  strokeLinejoin: "round" as const,
  paintOrder: "stroke" as const,
};

export function SunSticker({ className, rotate = -6 }: { className?: string; rotate?: number }) {
  return (
    <Sticker className={className} rotate={rotate}>
      <g strokeLinecap="round">
        <g stroke={CREAM} strokeWidth="25">
          <path d="M60 6v20M60 94v20M6 60h20M94 60h20M22 22l14 14M84 84l14 14M22 98l14-14M84 36l14-14" />
        </g>
        <g stroke="#FFD93B" strokeWidth="10">
          <path d="M60 6v20M60 94v20M6 60h20M94 60h20M22 22l14 14M84 84l14 14M22 98l14-14M84 36l14-14" />
        </g>
      </g>
      <circle cx="60" cy="60" r="28" fill="#FFD93B" {...outline} />
      <path
        d="M60 48c9 0 14 7 11 15-3 7-13 8-17 2-3-5 1-11 6-10 4 1 4 7 0 8"
        fill="none"
        stroke="#FA7443"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Sticker>
  );
}

export function PalmSticker({ className, rotate = 8 }: { className?: string; rotate?: number }) {
  return (
    <Sticker className={className} rotate={rotate}>
      <path d="M56 108c-2-22 1-45 7-65h9c-5 22-7 44-5 65Z" fill="#A83909" {...outline} />
      <g {...outline}>
        <path d="M66 46C52 25 28 25 14 41c14-4 31 0 40 12Z" fill="#A8BF8C" />
        <path d="M67 44C64 20 45 10 27 15c14 3 25 14 28 28Z" fill="#8DA56F" />
        <path d="M69 44C78 20 98 12 112 24c-14-1-28 8-34 22Z" fill="#A8BF8C" />
        <path d="M70 46c14-17 36-16 46 1-12-7-28-4-38 5Z" fill="#8DA56F" />
        <path d="M68 45c1-18-9-33-26-38 9 8 14 19 14 30Z" fill="#8DA56F" />
      </g>
      <circle cx="54" cy="74" r="5" fill="#FFD93B" {...outline} />
      <circle cx="48" cy="89" r="5" fill="#FFD93B" {...outline} />
    </Sticker>
  );
}

export function FishSticker({ className, rotate = -4 }: { className?: string; rotate?: number }) {
  return (
    <Sticker className={className} rotate={rotate}>
      <path
        d="M95 60c-9 17-25 27-42 27-18 0-31-12-31-27s13-27 31-27c17 0 33 10 42 27Z"
        fill="#FF6F61"
        {...outline}
      />
      <path d="M96 60l17-18v36Z" fill="#FA7443" {...outline} />
      <path d="M53 35c5-8 14-11 22-8-3 7-10 12-18 13Z" fill="#FFD93B" {...outline} />
      <circle cx="41" cy="54" r="4" fill="#4A0F2E" />
      <path
        d="M30 66c9 5 18 5 26 0"
        fill="none"
        stroke="#FFF6E0"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Sticker>
  );
}

export function HibiscusSticker({
  className,
  rotate = 5,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <Sticker className={className} rotate={rotate}>
      <g {...outline}>
        <circle cx="60" cy="32" r="18" fill="#FF4FA3" />
        <circle cx="84" cy="49" r="18" fill="#D6336C" />
        <circle cx="75" cy="78" r="18" fill="#FF4FA3" />
        <circle cx="44" cy="78" r="18" fill="#D6336C" />
        <circle cx="35" cy="49" r="18" fill="#FF4FA3" />
      </g>
      <circle cx="60" cy="57" r="12" fill="#FFD93B" {...outline} />
      <circle cx="60" cy="57" r="4" fill="#FA7443" />
    </Sticker>
  );
}

export function LemonSticker({ className, rotate = -8 }: { className?: string; rotate?: number }) {
  return (
    <Sticker className={className} rotate={rotate}>
      <path
        d="M31 75c-12-12-10-31 4-43 14-12 35-10 45 4 10 14 7 34-8 44-15 10-32 8-41-5Z"
        fill="#FFD93B"
        {...outline}
      />
      <path d="M92 24c10-8 20-6 22-4-4 8-9 14-17 16Z" fill="#A8BF8C" {...outline} />
      <path
        d="M45 61c5-11 16-18 28-19"
        fill="none"
        stroke="#FFF6E0"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M54 72c4-6 10-10 17-11"
        fill="none"
        stroke="#FFF6E0"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".7"
      />
    </Sticker>
  );
}

export function WaveSticker({ className, rotate = 3 }: { className?: string; rotate?: number }) {
  return (
    <Sticker className={className} rotate={rotate}>
      <path
        d="M12 72c10-18 22-18 30-2 8 16 20 16 30 0 8-14 20-14 32 2v30H12Z"
        fill="#6F7FD6"
        {...outline}
      />
      <path
        d="M12 55c10-18 22-18 30-2 8 16 20 16 30 0 8-14 20-14 32 2"
        fill="none"
        stroke="#FFF6E0"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </Sticker>
  );
}

export function StarSticker({ className, rotate = 7 }: { className?: string; rotate?: number }) {
  return (
    <Sticker className={className} rotate={rotate}>
      <path
        d="m60 10 14 30 33 4-24 23 6 33-29-15-29 15 6-33-24-23 33-4Z"
        fill="#FFD93B"
        {...outline}
      />
      <circle cx="60" cy="59" r="8" fill="#FA7443" />
    </Sticker>
  );
}

export function ShellSticker({ className, rotate = -5 }: { className?: string; rotate?: number }) {
  return (
    <Sticker className={className} rotate={rotate}>
      <path
        d="M60 106c-25 0-43-16-43-38 0-19 19-34 43-34s43 15 43 34c0 22-18 38-43 38Z"
        fill="#FFB59C"
        {...outline}
      />
      <g stroke="#D6336C" strokeWidth="3" strokeLinecap="round">
        <path d="M60 38v64M44 43 38 98M76 43l6 55M30 55l12 45M90 55 78 100" />
      </g>
      <path d="M30 78h60" stroke="#FFF6E0" strokeWidth="4" strokeLinecap="round" />
    </Sticker>
  );
}

export function ShakaSticker({ className, rotate = -7 }: { className?: string; rotate?: number }) {
  return (
    <Sticker className={className} rotate={rotate}>
      <path
        d="M38 106c-13-10-18-27-15-44l4-23c1-6 9-6 10 0l3 17 3-34c1-7 10-7 11 0l3 32 4-27c1-7 10-6 10 1l1 28 5-18c2-6 10-5 10 2l-3 34c-2 18-14 32-30 34-6 1-11 0-16-2Z"
        fill="#FFD93B"
        {...outline}
      />
      <path
        d="M41 92c8-8 19-12 30-11"
        fill="none"
        stroke="#FA7443"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M40 72c9-7 20-10 31-8"
        fill="none"
        stroke="#FA7443"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Sticker>
  );
}

export function SurfboardSticker({
  className,
  rotate = 6,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <Sticker className={className} rotate={rotate}>
      <path
        d="M60 8c18 22 24 49 18 76-3 14-10 24-18 30-8-6-15-16-18-30-6-27 0-54 18-76Z"
        fill="#BFEBE3"
        {...outline}
      />
      <path d="M60 18v86" stroke="#FF4FA3" strokeWidth="6" strokeLinecap="round" />
      <path d="M44 60c10-4 22-4 32 0" stroke="#FFD93B" strokeWidth="5" strokeLinecap="round" />
    </Sticker>
  );
}

export function FlowerSticker({ className, rotate = -5 }: { className?: string; rotate?: number }) {
  return (
    <Sticker className={className} rotate={rotate}>
      <g {...outline}>
        <ellipse cx="60" cy="30" rx="17" ry="23" fill="#FFE0EA" />
        <ellipse cx="84" cy="46" rx="17" ry="23" transform="rotate(60 84 46)" fill="#FF4FA3" />
        <ellipse cx="75" cy="76" rx="17" ry="23" transform="rotate(120 75 76)" fill="#FFE0EA" />
        <ellipse cx="45" cy="76" rx="17" ry="23" transform="rotate(60 45 76)" fill="#FF4FA3" />
        <ellipse cx="36" cy="46" rx="17" ry="23" transform="rotate(120 36 46)" fill="#FFE0EA" />
      </g>
      <circle cx="60" cy="57" r="13" fill="#FFD93B" {...outline} />
    </Sticker>
  );
}

export function SquiggleSticker({
  className,
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <Sticker className={className} rotate={rotate}>
      <path
        d="M10 80c14-30 28-30 40-12s26 18 38-12 22-28 22-28"
        fill="none"
        stroke={CREAM}
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d="M10 80c14-30 28-30 40-12s26 18 38-12 22-28 22-28"
        fill="none"
        stroke="#FA7443"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </Sticker>
  );
}

export const STEP_STICKERS = {
  destination: PalmSticker,
  dates: SunSticker,
  budget: LemonSticker,
  interests: HibiscusSticker,
  rhythm: WaveSticker,
  identity: StarSticker,
} as const;
