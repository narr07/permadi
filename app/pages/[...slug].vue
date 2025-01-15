<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { queryCollection, useRoute } from '#imports'
import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale, localeProperties } = useI18n()
const slug = computed(() => withLeadingSlash(String(route.params.slug)))

const { data: home } = await useAsyncData(`page-${slug.value}`, async () => {
  const collection = (`content_${locale.value}`) as keyof Collections
  const content = await queryCollection(collection).path(slug.value).first()

  // Possibly fallback to default locale if content is missing in non-default locale

  return content
}, {
  watch: [locale],
})

if (!home.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useHead({
  ...home.value.head,
  meta: home.value.head?.meta?.filter(meta => meta !== undefined) || [],
  script: home.value.head?.script?.filter(script => script !== undefined) || [],
})
useSeoMeta(home.value.seo || {})

defineOgImageComponent('Page', {
  title: home.value.title,
  description: home.value.description,
})
</script>

<template>
  <div>
    <ContentRenderer
      v-if="home"
      :dir="localeProperties?.dir ?? 'ltr'"
      :value="home"
    />
  </div>
</template>
