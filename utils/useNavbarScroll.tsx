"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Options = {
  /** Scroll distance (px) after which the navbar leaves its transparent state. */
  threshold?: number;
  /** Scroll distance (px) before hiding on scroll down is allowed. */
  hideAfter?: number;
  /** While true the navbar always stays visible (e.g. mobile menu open). */
  locked?: boolean;
};

/**
 * Hides the header when scrolling down, reveals it when scrolling up.
 * Returns `scrolled`: true once the page is scrolled past `threshold`.
 */
export function useNavbarScroll(
  headerRef: RefObject<HTMLElement | null>,
  { threshold = 24, hideAfter = 160, locked = false }: Options = {}
) {
  const [scrolled, setScrolled] = useState(false);
  const lockedRef = useRef(locked);
  const hideTween = useRef<gsap.core.Tween | null>(null);
  const hidden = useRef(false);

  // Opening the mobile menu forces the header back into view.
  useEffect(() => {
    lockedRef.current = locked;
    if (locked && hidden.current) {
      hidden.current = false;
      hideTween.current?.reverse();
    }
  }, [locked]);

  useGSAP(
    () => {
      const el = headerRef.current;
      if (!el) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const tween = gsap.to(el, {
        yPercent: -120,
        duration: reduceMotion ? 0 : 0.55,
        ease: "power3.inOut",
        paused: true,
      });
      hideTween.current = tween;

      const update = (y: number, direction: number) => {
        setScrolled(y > threshold);
        if (lockedRef.current) return;

        const shouldHide = direction === 1 && y > hideAfter;
        if (shouldHide === hidden.current) return;

        hidden.current = shouldHide;
        if (shouldHide) tween.play();
        else tween.reverse();
      };

      // Handles page reloads that restore a scrolled position.
      update(window.scrollY, -1);

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => update(self.scroll(), self.direction),
      });
    },
    { scope: headerRef }
  );

  return scrolled;
}