"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type SectionLinkProps = ComponentProps<typeof Link>;

export default function SectionLink({ href, onClick, ...props }: SectionLinkProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const hrefValue =
      typeof href === "string"
        ? href
        : `${href.pathname ?? ""}${href.search ?? ""}${href.hash ?? ""}`;
    const url = new URL(hrefValue, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== pathname || !url.hash) {
      return;
    }

    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <Link
      href={href}
      {...props}
      onClick={handleClick}
      scroll={false}
    />
  );
}
