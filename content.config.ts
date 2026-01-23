import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'
import { locales } from './i18n-constants'

const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

const blogSchema = pageSchema.extend({
  date: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.enum(['pendidikan', 'programmer', 'desainer']).optional(),
})

const projectSchema = pageSchema.extend({
  image: z.string(),
  tech: z.array(z.string()),
  link: z.string().optional(),
  featured: z.boolean().default(false),
})

const gallerySchema = z.object({
  title: z.string(),
  imageUrl: z.string(),
  category: z.enum(['pendidikan', 'programmer', 'desainer']).optional(),
  aspectRatio: z.string().default('1/1'),
})

const collections: any = {}

locales.forEach((locale) => {
  // Main collection for all routable pages
  collections[`${locale}_pages`] = defineCollection({
    type: 'page',
    source: `${locale}/**/*.md`,
    schema: blogSchema,
  })

  // Specific collections for structured data queries (not for routing)
  collections[`${locale}_project`] = defineCollection({
    type: 'data',
    source: `${locale}/project/*.md`,
    schema: projectSchema,
  })

  collections[`${locale}_gallery`] = defineCollection({
    type: 'data',
    source: `${locale}/gallery/*.md`,
    schema: gallerySchema,
  })
})

export default defineContentConfig({ collections })
