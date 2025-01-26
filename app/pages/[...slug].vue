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

useSeoMeta({
  ...home.value.seo,
  keywords: home.value?.tags ? home.value.tags.join(', ') : 'dinar, permadi, dinar permadi, dinar permadi yusup, guru, developer, programmer, desainer',
})

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
