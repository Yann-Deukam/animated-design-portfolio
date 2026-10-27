import type { CSSProperties } from "react";
import { HERO } from "@/constantts/heroData";
import { heroDisplay, heroMono } from "@/constantts/fonts";

/**
 * Headline size. It is limited by width on narrow screens and by height on
 * short ones, so four rows always fit above the footer.
 */
const HEADLINE_STYLE: CSSProperties = {
  fontSize: "clamp(3rem, min(15vw, 16svh), 11rem)",
  lineHeight: 0.92,
  letterSpacing: "-0.025em",
  fontWeight: 350,
  fontVariationSettings: '"SOFT" 40',
};

type HeroHeadlineProps = {
  /** "design" is the real, accessible headline. "build" is its blueprint twin. */
  mode: "design" | "build";
};

/**
 * Both layers render this same markup with the same classes, so every letter
 * lands on the same pixel. Only the paint changes: solid in the design layer,
 * outlined (with measurement tags) in the build layer.
 */
export default function HeroHeadline({ mode }: HeroHeadlineProps) {
  const build = mode === "build";
  const Tag = build ? "div" : "h1";

  return (
    <div className="absolute inset-x-0 top-[45%] -translate-y-1/2 px-6 md:px-14">
      <Tag
        className={`${heroDisplay.className} flex flex-col gap-[0.08em] ${
          build
            ? "[-webkit-text-fill-color:transparent] [-webkit-text-stroke:1.5px_currentColor]"
            : "text-amber-50"
        }`}
        style={HEADLINE_STYLE}
      >
        {HERO.blocks.map((rows, blockIndex) => (
          <span
            key={blockIndex}
            className={`hero-block-${blockIndex} relative block w-fit ${
              blockIndex % 2 === 1 ? "self-end text-right" : "self-start"
            } ${
              build
                ? "outline outline-dashed outline-portfolio-brown/70 outline-offset-[0.1em]"
                : ""
            }`}
          >
            {rows.map((row) => (
              <span key={row} className="block whitespace-nowrap">
                {row.split(" ").map((word, wordIndex, words) => (
                  <span key={`${word}-${wordIndex}`}>
                    {/* Each word sits in its own mask, so it can rise into view. */}
                    <span className="my-[-0.1em] inline-block overflow-hidden py-[0.1em] align-top">
                      <span
                        className={
                          build
                            ? "inline-block"
                            : "hero-word hero-reveal invisible inline-block"
                        }
                      >
                        {word}
                      </span>
                    </span>
                    {wordIndex < words.length - 1 ? " " : null}
                  </span>
                ))}
              </span>
            ))}

            {/* Width and height of the block, measured live by Hero.tsx. */}
            {build && (
              <span
                data-dim
                className={`${heroMono.className} absolute bottom-full left-0 mb-5 whitespace-nowrap text-[11px] font-normal leading-none tracking-normal text-portfolio-brown [-webkit-text-fill-color:currentColor] [-webkit-text-stroke:0]`}
              />
            )}
          </span>
        ))}
      </Tag>
    </div>
  );
}