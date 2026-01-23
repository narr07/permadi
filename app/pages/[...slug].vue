<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale } = useI18n()
const slug = computed(() => withLeadingSlash(String(route.params.slug)))

const { data: page } = await useAsyncData(`page-${slug.value}`, async () => {
  // Build collection name based on current locale (id_pages or en_pages)
  const collection = `${locale.value}_pages` as keyof Collections
  const content = await queryCollection(collection).path(slug.value).first()

  // Fallback to default locale (id) if content is missing
  if (!content && locale.value !== 'id') {
    return await queryCollection(`id_pages` as keyof Collections).path(slug.value).first()
  }

  return content
}, {
  watch: [locale], // Refetch when locale changes
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <div v-else>
    <h1>Page not found</h1>
    <p>This page doesn't exist in {{ locale }} language.</p>
  </div>
</template>
