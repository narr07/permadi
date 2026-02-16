import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'
import { locales } from './i18n-constants'

const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

const blogSchema = pageSchema.extend({
  idBlog: z.number().optional(), // Auto-extracted from filename prefix (e.g., "1. Title.md" -> 1)
  readingTime: z.number().optional(), // Auto-calculated based on word count
  date: z.date(),
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
  image: z.string(),
  category: z.array(z.string()),
  tools: z.enum(['illustator', 'photoshop', 'affinity', 'lightroom', 'canva', 'figma']),
  date: z.date(),
})

const collections: any = {}

locales.forEach((locale) => {
  // Main collection for all routable pages (excluding blog/project/gallery which have their own collections)
  collections[`${locale}_pages`] = defineCollection({
    type: 'page',
    source: {
      include: `${locale}/**/*.md`,
      exclude: [`${locale}/blog/**`, `${locale}/project/**`, `${locale}/gallery/**`],
    },
    schema: blogSchema,
  })

  // Blog collection with proper i18n path prefix
  // prefix_except_default strategy: id = /blog, en = /en/blog
  collections[`${locale}_blog`] = defineCollection({
    type: 'page',
    source: {
      include: `${locale}/blog/**/*.md`,
      // Default locale (id) gets /blog, other locales get /{locale}/blog
      prefix: locale === 'id' ? '/blog' : `/${locale}/blog`,
    },
    schema: blogSchema,
  })

  // Specific collections for structured data queries (not for routing)
  collections[`${locale}_project`] = defineCollection({
    type: 'data',
    source: `${locale}/project/*.yml`,
    schema: projectSchema,
  })

  collections[`${locale}_gallery`] = defineCollection({
    type: 'data',
    source: `${locale}/gallery/*.yml`,
    schema: gallerySchema,
  })
})

export default defineContentConfig({ collections })
