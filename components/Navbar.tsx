"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MenuToggle from "./MenuToggle";
import MobileMenu from "./MobileMenu";
import Button from "./Button";
import { useNavbarScroll } from "@/utils/useNavbarScroll";
import { NAV_CTA } from "@/constantts/navConfig";

gsap.registerPlugin(useGSAP);

type NavbarProps = {
  /**
   * Tone of what sits behind the transparent navbar.
   * "auto" follows your theme (--foreground on --background).
   * "dark" is white text over a dark hero, "light" is dark text over a light hero.
   */
  heroTone?: "auto" | "dark" | "light";
};

export default function Navbar({ heroTone = "auto" }: NavbarProps) {
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrolled = useNavbarScroll(headerRef, { locked: menuOpen });
  const state = menuOpen ? "open" : scrolled ? "scrolled" : "top";

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  // One entrance moment on first load.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(navRef.current, {
        y: -20,
        opacity: 0,
        duration: 1.1,
        delay: 0.15,
        ease: "power4.out",
        clearProps: "transform,opacity",
      });
    },
    { scope: headerRef }
  );

  // Lock page scroll, close on Escape, close when resizing up to desktop.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const query = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    query.addEventListener("change", onBreakpoint);

    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      query.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 will-change-transform md:px-8 md:pt-5"
      >
        <nav
          ref={navRef}
          aria-label="Main"
          data-state={state}
          data-tone={heroTone}
          className="navbar pointer-events-auto mx-auto flex h-14 w-full items-center justify-between rounded-full pl-4 pr-3 md:grid md:h-16 md:grid-cols-[1fr_auto_1fr] md:pl-5 md:pr-2.5"
        >
          <div className="justify-self-start">
            <Logo onClick={closeMenu} />
          </div>

          <NavLinks className="hidden md:flex" />

          <div className="flex items-center justify-self-end">
            <Button
              href={NAV_CTA.href}
              variant="navbar"
            >
              {NAV_CTA.label}
            </Button>

            <MenuToggle open={menuOpen} onToggle={toggleMenu} controls={menuId} />
          </div>
        </nav>
      </header>

      {/* Sibling of the header on purpose: the header is transformed, which would break `fixed` positioning inside it. */}
      <MobileMenu id={menuId} open={menuOpen} onNavigate={closeMenu} />
    </>
  );
}