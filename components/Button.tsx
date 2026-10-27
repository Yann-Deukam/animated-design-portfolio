import type { ComponentProps, ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import SectionLink from "./SectionLink";
import RollingText from "./RollingText";

type CommonProps = {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconClassName?: string;
  rolling?: boolean;
  variant?: "amber" | "white" | "outline" | "navbar" | "plain" | "dark";
};

type LinkButtonProps = CommonProps &
  Omit<ComponentProps<typeof Link>, "children" | "className" | "type">;

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: never;
  };

type ButtonProps = LinkButtonProps | NativeButtonProps;

const variantClasses: Record<NonNullable<CommonProps["variant"]>, string> = {
  amber:
    "group/roll inline-flex items-center justify-center gap-2 rounded-full bg-amber-50 px-6 py-3 text-[15px] font-medium tracking-[-0.01em] text-olive-950 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-50 active:scale-95",
  white:
    "group/roll inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-medium tracking-[-0.01em] text-neutral-950 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95",
  outline:
    "group/roll inline-flex items-center gap-2 rounded-full border border-amber-50 px-4 py-2 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
  navbar:
    "navbar-cta bg-amber-50 group/roll hidden items-center rounded-full px-5 py-2.5 text-[15px] font-medium tracking-[-0.01em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current active:scale-95 md:inline-flex",
  plain: "group/roll inline-flex items-center",
  dark:
    "group/roll inline-flex items-center justify-center gap-2 rounded-full bg-olive-950 px-6 py-3 text-[15px] font-medium tracking-[-0.01em] text-amber-50 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-50 active:scale-95",
};

export default function Button(props: ButtonProps) {
  if ("href" in props && props.href !== undefined) {
    const {
      href,
      children,
      className = "",
      icon,
      iconClassName = "",
      rolling = true,
      variant = "amber",
      ...linkProps
    } = props;
    const content = rolling ? <RollingText>{children}</RollingText> : children;

    const linkClassName = `${variantClasses[variant]} ${className}`.trim();
    const linkContent = (
      <>
        {content}
        {icon && (
          <span aria-hidden="true" className={iconClassName}>
            {icon}
          </span>
        )}
      </>
    );
    const LinkComponent =
      typeof href === "string" && href.includes("#") ? SectionLink : Link;

    return (
      <LinkComponent href={href} {...linkProps} className={linkClassName}>
        {linkContent}
      </LinkComponent>
    );
  }

  const {
    children,
    className = "",
    icon,
    iconClassName = "",
    rolling = true,
    variant = "amber",
    type = "button",
    ...buttonProps
  } = props;
  const content = rolling ? <RollingText>{children}</RollingText> : children;

  return (
    <button
      {...buttonProps}
      type={type}
      className={`${variantClasses[variant]} ${className}`.trim()}
    >
      {content}
      {icon && (
        <span aria-hidden="true" className={iconClassName}>
          {icon}
        </span>
      )}
    </button>
  );
}
