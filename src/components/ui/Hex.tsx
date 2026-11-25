import type { CSSProperties } from "react";

/** Hexagon avatar: photo if available, otherwise a tonal initials placeholder. */
export function HexAvatar({
  src,
  name,
  size = 56,
  tone = "red",
  className = "",
}: {
  src?: string;
  name: string;
  size?: number;
  tone?: "red" | "dark" | "light";
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const bg =
    tone === "red"
      ? "linear-gradient(140deg,#ff4a35,#b30000)"
      : tone === "dark"
        ? "linear-gradient(140deg,#2a2a31,#0d0d11)"
        : "linear-gradient(140deg,#ffffff,#d9d5cc)";
  const fg = tone === "light" ? "#0a0a0c" : "#fff";
  const style: CSSProperties = { width: size, height: size };
  return (
    <span className={`hex relative inline-grid shrink-0 place-items-center overflow-hidden ${className}`} style={{ ...style, background: bg, color: fg }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" draggable={false} loading="lazy" />
      ) : (
        <span className="font-display font-extrabold tracking-[-0.04em]" style={{ fontSize: size * 0.34 }}>
          {initials}
        </span>
      )}
    </span>
  );
}

/** Very simple outlined hexagon used as decoration. */
export function HexOutline({
  size = 120,
  className = "",
  stroke = "currentColor",
  fill = "none",
  width = 1.2,
}: {
  size?: number;
  className?: string;
  stroke?: string;
  fill?: string;
  width?: number;
}) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden>
      <path d="M100 8 L180 54 L180 146 L100 192 L20 146 L20 54 Z" fill={fill} stroke={stroke} strokeWidth={width * 2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Multiplayer-style pointer arrow with a name tag. */
export function CursorTag({ name, color = "#ff2418", className = "" }: { name: string; color?: string; className?: string }) {
  return (
    <span className={`pointer-events-none inline-flex items-start ${className}`}>
      <svg width="20" height="20" viewBox="0 0 18 18" className="drop-shadow-[0_4px_8px_rgba(0,0,0,.4)]">
        <path d="M2 1.5l13 6.2-5.6 1.7-2.1 5.6z" fill={color} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span className="-ml-0.5 mt-3.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.65rem] font-bold text-white" style={{ background: color }}>
        {name}
      </span>
    </span>
  );
}
