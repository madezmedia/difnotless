import { defineField, defineType } from "sanity"

export default defineType({
  name: "educationalResource",
  title: "Educational Resources",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "AAC", value: "aac" },
          { title: "Autism", value: "autism" },
          { title: "Sensory", value: "sensory" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "resourceType",
      title: "Resource Type",
      type: "string",
      options: {
        list: [
          { title: "Guide", value: "Guide" },
          { title: "Tutorial", value: "Tutorial" },
          { title: "Research", value: "Research" },
          { title: "Infographic", value: "Infographic" },
          { title: "Video", value: "Video" },
          { title: "Worksheet", value: "Worksheet" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                title: "URL",
                name: "link",
                type: "object",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
          ],
        },
        {
          type: "file",
          name: "downloadableFile",
          title: "Downloadable File",
          fields: [
            {
              name: "description",
              type: "string",
              title: "Description",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured Resource",
      type: "boolean",
      description: "Mark this resource as featured",
      initialValue: false,
    }),
    defineField({
      name: "relatedResources",
      title: "Related Resources",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "educationalResource" }],
        },
      ],
    }),
    defineField({
      name: "downloadableFiles",
      title: "Downloadable Files",
      type: "array",
      of: [
        {
          type: "file",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
            },
            {
              name: "description",
              type: "string",
              title: "Description",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "externalLinks",
      title: "External Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
            },
            {
              name: "url",
              type: "url",
              title: "URL",
            },
            {
              name: "description",
              type: "string",
              title: "Description",
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "featuredImage",
    },
    prepare(selection) {
      const { category } = selection
      return { ...selection, subtitle: category && `Category: ${category}` }
    },
  },
})

