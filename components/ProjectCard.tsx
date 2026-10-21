"use client";

import { useEffect, useRef, useState } from "react";
import { Project } from "@/constantts/projectData";
import Image from "next/image";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Reveal the card once it scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-[18px] bg-portfolio-dark
        transition-all duration-700 ease-out motion-reduce:transition-none
        aspect-4/5 md:aspect-4/3
        ${project.wide ? "md:col-span-2 md:aspect-16/7" : ""}
        ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      // Stagger by column (0 or 1) so cards entering together animate one by one,
      // without later cards waiting a long time
      style={{ transitionDelay: visible ? `${(index % 2) * 120}ms` : "0ms" }}
      data-cursor
    >
      {/* Image: zooms slightly on desktop hover only */}
      <Image
        src={project.src}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-105"
        sizes={project.wide ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
      />

      {/* Shallow black overlay behind the title: always on for mobile, hover-only on desktop */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100" />

      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        {/* Top: category + year (always visible) */}
        <div className="flex items-start justify-between">
          <span className="rounded-full border border-portfolio-cream/25 bg-portfolio-black/20 px-3 py-1.5 text-[11px] font-medium tracking-wide text-portfolio-cream backdrop-blur-sm">
            {project.category}
          </span>
          <span className="text-[12px] font-medium text-portfolio-brown">
            {project.year}
          </span>
        </div>

        {/* Bottom: title + link. Visible on mobile, revealed on hover on desktop */}
        <div className="transition-all duration-500 ease-out md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <h3 className="mb-2 text-[20px] font-semibold leading-tight tracking-[-0.5px] text-portfolio-cream md:text-[24px]">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-[13px] font-medium text-portfolio-brown">
            <span>View Project</span>
            <span className="inline-block transition-transform duration-300 md:group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}