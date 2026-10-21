import { ABOUT_STORY } from "@/constantts/aboutData";
import Link from "next/link";

export default function AboutContent() {
  return (
    <div className="relative bg-olive-950 px-6 py-24 md:px-14 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-12 md:gap-8">
        <h3 className="text-[clamp(2.25rem,4.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.035em] md:sticky md:top-32 md:self-start md:col-span-5 text-amber-50">
          {ABOUT_STORY.heading}
        </h3>

        <div className="md:col-span-6 md:col-start-7">
          <div className="max-w-[60ch] space-y-5 text-lg leading-relaxed text-foreground/70">
            {ABOUT_STORY.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-16 divide-y divide-foreground/10 border-y border-foreground/10">
            {ABOUT_STORY.capabilities.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <span className="text-xl font-medium tracking-[-0.02em]">
                  {item.title}
                </span>
                <span className="text-[15px] text-foreground/60 sm:text-right">
                  {item.detail}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href={ABOUT_STORY.cta.href}
            className="mt-12 inline-flex items-center rounded-full bg-foreground px-6 py-3 text-[15px] font-medium tracking-[-0.01em] text-background transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground active:scale-95"
          >
            {ABOUT_STORY.cta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}