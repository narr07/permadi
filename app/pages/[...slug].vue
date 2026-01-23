<script setup lang="ts">
import type { Collections } from '@nuxt/content'
// import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale } = useI18n()

// Normalize slug from route params
const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s))
    return s.join('/') || '/'
  return s || '/'
})

// Unique key per locale and slug to prevent hydration mismatches
const dataKey = computed(() => `page-${locale.value}-${slug.value.replace(/\//g, '_')}`)

const { data: page } = await useAsyncData(dataKey.value, async () => {
  const collection = `${locale.value}_pages` as keyof Collections

  // Construction of the exact database path: /locale/slug
  // We ensure no double slashes and no trailing slash
  const fullPath = `/${locale.value}/${slug.value}`.replace(/\/+/g, '/').replace(/\/$/, '') || `/${locale.value}`

  const content = await queryCollection(collection).path(fullPath).first()

  // Fallback to default locale (id) if translation is missing
  if (!content && locale.value !== 'id') {
    const fallbackPath = `/id/${slug.value}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/id'
    return await queryCollection('id_pages' as keyof Collections).path(fallbackPath).first()
  }

  return content
}, {
  watch: [locale, slug], // Refresh if either changes
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <div v-else>
    <h1>Page not found</h1>
    <p>This page doesn't exist in {{ locale }} language.</p>
  </div>
</template>
