import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const commonSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  image: z.string(),
  date: z.date(),

})

export default defineContentConfig({
  collections: {
    content_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/blog/*.md',
        prefix: '',
      },
      schema: commonSchema,
    }),
    content_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/blog/*.md',
        prefix: '',
      },
      schema: commonSchema,
    }),
  },
})
