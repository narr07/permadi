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
  },
})