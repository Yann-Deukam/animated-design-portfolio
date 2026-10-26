"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { ExpoScaleEase } from "gsap/EasePack";
import { useGSAP } from "@gsap/react";
import {
  ABOUT_STATEMENT,
  ABOUT_TILES,
  FOCUS_ROW_SPAN,
  GRID_ROWS,
  TILE_GAP,
} from "@/constantts/aboutData"
import Button from "./Button";

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip, ExpoScaleEase);

// The gap between tiles, and the row height that makes the focus tile fill the screen when zoomed.
const GRID_VARS = {
  "--tile-gap": TILE_GAP,
  "--rows": String(GRID_ROWS),
  "--final-row": `calc((100svh - ${FOCUS_ROW_SPAN - 1} * var(--tile-gap)) / ${FOCUS_ROW_SPAN})`,
} as CSSProperties;

export default function AboutGallery() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrapEl = wrapRef.current;
      const gridEl = gridRef.current;
      const overlayEl = overlayRef.current;
      if (!wrapEl || !gridEl || !overlayEl) return;

      let ctx: ReturnType<typeof gsap.context> | undefined;

      /**
       * With the grid in its zoomed layout, shift it so the focus tile sits in the
       * middle of the screen. Works for any focus tile, not only a centered one.
       */
      const centerOnFocus = () => {
        const focusEl = gridEl.querySelector<HTMLElement>("[data-focus]");
        if (!focusEl) return;

        const wrapBox = wrapEl.getBoundingClientRect();
        const box = focusEl.getBoundingClientRect();

        gsap.set(gridEl, {
          x: wrapBox.left + wrapBox.width / 2 - (box.left + box.width / 2),
          y: wrapBox.top + wrapBox.height / 2 - (box.top + box.height / 2),
        });
      };

      /** Calls `callback` after real resizes. Mobile address bars only change the height a little. */
      const watchResize = (callback: () => void) => {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let timer: number;

        const onResize = () => {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            if (w === width && Math.abs(h - height) < 150) return;
            width = w;
            height = h;
            callback();
          }, 200);
        };

        window.addEventListener("resize", onResize);
        return () => {
          window.clearTimeout(timer);
          window.removeEventListener("resize", onResize);
        };
      };

      /**
       * Flip needs pixel values for the start and end layouts, so everything is
       * measured here and rebuilt whenever the viewport changes.
       */
      const build = () => {
        ctx?.revert();

        ctx = gsap.context(() => {
          const tiles = gsap.utils.toArray<HTMLElement>(".about-tile");

          // Capture the end state: the grid zoomed until the focus tile fills the screen.
          gridEl.setAttribute("data-final", "true");
          centerOnFocus();
          const endState = Flip.getState(tiles);
          gsap.set(gridEl, { x: 0, y: 0 });
          gridEl.removeAttribute("data-final");

          gsap.set(overlayEl, { opacity: 1 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: wrapEl,
              start: "top top",
              end: "+=150%",
              scrub: true,
              pin: true,
              anticipatePin: 1,
            },
          });

          tl
            // 1. The grid zooms into the focus tile
            .add(
              Flip.to(endState, {
                simple: true,
                duration: 1,
                ease: "expoScale(1, 5)",
              }),
              0
            )
            // 2. The focus image settles as it fills the screen
            .fromTo(".about-focus-img", { scale: 1.2 }, { scale: 1, duration: 1 }, 0)
            // 3. A scrim rises, then the statement writes itself in
            .fromTo(".about-scrim", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.6)
            .fromTo(
              ".about-line",
              { yPercent: 110 },
              { yPercent: 0, duration: 0.3, stagger: 0.08, ease: "power3.out" },
              0.7
            )
            .fromTo(
              ".about-fade",
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, ease: "power2.out" },
              0.95
            )
            // 4. Hold, so the text can be read before the pin releases
            .to({}, { duration: 0.25 });

          // Keeps other ScrollTriggers (like the navbar's) in sync with the new pin spacing.
          ScrollTrigger.refresh();

          return () => {
            gsap.set(tiles, { clearProps: "all" });
          };
        }, wrapEl);
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          // Reduced motion: skip the scroll animation and show the final frame.
          if (reduce) {
            const showFinalFrame = () => {
              gsap.set(gridEl, { x: 0, y: 0 });
              gridEl.setAttribute("data-final", "true");
              centerOnFocus();
              gsap.set(overlayEl, { opacity: 1 });
            };

            showFinalFrame();
            const stopWatching = watchResize(showFinalFrame);

            return () => {
              stopWatching();
              gridEl.removeAttribute("data-final");
              gsap.set(gridEl, { clearProps: "transform" });
              gsap.set(overlayEl, { clearProps: "opacity" });
            };
          }

          build();
          const stopWatching = watchResize(build);

          return () => {
            stopWatching();
            ctx?.revert();
          };
        }
      );

      return () => mm.revert();
    },
    { scope: wrapRef }
  );

  return (
    <div
      ref={wrapRef}
      className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-[#0e100f]"
    >
      {/* Bento grid. `data-final` is toggled by GSAP to measure the zoomed state. */}
      <div
        ref={gridRef}
        style={GRID_VARS}
        className="relative grid h-full w-full flex-none grid-cols-3 grid-rows-[repeat(var(--rows),minmax(0,1fr))] content-center justify-center gap-(--tile-gap) data-[final=true]:grid-cols-[repeat(3,100vw)] data-[final=true]:grid-rows-[repeat(var(--rows),var(--final-row))]"
      >
        {ABOUT_TILES.map((tile) => (
          <div
            key={tile.id}
            data-focus={tile.focus ? "" : undefined}
            className={`about-tile relative min-h-0 min-w-0 flex-none overflow-hidden ${tile.place} ${tile.tone}`}
          >
            {tile.src && (
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="100vw"
                quality={85}
                // Remote demo images skip the Next.js optimizer, so no config is needed.
                unoptimized={tile.src.startsWith("http")}
                className={`object-cover ${tile.focus ? "about-focus-img" : ""}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* The twist: the About statement, written over the focus tile once the zoom lands. */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end gap-8 p-6 pb-10 opacity-0 md:flex-row md:items-end md:justify-between md:p-14"
      >
        <div
          aria-hidden
          className="about-scrim absolute inset-0 bg-linear-to-t from-olive-950/80 via-olive-900/30 to-transparent"
        />

        <h2
          id="about-heading"
          className="relative text-[clamp(2.75rem,8vw,7.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-amber-50"
        >
          {ABOUT_STATEMENT.lines.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <span className="about-line block">{line}</span>
            </span>
          ))}
        </h2>

        <div className="relative flex max-w-sm flex-col items-start gap-6 text-white">
          <p className="about-fade text-lg leading-relaxed text-white/80">
            {ABOUT_STATEMENT.support}
          </p>
          <Button
            href={ABOUT_STATEMENT.cta.href}
            variant="amber"
            className="about-fade pointer-events-auto"
          >
            {ABOUT_STATEMENT.cta.label}
          </Button>
        </div>
      </div>
    </div>
  );
}