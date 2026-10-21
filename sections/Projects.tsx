"use client"

import { ProjectCard } from "@/components/ProjectCard"
import { projects } from "@/constantts/projectData"
import { useEffect, useRef } from "react"

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.08 }
    )

    const cards = sectionRef.current?.querySelectorAll('.fade-in')
    cards?.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="work"
      className="py-28 md:py-40 px-8 bg-olive-950"
      ref={sectionRef}
      aria-labelledby="work-heading"
    >
      <div className="max-w-350 mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <div className="section-label mb-4">
              <span className="text-portfolio-brown text-[12px] tracking-[0.18em] uppercase font-medium">
                Selected Work
              </span>
            </div>
            <h2
              id="work-heading"
              className="text-[38px] md:text-[52px] text-portfolio-cream tracking-[-2px] leading-none"
            >
              Projects
            </h2>
          </div>
          <span className="text-portfolio-brown text-[13px] pb-2">
            {projects.length} selected
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}