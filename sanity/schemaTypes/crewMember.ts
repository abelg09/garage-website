import { defineField, defineType } from "sanity";

export const crewMember = defineType({
  name: "crewMember",
  title: "Crew Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "orderRank",
      title: "Display Order",
      type: "number",
      initialValue: 100
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required()
        })
      ]
    }),
    defineField({
      name: "bio",
      title: "Biography Paragraphs",
      type: "array",
      of: [{ type: "text" }],
      validation: (rule) => rule.required().min(1)
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "portrait"
    }
  }
});
