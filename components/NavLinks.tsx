"use client";

import { isActive, NAV_LINKS } from "@/constantts/navConfig";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RollingText from "./RollingText";

export default function NavLinks({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <ul className={`items-center gap-1 ${className}`}>
      {NAV_LINKS.map((link) => {
        const active = isActive(pathname, link.href);

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`group/roll relative block rounded-full px-4 py-2 text-[15px] font-medium tracking-[-0.01em] transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${
                active ? "opacity-100" : "opacity-75"
              }`}
            >
              <RollingText>{link.label}</RollingText>
              <span
                aria-hidden
                className={`absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active ? "scale-100" : "scale-0"
                }`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}