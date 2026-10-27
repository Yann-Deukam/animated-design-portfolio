"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCurrentHash } from "@/utils/useCurrentHash";
import { CONTACT, isActive, NAV_CTA, NAV_LINKS } from "@/constantts/navConfig";
import Button from "./Button";
import SectionLink from "./SectionLink";

gsap.registerPlugin(useGSAP);

type MobileMenuProps = {
  id: string;
  open: boolean;
  onNavigate: () => void;
};

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function MobileMenu({ id, open, onNavigate }: MobileMenuProps) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();
  const hash = useCurrentHash();

  // Build the timeline once.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.inOut" },
        onReverseComplete: () => {
          gsap.set(el, { autoAlpha: 0 });
        },
      });

      tl.set(el, { autoAlpha: 1 })
        .fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85 }
        )
        .from(
          ".menu-link-inner",
          { yPercent: 115, duration: 0.9, stagger: 0.08, ease: "power4.out" },
          "-=0.4"
        )
        .from(
          ".menu-fade",
          { opacity: 0, y: 16, duration: 0.6, stagger: 0.08, ease: "power3.out" },
          "-=0.55"
        );

      timeline.current = tl;
    },
    { scope: root }
  );

  // Play / reverse when `open` changes.
  useEffect(() => {
    const tl = timeline.current;
    if (!tl) return;

    const reduce = prefersReducedMotion();

    if (open) {
      tl.timeScale(reduce ? 100 : 1).play();
    } else {
      tl.timeScale(reduce ? 100 : 1.4).reverse();
    }
  }, [open]);

  return (
    <div
      ref={root}
      id={id}
      role="region"
      aria-label="Menu"
      className="invisible fixed inset-0 z-40 flex flex-col bg-amber-50 text-background md:hidden"
    >
      <div className="flex flex-1 flex-col justify-between px-6 pb-8 pt-28">
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href, hash);

              return (
                <li key={link.href} className="overflow-hidden pb-[0.1em]">
                  <SectionLink
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className="block text-[clamp(3rem,15vw,5rem)] font-medium leading-[1.05] tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                  >
                    <span
                      className={`menu-link-inner block ${active ? "italic" : ""}`}
                    >
                      {link.label}
                    </span>
                  </SectionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-6">
          <Button
            href={NAV_CTA.href}
            onClick={onNavigate}
            variant="dark"
            className="menu-fade flex h-14 w-full text-lg"
          >
            {NAV_CTA.label}
          </Button>

          <div className="menu-fade flex flex-wrap items-end justify-between gap-x-6 gap-y-3 text-[15px]">
            {/* <a
              href={`mailto:${CONTACT.email}`}
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              {CONTACT.email}
            </a> */}
            <ul className="flex gap-20 mt-8">
              {CONTACT.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="opacity-70 transition-opacity hover:opacity-100"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}