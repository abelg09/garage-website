import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "introKicker",
      title: "Intro Kicker",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "introTitle",
      title: "Intro Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "introBody",
      title: "Intro Body Paragraphs",
      type: "array",
      of: [{ type: "text" }],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "heroCollage",
      title: "Hero Garage Collage",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required()
        })
      ],
      validation: (rule) => rule.required()
    })
  ]
});
