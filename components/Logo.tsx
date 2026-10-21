import Link from "next/link";

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="G-ni Studio, home"
      className="group/logo inline-flex items-center gap-2.5 rounded-full py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="size-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:rotate-200"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="42 14.5"
          transform="rotate(-40 12 12)"
        />
        <circle cx="12" cy="12" r="2.6" fill="currentColor" />
      </svg>
      <span className="text-[17px] font-bold tracking-[-0.03em]">
        G-ni <span className="font-medium opacity-60">Studio</span>
      </span>
    </Link>
  );
}