import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * DevKitX logo — an open toolbox with code/terminal glyphs.
 * Pure SVG with gradients so it scales crisply and adapts to dark mode.
 */
export function Logo({ className, size = 28 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dkx-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="dkx-purple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      {/* Left panel of toolbox */}
      <path
        d="M6 30 L32 26 L32 56 L10 56 C7.8 56 6 54.2 6 52 Z"
        fill="url(#dkx-blue)"
      />
      {/* Right panel */}
      <path
        d="M58 30 L32 26 L32 56 L54 56 C56.2 56 58 54.2 58 52 Z"
        fill="url(#dkx-purple)"
      />
      {/* </> glyph on left panel */}
      <path
        d="M15 41 L11.5 44 L15 47 M22 41 L25.5 44 L22 47 M20 39.5 L17 48.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* >_ glyph on right panel */}
      <path
        d="M40 43 L43.5 45.5 L40 48 M46 49 L52 49"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Gear poking out top */}
      <circle cx="32" cy="14" r="6" fill="url(#dkx-purple)" />
      <circle cx="32" cy="14" r="2.2" fill="#0F172A" />
      <g stroke="url(#dkx-purple)" strokeWidth="2" strokeLinecap="round">
        <line x1="32" y1="4" x2="32" y2="7" />
        <line x1="32" y1="21" x2="32" y2="24" />
        <line x1="22" y1="14" x2="25" y2="14" />
        <line x1="39" y1="14" x2="42" y2="14" />
      </g>
    </svg>
  );
}
