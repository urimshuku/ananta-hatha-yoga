import { ProgramGrid } from "@/components/programs/ProgramGrid";
import { SpecialProgramsReveal } from "@/components/programs/SpecialProgramsReveal";
import type { ProgramListItem } from "@/sanity/lib/types";

export function ProgramsListing({
  mainPrograms,
  specialPrograms,
}: {
  mainPrograms: ProgramListItem[];
  specialPrograms: ProgramListItem[];
}) {
  return (
    <>
      <p className="eyebrow mb-8">Main programs</p>
      <ProgramGrid programs={mainPrograms} />

      {specialPrograms.length > 0 ? (
        <SpecialProgramsReveal>
          <div className="mb-8 text-center">
            <p className="eyebrow mb-3">Special programs</p>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-brown">
              Practices that support specific aspects of health and wellbeing.
            </p>
          </div>
          <ProgramGrid programs={specialPrograms} />
        </SpecialProgramsReveal>
      ) : null}
    </>
  );
}
