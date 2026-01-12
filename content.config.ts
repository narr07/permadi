import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const commonSchema = z.object({})
const blogSchema = z.object({
  idBlog: z.number(),
  title: z.string(),
  description: z.string(),
  date: z.date(),
  tags: z.array(z.string()),
  image: z.string(),
  readingTime: z.number().optional(),
})
const projectSchema = z.object({
  title: z.string(),
  image: z.string(),
  category: z.string(),
  tools: z.array(z.string()),
  date: z.date(),
  link: z.string().optional(),
})
const gallerySchema = z.object({
  title: z.string(),
  image: z.string(),
  description: z.string(),
  category: z.string().optional(),
  date: z.date(),
  tools: z.array(z.string()),
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

    project_en: defineCollection({
      type: 'data',
      source: 'en/project/*.yml',
      schema: projectSchema,
    }),
    project_id: defineCollection({
      type: 'data',
      source: 'id/project/*.yml',
      schema: projectSchema,
    }),

    gallery_en: defineCollection({
      type: 'data',
      source: 'en/gallery/*.yml',
      schema: gallerySchema,
    }),
    gallery_id: defineCollection({
      type: 'data',
      source: 'id/gallery/*.yml',
      schema: gallerySchema,
    }),
  },
})
