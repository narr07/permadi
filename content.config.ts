import type { DefinedCollection } from '@nuxt/content'
import type { Locale } from './i18n-constants'
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'
import { locales } from './i18n-constants'

// Common schema for all pages
const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

// Build collections dynamically based on locales
const collections: Record<string, DefinedCollection> = {}

locales.forEach((locale: Locale) => {
  // Pages collection for each locale
  collections[`${locale}_pages`] = defineCollection({
    type: 'page',
    source: {
      include: `${locale}/**/*.md`,
      prefix: '/',
    },
    schema: pageSchema,
  })
})

export default defineContentConfig({ collections })
