"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContactForm from "@/components/ContactForm";
import WorldMap from "@/components/WorldMap";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** How far each column travels in from its side, in pixels. */
const SLIDE_DISTANCE = 120;

/** The animation only runs when this matches. 1024px is where the layout becomes two columns. */
const DESKTOP_MOTION = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const left = section.querySelector(".contact-left");
      const right = section.querySelector(".contact-right");

      const mm = gsap.matchMedia();

      // Motion: the left column slides in from the left, the right from the right.
      // Reduced motion: both columns stay in place with no animation.
      // Desktop only (1024px and up, where the columns sit side by side).
      // Below that the columns stack and nothing animates. Crossing the
      // breakpoint in either direction clears or restores the animation.
      mm.add(DESKTOP_MOTION, () => {
        // Scroll-linked timeline. It runs from the moment the section enters the
        // bottom of the viewport to the moment it leaves the top:
        //   0.00 to 0.35  columns move inward from the sides
        //   0.35 to 0.65  columns rest in place
        //   0.65 to 1.00  columns move back out as the section leaves
        // Because it is scrubbed, scrolling up reverses every step.
        gsap
          .timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          })
          .fromTo(
            left,
            { x: -SLIDE_DISTANCE, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.35 },
            0
          )
          .fromTo(
            right,
            { x: SLIDE_DISTANCE, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.35 },
            0
          )
          .to(left, { x: -SLIDE_DISTANCE, opacity: 0, duration: 0.35 }, 0.65)
          .to(right, { x: SLIDE_DISTANCE, opacity: 0, duration: 0.35 }, 0.65);
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="bg-olive-950 px-6 py-24 text-amber-50 md:px-14 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="contact-left">
          <h2 className="mb-6 text-5xl font-medium tracking-[-0.045em] md:text-6xl">
            From all around the world
          </h2>
          <p className="mb-12 max-w-md text-lg leading-relaxed text-amber-50/70">
            Clients reach us from every continent. Wherever your project starts,
            it lands with us in Cameroon.
          </p>
          <WorldMap />
        </div>

        <div className="contact-right">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}