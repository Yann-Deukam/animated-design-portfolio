import type { ReactNode } from "react";

/**
 * Text that rolls up and is replaced by a copy on hover.
 * The parent must have the `group/roll` class.
 */
export default function RollingText({ children }: { children: ReactNode }) {
  const motion =
    "transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]";

  return (
    <span className="relative inline-block overflow-hidden align-top leading-[1.3]">
      <span
        className={`block ${motion} group-hover/roll:-translate-y-full group-focus-visible/roll:-translate-y-full`}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 block translate-y-full ${motion} group-hover/roll:translate-y-0 group-focus-visible/roll:translate-y-0`}
      >
        {children}
      </span>
    </span>
  );
}