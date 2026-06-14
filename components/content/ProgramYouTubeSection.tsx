interface ProgramWatchButtonProps {
  href: string;
  label?: string;
  ariaLabel?: string;
}

function PlayCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-3.5 w-3.5 fill-current"
    >
      <path d="M8 5.14v13.72L19 12 8 5.14z" />
    </svg>
  );
}

export function ProgramWatchButton({
  href,
  label = "Watch",
  ariaLabel,
}: ProgramWatchButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ?? label}
      className="flex h-14 w-full items-center justify-center gap-2 border-b border-border bg-cream/50 px-6 text-sm font-medium text-brown transition-colors hover:bg-sand/60 hover:text-charcoal"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-saffron/10 text-saffron">
        <PlayCircleIcon />
      </span>
      {label}
    </a>
  );
}
