"use client";

import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function SpecialProgramsReveal({ children }: { children: ReactNode }) {
  const [showSpecial, setShowSpecial] = useState(false);

  return (
    <div className="mt-14 border-t border-border pt-12">
      <div className="flex justify-center">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowSpecial((open) => !open)}
          aria-expanded={showSpecial}
        >
          {showSpecial ? "Hide special programs" : "View special programs"}
          <span
            aria-hidden="true"
            className={cn(
              "text-xs transition-transform duration-300 ease-calm",
              showSpecial && "rotate-180",
            )}
          >
            ▼
          </span>
        </Button>
      </div>

      {showSpecial ? <div className="mt-10">{children}</div> : null}
    </div>
  );
}
