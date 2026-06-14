import { cn } from "@/lib/utils";

export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-sand to-cream text-clay/70",
        className,
      )}
      aria-hidden="true"
    >
      <span className="font-heading text-4xl">अ</span>
    </div>
  );
}
