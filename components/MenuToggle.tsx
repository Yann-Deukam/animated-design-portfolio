import Button from "./Button";

type MenuToggleProps = {
  open: boolean;
  onToggle: () => void;
  controls: string;
};

export default function MenuToggle({ open, onToggle, controls }: MenuToggleProps) {
  const line =
    "absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-[top,rotate] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]";

  return (
    <Button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? "Close menu" : "Open menu"}
      variant="plain"
      rolling={false}
      className="relative -mr-1 grid size-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current md:hidden"
    >
      <span aria-hidden className="relative block h-2 w-6">
        <span className={`${line} ${open ? "top-[3.25px] rotate-45" : "top-0"}`} />
        <span
          className={`${line} ${open ? "top-[3.25px] -rotate-45" : "top-[6.5px]"}`}
        />
      </span>
    </Button>
  );
}