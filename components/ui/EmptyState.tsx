import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border-strong bg-ivory px-4 py-10 text-center sm:px-6 sm:py-16">
      <h3 className="font-heading text-xl text-charcoal sm:text-2xl">{title}</h3>
      {description ? (
        <p className="mx-auto mt-3 max-w-md text-brown leading-relaxed">{description}</p>
      ) : null}
      {children ? <div className="mt-4 flex justify-center sm:mt-6">{children}</div> : null}
    </div>
  );
}
