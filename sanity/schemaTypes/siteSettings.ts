import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email()
    }),
    defineField({
      name: "address",
      title: "Address Lines",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "wordmark",
      title: "GARAGE Wordmark",
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
    }),
    defineField({
      name: "contactCollage",
      title: "Contact Collage",
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
