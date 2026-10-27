export type Service = {
  id: string;
  title: string;
  /** Placeholder background for the right-hand panel. Swap for an illustration or animated text later. */
  panelColor: string;
};

export const SERVICES: Service[] = [
  { id: "branding", title: "Branding", panelColor: "#8a4b35" },
  { id: "packaging", title: "Packaging", panelColor: "#4f6b58" },
  { id: "illustration", title: "Illustration", panelColor: "#c9a97a" },
  { id: "posters", title: "Posters", panelColor: "#2e4150" },
  { id: "frontend", title: "Frontend", panelColor: "#6e5a7a" },
];