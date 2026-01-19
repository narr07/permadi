import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const commonSchema = z.object({
  title: z.string(),
  description: z.string(),
})

export default defineContentConfig({
  collections: {
    // English content collection
    content_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/**',
        prefix: '',
      },
      schema: commonSchema,
    }),
    // French content collection
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
