import type { ReactNode } from "react";

type ProjectHeadingProps = {
  as: "h2" | "h3";
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  id?: string;
};

export default function ProjectHeading({
  as: Heading,
  children,
  className = "",
  eyebrow,
  id,
}: ProjectHeadingProps) {
  return (
    <>
      {eyebrow && (
        <div className="section-label mb-4">
          <span className="text-portfolio-brown text-[12px] font-medium tracking-[0.18em] uppercase">
            {eyebrow}
          </span>
        </div>
      )}
      <Heading id={id} className={`text-portfolio-cream ${className}`}>
        {children}
      </Heading>
    </>
  );
}
