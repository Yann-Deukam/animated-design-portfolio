export const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
] as const;

export const NAV_CTA = {
  label: "Start a project",
  href: "/contact",
} as const;

// Shown at the bottom of the mobile menu. Replace with your real details.
export const CONTACT = {
  email: "hello@g-ni.studio",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Behance", href: "https://behance.net/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ],
} as const;

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}