import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/**',
        prefix: '',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        image: z.string(),
        date: z.string().date(),
      }),
    }),
    content_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/**',
        prefix: '',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        image: z.string(),
        date: z.string().date(),
      }),
    }),
    blog_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/blog/**',
        prefix: '',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        image: z.string(),
        date: z.string().date(),
      }),
    }),
    blog_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/blog/**',
        prefix: '',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        image: z.string(),
        date: z.string().date(),
      }),
    }),
    project_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/project/**',
        prefix: '',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        image: z.string(),
        date: z.string().date(),
      }),
    }),
    project_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/project/**',
        prefix: '',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        image: z.string(),
        date: z.string().date(),
      }),
    }),
  },
})
