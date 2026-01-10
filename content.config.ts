import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const commonSchema = z.object({})
const blogSchema = z.object({
  idBlog: z.number(),
  title: z.string(),
  description: z.string(),
  date: z.date(),
  tags: z.array(z.string()),
})
export default defineContentConfig({
  collections: {
    // English content collection
    content_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/**',
        prefix: '',
      },
      schema: commonSchema,
    }),
    // Indonesian content collection
    content_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/**',
        prefix: '',
      },
      schema: commonSchema,
    }),

    blog_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/blog/*.md',
        prefix: '',
      },
      schema: blogSchema,
    }),
    blog_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/blog/*.md',
        prefix: '',
      },
      schema: blogSchema,
    }),
  },
})
