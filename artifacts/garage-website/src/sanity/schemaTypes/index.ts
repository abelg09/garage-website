import { defineArrayMember, defineField, defineType } from "sanity";

const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

const cropSettings = defineType({
  name: "cropSettings",
  title: "Thumbnail crop",
  type: "object",
  fields: [
    defineField({
      name: "position",
      title: "Object position",
      type: "string",
      description: "CSS object-position value, for example 50% 30%.",
    }),
    defineField({
      name: "zoom",
      title: "Zoom",
      type: "number",
      description: "Optional CSS scale value, for example 1.2.",
      validation: (Rule) => Rule.min(1).max(3),
    }),
    defineField({
      name: "origin",
      title: "Zoom origin",
      type: "string",
      description: "CSS transform-origin value, for example 50% 30%.",
    }),
  ],
});

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site and Contact Settings",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Site title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "email", title: "Contact email", type: "email", validation: (Rule) => Rule.required() }),
    defineField({
      name: "address",
      title: "Address lines",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: "wordmark", title: "Wordmark", type: "imageWithAlt" }),
    defineField({ name: "contactCollage", title: "Contact fallback image", type: "imageWithAlt" }),
    defineField({ name: "emailLabel", title: "Email label", type: "string" }),
    defineField({ name: "addressLabel", title: "Address label", type: "string" }),
    defineField({ name: "formLabel", title: "Form label", type: "string" }),
    defineField({ name: "nameLabel", title: "Name field label", type: "string" }),
    defineField({ name: "emailFieldLabel", title: "Email field label", type: "string" }),
    defineField({ name: "messageLabel", title: "Message field label", type: "string" }),
    defineField({ name: "submitLabel", title: "Submit button label", type: "string" }),
    defineField({ name: "submittingLabel", title: "Submitting button label", type: "string" }),
    defineField({ name: "requiredMessage", title: "Required fields toast", type: "string" }),
    defineField({ name: "successMessage", title: "Success toast", type: "string" }),
    defineField({ name: "genericErrorMessage", title: "Generic error toast", type: "string" }),
    defineField({ name: "networkErrorMessage", title: "Network error toast", type: "string" }),
  ],
  preview: {
    prepare: () => ({ title: "Site and Contact Settings" }),
  },
});

const homePage = defineType({
  name: "homePage",
  title: "Home / About",
  type: "document",
  fields: [
    defineField({ name: "heroHeadline", title: "Hero headline", type: "string" }),
    defineField({
      name: "heroBody",
      title: "Hero body",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
    }),
    defineField({ name: "heroGarageClosed", title: "Closed garage artwork", type: "imageWithAlt" }),
    defineField({ name: "heroGarageOpen", title: "Open garage artwork", type: "imageWithAlt" }),
    defineField({ name: "heroBanana", title: "Banana scroll artwork", type: "imageWithAlt" }),
    defineField({ name: "introKicker", title: "Intro kicker", type: "string" }),
    defineField({ name: "introTitle", title: "Intro title", type: "string" }),
    defineField({
      name: "introBody",
      title: "Intro body",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
    }),
    defineField({ name: "garageFacade", title: "Garage facade image", type: "imageWithAlt" }),
    defineField({ name: "garageOrigin", title: "Startup garages image", type: "imageWithAlt" }),
    defineField({ name: "garageOriginLabel", title: "Startup garages label", type: "string" }),
    defineField({ name: "heroCollage", title: "Hero collage image", type: "imageWithAlt" }),
  ],
  preview: {
    prepare: () => ({ title: "Home / About" }),
  },
});

const project = defineType({
  name: "project",
  title: "Work Project",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "client", title: "Client", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 5 }),
    defineField({ name: "impact", title: "Impact", type: "text", rows: 4 }),
    defineField({ name: "cover", title: "Cover image", type: "imageWithAlt" }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
    defineField({ name: "orderRank", title: "Display order", type: "number", initialValue: 0 }),
    defineField({ name: "hidden", title: "Hide from website", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "title", subtitle: "client", media: "cover" },
  },
});

const client = defineType({
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "logo", title: "Logo", type: "imageWithAlt" }),
    defineField({ name: "orderRank", title: "Display order", type: "number", initialValue: 0 }),
    defineField({ name: "hidden", title: "Hide from website", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});

const crewMember = defineType({
  name: "crewMember",
  title: "Crew Member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "role", title: "Role", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "string",
      options: {
        list: [
          { title: "Leader", value: "leader" },
          { title: "Team", value: "team" },
        ],
        layout: "radio",
      },
      initialValue: "team",
    }),
    defineField({ name: "portrait", title: "Portrait", type: "imageWithAlt" }),
    defineField({ name: "crop", title: "Thumbnail crop", type: "cropSettings" }),
    defineField({
      name: "bio",
      title: "Bio paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
    }),
    defineField({ name: "orderRank", title: "Display order", type: "number", initialValue: 0 }),
    defineField({ name: "hidden", title: "Hide from website", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "portrait" },
  },
});

const crewMosaic = defineType({
  name: "crewMosaic",
  title: "Crew Mosaic",
  type: "document",
  fields: [
    defineField({
      name: "cells",
      title: "Grid cells",
      type: "array",
      of: [
        defineArrayMember({
          name: "crewMosaicCell",
          title: "Grid cell",
          type: "object",
          fields: [
            defineField({ name: "id", title: "Stable id", type: "string" }),
            defineField({
              name: "kind",
              title: "Cell type",
              type: "string",
              options: {
                list: [
                  { title: "Crew member", value: "crew" },
                  { title: "Office image", value: "office" },
                ],
                layout: "radio",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "member",
              title: "Crew member",
              type: "reference",
              to: [{ type: "crewMember" }],
              hidden: ({ parent }) => parent?.kind !== "crew",
            }),
            defineField({
              name: "image",
              title: "Office image",
              type: "imageWithAlt",
              hidden: ({ parent }) => parent?.kind !== "office",
            }),
            defineField({
              name: "split",
              title: "Split background section",
              type: "string",
              options: {
                list: [
                  { title: "None", value: "" },
                  { title: "Top half", value: "top" },
                  { title: "Bottom half", value: "bottom" },
                ],
              },
              hidden: ({ parent }) => parent?.kind !== "office",
            }),
            defineField({
              name: "crop",
              title: "Crop",
              type: "cropSettings",
              hidden: ({ parent }) => parent?.kind !== "office",
            }),
          ],
          preview: {
            select: { kind: "kind", member: "member.name", image: "image" },
            prepare: ({ kind, member, image }) => ({
              title: kind === "crew" ? member || "Crew member" : "Office image",
              subtitle: kind,
              media: image,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Crew Mosaic" }),
  },
});

const serviceSettings = defineType({
  name: "serviceSettings",
  title: "Services",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
    defineField({ name: "ctaHref", title: "CTA link", type: "string" }),
    defineField({
      name: "items",
      title: "Service cards",
      type: "array",
      of: [
        defineArrayMember({
          name: "serviceCard",
          title: "Service card",
          type: "object",
          fields: [
            defineField({ name: "id", title: "Stable id", type: "string" }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Target", value: "target" },
                  { title: "Film", value: "film" },
                  { title: "Share", value: "share" },
                  { title: "Camera", value: "camera" },
                  { title: "Monitor", value: "monitor" },
                ],
              },
            }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "title", subtitle: "icon" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Services" }),
  },
});

export const schemaTypes = [
  imageWithAlt,
  cropSettings,
  siteSettings,
  homePage,
  project,
  client,
  crewMember,
  crewMosaic,
  serviceSettings,
];
