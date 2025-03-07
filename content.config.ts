import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

const commonSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  image: z.string(),
  date: z.date(),

})

export default defineContentConfig({
  collections: {
    blog_id: defineCollection(
      asSeoCollection({
        type: 'page',
        source: {
          include: 'id/blog/*.md',
          prefix: '',
        },
        schema: commonSchema,
      }),
    ),
    blog_en: defineCollection(
      asSeoCollection({
        type: 'page',
        source: {
          include: 'en/blog/*.md',
          prefix: '',
        },
        schema: commonSchema,
      }),
    ),
    project_id: defineCollection(
      asSeoCollection({
        type: 'page',
        source: {
          include: 'id/project/*.md',
          prefix: '',
        },
        schema: commonSchema,
      }),
    ),
    project_en: defineCollection(
      asSeoCollection({
        type: 'page',
        source: {
          include: 'en/project/*.md',
          prefix: '',
        },
        schema: commonSchema,
      }),
    ),
  },
})
