import type { CSSProperties } from "react";

/**
 * Fine film grain over the dark layer. It is a static SVG filter, so it adds
 * texture without any runtime cost.
 */
const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;

export const GRAIN_STYLE: CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`,
  backgroundSize: "160px 160px",
  opacity: 0.08,
};

/** The blueprint grid inside the lens. Lines use the text color at low strength. */
const GRID_LINE = "color-mix(in srgb, currentColor 13%, transparent)";

export const GRID_STYLE: CSSProperties = {
  backgroundImage: `linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)`,
  backgroundSize: "64px 64px",
};