"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button";
import { HERO } from "@/constantts/heroData";
import { GRAIN_STYLE, GRID_STYLE } from "@/constantts/heroStyles";
import { heroMono } from "@/constantts/fonts";
import HeroHeadline from "@/components/HeroHeadline";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Remembers that the full intro has played, so returning visitors get the short one. */
const INTRO_KEY = "gni-hero-intro-seen";

const HIDDEN_LENS = "circle(0px at 50% 50%)";

/*
  How this hero works

  Two layers sit on top of each other with identical layout:
    1. The finished design: dark, with the solid serif headline.
    2. The build view: a cream blueprint with the same headline drawn as an
       outline, a grid, live measurements and the code behind the footer.

  Layer 2 is clipped to a circle (the lens). The circle follows the pointer on
  desktop and wanders on its own on touch screens. All lens motion goes through
  one plain object, `pos`, which render() writes to the DOM once per frame.
*/

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const lens = lensRef.current;
      const crosshair = crosshairRef.current;
      const coords = coordsRef.current;
      if (!section || !lens || !crosshair || !coords) return;

      const words = gsap.utils.toArray<HTMLElement>(".hero-design .hero-word", section);
      const foot = gsap.utils.toArray<HTMLElement>(".hero-foot", section);
      // Each block exists in both layers, so one selector moves both together.
      const blockA = gsap.utils.toArray<HTMLElement>(".hero-block-0", section);
      const blockB = gsap.utils.toArray<HTMLElement>(".hero-block-1", section);

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          fine: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { reduce, fine } = context.conditions as {
            reduce: boolean;
            fine: boolean;
          };

          // Reduced motion: show the finished headline. No intro, no lens, no drift.
          if (reduce) {
            gsap.set([...words, ...foot], { autoAlpha: 1 });
            return;
          }

          /* ---------- Lens state and rendering ---------- */

          const pos = { x: 0, y: 0, r: 0 };
          let visible = true;
          let lastFrame = "";

          const render = () => {
            if (!visible) return;
            const frame = `${pos.x.toFixed(1)}|${pos.y.toFixed(1)}|${pos.r.toFixed(1)}`;
            if (frame === lastFrame) return;
            lastFrame = frame;

            lens.style.clipPath = `circle(${Math.max(pos.r, 0)}px at ${pos.x}px ${pos.y}px)`;
            crosshair.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
            coords.textContent = `${Math.round(pos.x)}, ${Math.round(pos.y)}`;
          };
          gsap.ticker.add(render);

          // Pause rendering while the hero is off screen.
          ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              visible = self.isActive;
            },
          });

          /* ---------- Measurements ---------- */

          const measure = () => {
            section.querySelectorAll<HTMLElement>("[data-dim]").forEach((tag) => {
              const block = tag.parentElement;
              if (!block) return;
              tag.textContent = `${Math.round(block.offsetWidth)} × ${Math.round(block.offsetHeight)}`;
            });
          };
          document.fonts.ready.then(measure);

          let onResize: (() => void) | null = null;
          const resizeObserver = new ResizeObserver(() => {
            measure();
            onResize?.();
          });
          resizeObserver.observe(section);

          /* ---------- Helpers ---------- */

          const headlineCenter = () => {
            const heading = section.querySelector<HTMLElement>(".hero-design h1");
            const box = (heading ?? section).getBoundingClientRect();
            const outer = section.getBoundingClientRect();
            return {
              x: box.left - outer.left + box.width / 2,
              y: box.top - outer.top + box.height / 2,
            };
          };

          const hoverRadius = () => gsap.utils.clamp(120, 240, window.innerWidth * 0.14);
          const introRadius = () =>
            Math.hypot(section.clientWidth, section.clientHeight) * 0.42;

          /* ---------- Interaction: mouse ---------- */

          const startFine = () => {
            const client = { x: 0, y: 0 };
            const setX = gsap.quickTo(pos, "x", { duration: 0.8, ease: "power3.out" });
            const setY = gsap.quickTo(pos, "y", { duration: 0.8, ease: "power3.out" });
            let inside = false;
            let radius = 0;

            // If nobody has moved a mouse yet, the lens shows itself once to
            // teach the interaction.
            const center = headlineCenter();
            const width = section.clientWidth;
            const peek = gsap
              .timeline({
                delay: 1.4,
                onStart: () =>
                  gsap.set(pos, { x: center.x - width * 0.2, y: center.y - 40 }),
              })
              .to(pos, { r: hoverRadius(), duration: 0.8, ease: "expo.out" })
              .to(
                pos,
                { x: center.x + width * 0.2, y: center.y + 40, duration: 2, ease: "sine.inOut" },
                "<0.2"
              )
              .to(pos, { r: 0, duration: 0.7, ease: "power3.inOut" }, "-=0.6");

            const follow = () => {
              const box = section.getBoundingClientRect();
              setX(client.x - box.left);
              setY(client.y - box.top);
            };

            const grow = (next: number) => {
              if (next === radius) return;
              radius = next;
              gsap.to(pos, {
                r: next,
                duration: next ? 0.8 : 0.5,
                ease: next ? "expo.out" : "power3.out",
                overwrite: "auto",
              });
            };

            const onMove = (event: PointerEvent) => {
              peek.kill();
              client.x = event.clientX;
              client.y = event.clientY;

              // On entry, jump to the pointer so the lens opens where it is.
              if (!inside) {
                inside = true;
                const box = section.getBoundingClientRect();
                gsap.set(pos, { x: client.x - box.left, y: client.y - box.top });
              }
              follow();

              // Over a button or link the lens closes, so the control stays readable.
              const overControl = (event.target as Element).closest("a, button") !== null;
              grow(overControl ? 0 : hoverRadius());
            };

            const onLeave = () => {
              inside = false;
              grow(0);
            };

            // Scrolling moves the hero under a still pointer.
            const onScroll = () => {
              if (inside) follow();
            };

            section.addEventListener("pointermove", onMove);
            section.addEventListener("pointerleave", onLeave);
            window.addEventListener("scroll", onScroll, { passive: true });

            return () => {
              peek.kill();
              section.removeEventListener("pointermove", onMove);
              section.removeEventListener("pointerleave", onLeave);
              window.removeEventListener("scroll", onScroll);
            };
          };

          /* ---------- Interaction: touch ---------- */

          // Without a pointer the lens wanders across the headline on its own.
          const startAuto = () => {
            const width = section.clientWidth;
            const height = section.clientHeight;
            const center = headlineCenter();

            const tweens = [
              gsap.fromTo(
                pos,
                { x: width * 0.2 },
                { x: width * 0.8, duration: 4.5, ease: "sine.inOut", repeat: -1, yoyo: true }
              ),
              gsap.fromTo(
                pos,
                { y: center.y - height * 0.18 },
                { y: center.y + height * 0.18, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true }
              ),
              gsap.to(pos, {
                r: Math.min(width, height) * 0.22,
                duration: 1.2,
                ease: "expo.out",
              }),
            ];

            return () => tweens.forEach((tween) => tween.kill());
          };

          let stopInteraction: (() => void) | null = null;

          const startInteraction = () => {
            if (fine) {
              stopInteraction = startFine();
              return;
            }
            stopInteraction = startAuto();
            onResize = () => {
              stopInteraction?.();
              stopInteraction = startAuto();
            };
          };

          /* ---------- Intro ---------- */

          let seen = false;
          try {
            seen = sessionStorage.getItem(INTRO_KEY) === "1";
          } catch {
            // Storage can be blocked. The full intro just plays again.
          }

          // Start state: words sit below their masks, footer is hidden.
          gsap.set(words, { yPercent: 115, autoAlpha: 1 });
          gsap.set(foot, { autoAlpha: 0 });

          const intro = gsap.timeline({
            onComplete: () => {
              try {
                sessionStorage.setItem(INTRO_KEY, "1");
              } catch {
                // Ignore blocked storage.
              }
              startInteraction();
            },
          });

          if (seen) {
            // Returning visitor: just the words and the footer.
            intro
              .to(words, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.07 }, 0)
              .to(foot, { autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 0.4);
          } else {
            // First visit: the blueprint opens, then closes onto the finished design.
            const center = headlineCenter();
            gsap.set(pos, { x: center.x, y: center.y, r: 0 });

            intro
              .to(pos, { r: introRadius(), duration: 0.9, ease: "expo.out" }, 0)
              .to(pos, { r: 0, duration: 1.4, ease: "power4.inOut" }, 1.0)
              .to(words, { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.09 }, 1.15)
              .to(foot, { autoAlpha: 1, duration: 0.8, ease: "power2.out", stagger: 0.1 }, 2.0);
          }

          /* ---------- Scroll: the two blocks drift apart ---------- */

          const scrub = {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          };
          gsap.to(blockA, { xPercent: -10, ease: "none", scrollTrigger: scrub });
          gsap.to(blockB, { xPercent: 10, ease: "none", scrollTrigger: scrub });

          /* ---------- Cleanup ---------- */

          return () => {
            intro.kill();
            stopInteraction?.();
            gsap.ticker.remove(render);
            resizeObserver.disconnect();
            lens.style.clipPath = HIDDEN_LENS;
          };
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative isolate h-svh min-h-155 w-full overflow-hidden bg-olive-950 text-amber-50"
    >
      {/* Without JavaScript the reveal never runs, so show everything. */}
      <noscript>
        <style>{".hero-reveal{visibility:visible!important}"}</style>
      </noscript>

      {/* Layer 1: the finished design */}
      <div className="hero-design absolute inset-0 z-10">
        <HeroHeadline mode="design" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-8 px-6 pb-8 md:flex-row md:items-end md:justify-between md:px-14 md:pb-10">
          <div className="flex max-w-md flex-col gap-6">
            <p className="hero-foot hero-reveal invisible text-lg leading-relaxed text-amber-50/70">
              {HERO.support}
            </p>
            <div className="hero-foot hero-reveal invisible flex flex-wrap gap-3">
              <Button href={HERO.primaryCta.href} variant="amber" icon="↗">
                {HERO.primaryCta.label}
              </Button>
              <Button href={HERO.secondaryCta.href} variant="outline">
                {HERO.secondaryCta.label}
              </Button>
            </div>
          </div>

          {/* Only shown where a mouse can use it. */}
          <p className="hero-foot hero-reveal invisible hidden max-w-[16rem] text-sm text-amber-50/45 [@media(hover:hover)]:block">
            {HERO.hint}
          </p>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-0" style={GRAIN_STYLE} />
      </div>

      {/* Layer 2: the build view, shown only through the lens */}
      <div
        ref={lensRef}
        aria-hidden
        className={`${heroMono.className} pointer-events-none absolute inset-0 z-20 bg-amber-50 text-olive-950`}
        style={{ clipPath: HIDDEN_LENS }}
      >
        <div className="absolute inset-0" style={GRID_STYLE} />

        <HeroHeadline mode="build" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-14 md:pb-10">
          <p className="whitespace-pre text-[13px] leading-6">{HERO.buildNotes.join("\n")}</p>
        </div>

        {/* Crosshair with live coordinates, centered on the lens. */}
        <div ref={crosshairRef} className="absolute left-0 top-0 will-change-transform">
          <span className="absolute -left-3 top-0 h-px w-6 bg-current" />
          <span className="absolute -top-3 left-0 h-6 w-px bg-current" />
          <span
            ref={coordsRef}
            className="absolute left-3 top-3 whitespace-nowrap text-[11px] leading-none"
          />
        </div>
      </div>
    </section>
  );
}