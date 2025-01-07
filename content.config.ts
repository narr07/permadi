import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const commonSchema = z.object({})

export default defineContentConfig({
  collections: {
    content_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/**',
        prefix: '',
      },
      schema: commonSchema,
    }),
    content_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/**',
        prefix: '',
      },
      schema: commonSchema,
    }),
    blog_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/blog/**',
        prefix: '',
      },
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        date: z.date(),
      }),
    }),
    blog_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/blog/**',
        prefix: '',
      },
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        date: z.date(),
      }),
    }),
    project_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/project/**',
        prefix: '',
      },
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        date: z.date(),
      }),
    }),
    project_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/project/**',
        prefix: '',
      },
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        date: z.date(),
      }),
    }),

  },
})
