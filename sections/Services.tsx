"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SERVICES } from "@/constantts/serviceData";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ACTIVE_COLOR = "#e8d7b0";
const INACTIVE_COLOR = "rgba(245, 236, 215, 0.35)";

/** Scroll distance per service, as a percentage of the viewport height. */
const SCROLL_PER_SERVICE = 60;

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const items = gsap.utils.toArray<HTMLElement>(".service-item", section);
      const panels = gsap.utils.toArray<HTMLElement>(".service-panel", section);
      const fill = section.querySelector<HTMLElement>(".service-fill");
      const count = items.length;

      const mm = gsap.matchMedia();

      // Motion: pin the section and scrub through the services.
      // Reduced motion: no pin. The first service stays active and visible.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(items, { color: INACTIVE_COLOR });
        gsap.set(items[0], { color: ACTIVE_COLOR });
        gsap.set(panels, { autoAlpha: 0 });
        gsap.set(panels[0], { autoAlpha: 1 });

        if (fill) {
          gsap.set(fill, { scaleY: 1 / count, transformOrigin: "top left" });
        }

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${count * SCROLL_PER_SERVICE}%`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // One unit of timeline time per service. At position i, item i and panel i
        // take over from the previous ones.
        items.forEach((item, i) => {
          if (i === 0) return;

          tl.to(items[i - 1], { color: INACTIVE_COLOR, duration: 0.2 }, i)
            .to(item, { color: ACTIVE_COLOR, duration: 0.2 }, i)
            .to(panels[i - 1], { autoAlpha: 0, duration: 0.2 }, i)
            .to(panels[i], { autoAlpha: 1, duration: 0.2 }, i);
        });

        if (fill) {
          tl.to(
            fill,
            { scaleY: 1, transformOrigin: "top left", duration: count },
            0
          );
        }

        // Hold briefly on the last service before the pin releases.
        tl.to({}, { duration: 0.5 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="flex h-svh w-full items-center justify-center overflow-hidden border-y border-dashed border-amber-50/20 bg-olive-950 text-amber-50"
    >
      {/* Width: change max-w-[1600px] to widen or narrow the whole section. */}
      <div className="mx-auto flex w-full max-w-[1600px] items-stretch gap-10 px-6 md:gap-20 md:px-14">
        {/* Left: the service list and its progress line */}
        <div className="relative py-10 pl-6">
          <div className="service-fill absolute left-0 top-0 h-full w-0.5 bg-amber-200" />

          <ul className="flex flex-col gap-4">
            {SERVICES.map((service, i) => (
              <li
                key={service.id}
                className="service-item text-[clamp(2rem,4.5vw,3.75rem)] font-medium leading-tight tracking-[-0.035em]"
                style={{ color: i === 0 ? ACTIVE_COLOR : INACTIVE_COLOR }}
              >
                {service.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: one panel per service, stacked and swapped on scroll */}
        <div className="relative flex-1 self-stretch">
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              aria-hidden
              className={`service-panel absolute left-1/2 top-1/2 aspect-4/5 w-[min(80%,560px)] -translate-x-1/2 -translate-y-1/2 rounded-[10px] ${
                i === 0 ? "" : "invisible opacity-0"
              }`}
              style={{ backgroundColor: service.panelColor }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}