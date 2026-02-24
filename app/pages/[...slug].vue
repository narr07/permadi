<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const { locale, locales } = useI18n()
const route = useRoute()
const setI18nParams = useSetI18nParams()

// Normalize slug from route params
const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s))
    return s.join('/') || ''
  return s || ''
})

// Unique key per locale and slug to prevent hydration mismatches
const dataKey = computed(() => `page-${locale.value}-${slug.value.replace(/\//g, '_')}`)

const { data: page } = await useAsyncData(dataKey.value, async () => {
  const collection = `${locale.value}_pages` as keyof Collections

  // Construction of the exact database path: /locale/slug
  // We ensure no double slashes and no trailing slash
  const fullPath = slug.value
    ? `/${locale.value}/${slug.value}`.replace(/\/+/g, '/').replace(/\/$/, '')
    : `/${locale.value}`

  const content = await queryCollection(collection).path(fullPath).first()

  if (content) {
    return content
  }

  // Fallback: Try to find content in other locales and setup i18n params
  for (const loc of locales.value) {
    const locCode = typeof loc === 'string' ? loc : loc.code
    if (locCode === locale.value)
      continue

    const fallbackCollection = `${locCode}_pages` as keyof Collections
    const fallbackPath = slug.value
      ? `/${locCode}/${slug.value}`.replace(/\/+/g, '/').replace(/\/$/, '')
      : `/${locCode}`

    const fallbackContent = await queryCollection(fallbackCollection).path(fallbackPath).first()
    if (fallbackContent) {
      // Content exists in another locale, set up params for language switcher
      return null // Return null to show "not found" but language switcher will work
    }
  }

  return null
}, {
  watch: [locale, slug], // Refresh if either changes
})

// SEO meta for content pages
useSeoMeta({
  title: () => page.value?.title,
  ogTitle: () => page.value?.title,
  description: () => (page.value as any)?.description,
  ogDescription: () => (page.value as any)?.description,
})
useSchemaOrg([
  defineWebPage({
    name: 'Permadi',
    description: 'Dinar Permadi Yusup is a teacher at SDN Teja 2, full-stack developer, and a passionate graphic designer and UI/UX designer. He is also the founder of Permadi.dev and Permadi.id.',
    image: 'https://permadi.dev/permadi.jpg',
    url: 'https://permadi.dev',
  }),
])
defineOgImageComponent('Permadi', {
  title: () => page.value?.title,
  description: () => (page.value as any)?.description,
  headline: 'Permadi',
})

// Reset i18n params on mount for non-blog pages
onMounted(() => {
  // For catch-all pages, we don't have dynamic slug translations
  // so we reset to empty to allow normal language switching behavior
  setI18nParams({})
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <div v-else class="text-center py-16">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Page not found
    </h1>
    <p class="text-gray-500 dark:text-gray-400">
      This page doesn't exist in {{ locale === 'id' ? 'Indonesian' : 'English' }} language.
    </p>
    <NuxtLink
      :to="locale === 'id' ? '/' : '/en'"
      class="mt-6 inline-block text-primary-500 hover:text-primary-600"
    >
      ← Back to Home
    </NuxtLink>
  </div>
</template>
