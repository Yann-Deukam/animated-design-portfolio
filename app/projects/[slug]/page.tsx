import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Button from "@/components/Button";
import ProjectHeading from "@/components/ProjectHeading";
import { projects } from "@/constantts/projectData";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) return { title: "Project not found | G-ni Studio" };

  return {
    title: `${project.title} | G-ni Studio`,
    description: project.description,
  };
}

async function ProjectContent({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-7xl">
      <Button href="/#work" variant="outline" className="mb-12">
        Back to all work
      </Button>

      <div className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-portfolio-brown">
        <span>{project.category}</span>
        <span aria-hidden="true">·</span>
        <span>{project.year}</span>
      </div>

      <ProjectHeading
        as="h1"
        className="mb-8 max-w-5xl text-5xl font-medium tracking-[-0.045em] md:text-7xl"
      >
        {project.title}
      </ProjectHeading>

      <p className="mb-14 max-w-2xl text-lg leading-relaxed text-amber-50/75 md:text-xl">
        {project.description}
      </p>

      <div className="relative aspect-4/3 overflow-hidden rounded-[18px] bg-portfolio-dark md:aspect-16/8">
        <Image
          src={project.src}
          alt={project.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 90vw"
          className="object-cover"
        />
      </div>

      <div className="mt-16 flex flex-col items-start justify-between gap-8 border-t border-amber-50/15 pt-10 md:flex-row md:items-center">
        <p className="max-w-xl text-lg leading-relaxed text-amber-50/75">
          Interested in a project like this? Let&apos;s talk about what we can
          make together.
        </p>
        <Button href="/#contact" icon="↗">
          Start a project
        </Button>
      </div>
    </article>
  );
}

function ProjectSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto max-w-7xl">
      {/* Optional: match the real layout's heights to avoid layout shift */}
    </div>
  );
}

export default function ProjectPage(props: ProjectPageProps) {
  return (
    <main className="min-h-screen bg-olive-950 px-6 pb-24 pt-32 text-amber-50 md:px-14 md:pt-40">
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent {...props} />
      </Suspense>
    </main>
  );
}