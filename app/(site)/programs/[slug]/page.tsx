import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";

import { EventCard } from "@/components/cards/EventCard";
import { CMSRichText } from "@/components/content/CMSRichText";
import { YouTubeEmbed } from "@/components/content/YouTubeEmbed";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { LocalProgramImage } from "@/components/ui/LocalProgramImage";
import { LocalProgramSymbol } from "@/components/ui/LocalProgramSymbol";
import { Ornament } from "@/components/ui/Ornament";
import { buildMetadata } from "@/lib/seo";
import { getYouTubeVideoId } from "@/lib/youtube";
import {
  getProgramBySlug,
  getProgramSlugs,
  getSiteSettings,
  getUpcomingEventsByProgram,
} from "@/sanity/lib/fetch";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function ProgramSection({
  title,
  children,
  first = false,
}: {
  title: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <div className={first ? undefined : "mt-12 border-t border-border pt-10"}>
      <h2 className="font-heading text-2xl text-charcoal">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function hasRichText(value?: PortableTextBlock[]) {
  return Boolean(value && value.length > 0);
}

export async function generateStaticParams() {
  const slugs = await getProgramSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return buildMetadata({ title: "Program", path: `/programs/${slug}` });
  return buildMetadata({
    title: program.title,
    description: program.shortIntro,
    seo: program.seo,
    path: `/programs/${program.slug}`,
  });
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) notFound();

  const [settings, relatedEvents] = await Promise.all([
    getSiteSettings(),
    getUpcomingEventsByProgram(program.slug),
  ]);

  const videoId = program.videoUrl ? getYouTubeVideoId(program.videoUrl) : null;

  return (
    <>
      <section className="bg-ivory pt-32 pb-section-sm sm:pt-40 border-b border-border">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Link
              href="/programs"
              className="mb-6 inline-flex text-sm font-medium text-brown transition-colors hover:text-saffron"
            >
              &larr; All programs
            </Link>
            <LocalProgramSymbol slug={program.slug} />
            <h1 className="text-display text-balance">{program.title}</h1>
            {program.shortIntro ? (
              <p className="hero-subtitle mt-6">{program.shortIntro}</p>
            ) : null}
          </div>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div>
              {hasRichText(program.whatIs) ? (
                <ProgramSection title={`What is ${program.title}?`} first>
                  <CMSRichText value={program.whatIs} />
                </ProgramSection>
              ) : null}

              {hasRichText(program.aboutThePractice) ? (
                <ProgramSection
                  title="About the Practice"
                  first={!hasRichText(program.whatIs)}
                >
                  <CMSRichText value={program.aboutThePractice} />
                </ProgramSection>
              ) : null}

              {program.benefits && program.benefits.length > 0 ? (
                <ProgramSection
                  title="Benefits"
                  first={
                    !hasRichText(program.whatIs) && !hasRichText(program.aboutThePractice)
                  }
                >
                  <ul className="space-y-3">
                    {program.benefits.map((item, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed text-[#3a322a]">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </ProgramSection>
              ) : null}

              {hasRichText(program.practiceIndependently) ? (
                <ProgramSection
                  title="Practice Independently"
                  first={
                    !hasRichText(program.whatIs) &&
                    !hasRichText(program.aboutThePractice) &&
                    !(program.benefits && program.benefits.length > 0)
                  }
                >
                  <CMSRichText value={program.practiceIndependently} />
                </ProgramSection>
              ) : null}

              {hasRichText(program.privateAndGroupSessions) ? (
                <ProgramSection
                  title="Private and Group Sessions"
                  first={
                    !hasRichText(program.whatIs) &&
                    !hasRichText(program.aboutThePractice) &&
                    !(program.benefits && program.benefits.length > 0) &&
                    !hasRichText(program.practiceIndependently)
                  }
                >
                  <CMSRichText value={program.privateAndGroupSessions} />
                </ProgramSection>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="overflow-hidden rounded-xl border border-border bg-ivory shadow-soft">
                <div className="aspect-[4/5]">
                  <LocalProgramImage
                    slug={program.slug}
                    alt={program.title}
                    width={600}
                    height={750}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-sm leading-relaxed text-brown">
                    Interested in this practice? View upcoming sessions or get in touch to
                    register your interest.
                  </p>
                  <Button href="/events" className="w-full">
                    View upcoming events
                  </Button>
                  <Button href="/contact" variant="secondary" className="w-full">
                    Register interest
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {relatedEvents.length > 0 ? (
        <Section tone="ivory" className="border-t border-border">
          <Container>
            <div className="text-center">
              <p className="eyebrow mb-4">Upcoming</p>
              <h2 className="text-display-sm">Sessions for {program.title}</h2>
              <Ornament className="mt-7" width="w-16" />
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedEvents.slice(0, 3).map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  whatsappNumber={settings.whatsapp}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {videoId ? (
        <Section
          tone={relatedEvents.length > 0 ? "cream" : "ivory"}
          className="border-t border-border"
        >
          <Container>
            <div className="mx-auto max-w-4xl">
              <YouTubeEmbed videoId={videoId} title={`${program.title} video`} />
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
