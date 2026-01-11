<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'

const setI18nParams = useSetI18nParams()
// Reset params untuk halaman list (tidak pakai slug)
onMounted(() => {
  setI18nParams({})
})
const route = useRoute()
const { locale, localeProperties } = useI18n()
const slug = computed(() => withLeadingSlash(String(route.params.slug)))
const { data: page } = await useAsyncData(`page-${slug.value}`, async () => {
  const collection = (`content_${locale.value}`) as keyof Collections
  const content = await queryCollection(collection).path(slug.value).first()
  // Possibly fallback to default locale if content is missing in non-default locale
  return content
}, {
  watch: [locale],
})
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  twitterTitle: page.value.title,
  twitterDescription: page.value.description,
})
defineOgImageComponent('NuxtSeo', {
  title: page.value.title,
  description: page.value.description,
  theme: '#99F6E4',
})
</script>

<template>
  <UContainer class="py-16 max-w-6xl">
    <ContentRenderer
      v-if="page"
      :dir="localeProperties?.dir ?? 'ltr'"
      :value="page"
    />
  </UContainer>
</template>
