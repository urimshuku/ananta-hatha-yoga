import { defineField, defineType } from "sanity";

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "The URL for this program's page (auto-generated from the title).",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      group: "content",
      description: "Turn off to hide this program from the website.",
      initialValue: true,
    }),
    defineField({
      name: "orderRank",
      title: "Order",
      type: "number",
      group: "content",
      description: "Lower numbers appear first. Leave blank to sort alphabetically.",
    }),
    defineField({
      name: "shortIntro",
      title: "Short intro",
      type: "text",
      rows: 3,
      group: "content",
      description: "A brief summary shown on cards and at the top of the page.",
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: "whatIs",
      title: "What is this practice?",
      type: "blockContent",
      group: "content",
      description:
        "Introductory overview for the “What is [program name]?” section on the page.",
    }),
    defineField({
      name: "aboutThePractice",
      title: "About the Practice",
      type: "blockContent",
      group: "content",
      description: "A deeper description of how the practice is taught and approached.",
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description:
        "Use careful language (e.g. 'may support', 'is designed to support').",
    }),
    defineField({
      name: "practiceIndependently",
      title: "Practice Independently",
      type: "blockContent",
      group: "content",
      description: "Guidance on learning and continuing the practice on one's own.",
    }),
    defineField({
      name: "privateAndGroupSessions",
      title: "Private and Group Sessions",
      type: "blockContent",
      group: "content",
      description: "How this practice is offered in group and private settings.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "orderRankAsc",
      by: [{ field: "orderRank", direction: "asc" }],
    },
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "shortIntro", published: "published" },
    prepare: ({ title, subtitle, published }) => ({
      title,
      subtitle: published ? subtitle : `(hidden) ${subtitle ?? ""}`,
    }),
  },
});
