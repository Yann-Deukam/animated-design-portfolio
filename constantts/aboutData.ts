export type AboutTile = {
  id: string;
  /** Tailwind grid placement (col-start-*, row-start-*, row-span-*). */
  place: string;
  /** Path inside /public, or a full URL. Leave undefined to show a placeholder tile. */
  src?: string;
  alt: string;
  /** Tonal placeholder shown when there is no `src`. */
  tone: string;
  /** The tile the scroll zooms into. Exactly one tile, spanning a single column. */
  focus?: boolean;
};

/** Gap between tiles. Any CSS length works. */
export const TILE_GAP = "clamp(8px, 1.1svh, 16px)";

/** Rows in the grid. In every column the tile row-spans must add up to this. */
export const GRID_ROWS = 9;

/*
  Bento layout: 3 columns x 9 rows, no empty cells.

    1 | 4 | 7
    1 | 4 | 7
    2 | 4 | 7
    2 | 5 | 7
    2 | 5 | 8
    3 | 5 | 8
    3 | 6 | 8
    3 | 6 | 8
    3 | 6 | 8

  Column 1: three tiles of different heights (2, 3 and 4 rows)
  Column 2: three tiles of the same height (3 rows each)
  Column 3: two tiles (4 and 5 rows)

  Tile 5, in the middle of the middle column, is the focus: on scroll the grid
  zooms until it fills the screen. To zoom into another tile, move `focus: true`
  to it. It must span a single column.

  These are GSAP's public demo images, so the effect looks right straight away.
  Swap each `src` for your own work in /public/images/about/ (for example
  "/images/about/01.jpg") before launch.
*/

export const ABOUT_TILES: AboutTile[] = [
  // Column 1
  {
    id: "t1",
    place: "col-start-1 row-start-1 row-span-2",
    src: `/images/about/01.jpg`,
    alt: "",
    tone: "bg-neutral-800",
  },
  {
    id: "t2",
    place: "col-start-1 row-start-3 row-span-3",
    src: `/images/about/02.jpg`,
    alt: "",
    tone: "bg-neutral-700",
  },
  {
    id: "t3",
    place: "col-start-1 row-start-6 row-span-4",
    src: `/images/about/03.jpg`,
    alt: "",
    tone: "bg-neutral-800",
  },
  // Column 2
  {
    id: "t4",
    place: "col-start-2 row-start-1 row-span-3",
    src: `/images/about/05.jpg`,
    alt: "",
    tone: "bg-neutral-700",
  },
  {
    id: "t5",
    place: "col-start-2 row-start-4 row-span-3",
    src: `/images/about/portrait.jpg`,
    alt: "Featured work from G-ni Studio",
    tone: "bg-neutral-800",
    focus: true,
  },
  {
    id: "t6",
    place: "col-start-2 row-start-7 row-span-3",
    src: `/images/about/06.jpg`,
    alt: "",
    tone: "bg-neutral-700",
  },
  // Column 3
  {
    id: "t7",
    place: "col-start-3 row-start-1 row-span-4",
    src: `/images/about/07.jpg`,
    alt: "",
    tone: "bg-neutral-800",
  },
  {
    id: "t8",
    place: "col-start-3 row-start-5 row-span-5",
    src: `/images/about/08.jpg`,
    alt: "",
    tone: "bg-neutral-700",
  },
];

/** Row span of the focus tile, read from its `row-span-N` class. Sizes the zoomed grid. */
export const FOCUS_ROW_SPAN = Number(
  ABOUT_TILES.find((tile) => tile.focus)?.place.match(/row-span-(\d+)/)?.[1] ?? 1
);

export const ABOUT_STATEMENT = {
  lines: ["One studio", "for the brand", "and the build."],
  support:
    "G-ni Studio designs identities, packaging and posters, then builds the websites that carry them.",
  cta: { label: "See the work", href: "/#work" },
} as const;

export const ABOUT_STORY = {
  heading: "Design and code from one desk.",
  paragraphs: [
    "G-ni Studio is a freelance studio for brands that want their identity and their website to feel like one thing. The design work covers branding, packaging, illustration and posters. The build is done in Next.js and React.",
    "Working across both means nothing gets lost in a handoff. The colors, type and motion you approve in a design are the ones that ship.",
  ],
  capabilities: [
    { title: "Branding", detail: "Identity systems, logos and guidelines" },
    { title: "Packaging", detail: "Labels and boxes, ready for print" },
    { title: "Illustration", detail: "Custom artwork and icon sets" },
    { title: "Posters", detail: "Campaign and event visuals" },
    { title: "Frontend", detail: "Next.js sites with considered motion" },
  ],
  cta: { label: "Start a project", href: "/#contact" },
} as const;