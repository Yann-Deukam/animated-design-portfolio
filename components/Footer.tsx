"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";
import { ABOUT_STORY } from "@/constantts/aboutData";
import { CURVE_DOWN, CURVE_FLAT, EMAIL, NAV, SOCIALS } from "@/constantts/FooterData";
import Button from "./Button";

gsap.registerPlugin(useGSAP, ScrollTrigger, MorphSVGPlugin);

// Subtle film grain, inline so there is no external image
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")";

export default function Footer() {
  const root = useRef<HTMLElement>(null);
   const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.set("#footer-path", { morphSVG: CURVE_FLAT });
        return;
      }

      // 1. Bouncy curve: snaps from curved to flat with an elastic ease,
      //    and the bounce strength depends on how fast the user scrolled in
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        onEnter: (self) => {
          const v = Math.min(Math.abs(self.getVelocity()) / 10000, 0.6);
          gsap.fromTo(
            "#footer-path",
            { morphSVG: CURVE_DOWN },
            {
              morphSVG: CURVE_FLAT,
              duration: 2,
              ease: `elastic.out(${1 + v}, ${1 - v})`,
              overwrite: true,
            }
          );
        },
      });

      // 2. Content reveals one by one
      gsap.from(".footer-reveal", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });
    },
    { scope: root }
  );

  return (
    <footer
      ref={root}
      className="relative mt-24 w-full text-olive-950 md:mt-40"
    >
      {/* Gradient shape with the morphing top edge */}
      <svg
        className="pointer-events-none absolute inset-0 block h-full w-full overflow-visible"
        viewBox="0 0 2278 683"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="footer-grad"
            x1="0"
            y1="0"
            x2="2278"
            y2="683"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.2" stopColor="#fffbeb" />
            {/* <stop offset="0.8" stopColor="#fde68a" /> */}
          </linearGradient>
        </defs>
        <path id="footer-path" fill="url(#footer-grad)" d={CURVE_DOWN} />
      </svg>

      {/* Grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-32 md:px-14 md:pt-52">
        {/* CTA */}
        <div className="footer-reveal">
          <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.18em] opacity-60">
            Have a project in mind?
          </p>
          <Button
            href="/contact"
            variant="plain"
            className="gap-4 text-[clamp(2.5rem,7vw,6.5rem)] font-medium leading-none tracking-[-0.04em]"
            icon="↗"
            iconClassName="inline-block transition-transform duration-500 group-hover/roll:translate-x-2 group-hover/roll:-translate-y-2"
          >
            <span className="underline decoration-transparent decoration-2 underline-offset-8 transition-[text-decoration-color] duration-300 group-hover/roll:decoration-current">
              Let&apos;s work together
            </span>
          </Button>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-6 block w-fit text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
          >
            {EMAIL}
          </a>
        </div>

        {/* Link columns */}
        <div className="mt-16 grid grid-cols-2 gap-10 border-t border-black/15 pt-10 md:mt-24 md:grid-cols-4">
          <div className="footer-reveal col-span-2 max-w-xs md:col-span-1">
            <p className="text-xl font-semibold tracking-[-0.02em]">G-ni Studio</p>
            <p className="mt-3 text-[15px] leading-relaxed opacity-70">
              Identities, packaging and posters, with the websites that carry them.
            </p>
          </div>

          <div className="footer-reveal">
            <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.18em] opacity-55">
              Navigate
            </p>
            <ul className="space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[15px] font-medium opacity-80 transition-opacity hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-reveal">
            <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.18em] opacity-55">
              Services
            </p>
            <ul className="space-y-2.5">
              {ABOUT_STORY.capabilities.map((item) => (
                <li key={item.title} className="text-[15px] font-medium opacity-80">
                  {item.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-reveal">
            <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.18em] opacity-55">
              Social
            </p>
            <ul className="space-y-2.5">
              {SOCIALS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-medium opacity-80 transition-opacity hover:opacity-100"
                  >
                    {item.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-reveal mt-16 flex flex-col items-start justify-between gap-4 border-t border-black/15 pt-6 text-[13px] font-medium sm:flex-row sm:items-center">
          <p className="opacity-65">
            © 2026 G-ni Studio. All rights reserved.
          </p>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            variant="outline"
            icon="↑"
          >
            Back to top
          </Button>
        </div>
      </div>
    </footer>
  );
}