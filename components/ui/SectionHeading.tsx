import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow mb-3 sm:mb-4">{eyebrow}</p> : null}
      <h2 className="text-display-sm text-balance">{title}</h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-brown sm:mt-5 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
