export const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
] as const;

export const NAV_CTA = {
  label: "Start a project",
  href: "/#contact",
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

export function isActive(pathname: string, href: string, hash = "") {
  const [targetPath, targetHash] = href.split("#");
  const path = targetPath || "/";

  if (pathname.startsWith("/projects/") && path === "/" && targetHash === "work") {
    return true;
  }

  if (pathname !== path) return false;
  return targetHash ? hash === targetHash : true;
}