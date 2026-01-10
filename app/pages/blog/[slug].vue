<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const { locale, locales } = useI18n()
const route = useRoute()
const setI18nParams = useSetI18nParams()

const { data: doc } = await useAsyncData(`blog-${locale.value}-${route.params.slug}`, async () => {
  const collectionName = `blog_${locale.value}` as keyof Collections

  // Find matching document by normalizing paths from the collection
  const allDocs = await queryCollection(collectionName).select('path', 'idBlog').all()
  const matchingDoc = allDocs.find((d) => {
    const filename = d.path.split('/').pop() || ''
    const cleanSlug = filename
      .replace(/^\d+\./, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase()
    return cleanSlug === route.params.slug
  })

  if (!matchingDoc)
    return null

  const currentDoc = await queryCollection(collectionName).path(matchingDoc.path).first()

  if (!currentDoc)
    return null

  // Find translations based on idBlog
  const translations: Record<string, any> = {}
  for (const loc of locales.value) {
    const locCode = loc.code
    const locCollection = `blog_${locCode}` as keyof Collections

    const translatedDoc = await queryCollection(locCollection)
      .where('idBlog', '=', (currentDoc as any).idBlog)
      .first()

    if (translatedDoc) {
      const filename = translatedDoc.path.split('/').pop() || ''
      const cleanSlug = filename
        .replace(/^\d+\./, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase()
      translations[locCode] = { slug: cleanSlug }
    }
  }

  return {
    ...currentDoc,
    translations,
  }
}, {
  watch: [locale],
})

// Update i18n params for language switcher
watch(doc, (newDoc) => {
  if (newDoc?.translations) {
    setI18nParams(newDoc.translations)
  }
}, { immediate: true })
</script>

<template>
  <UContainer v-if="doc" class="space-y-4">
    <UPage>
      <UButton
        :to="$localePath('blog')"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-arrow-left-20-solid"
      >
        {{ $t('back') }}
      </UButton>

      <UPageHeader>
        <template #title>
          {{ doc.title }}
        </template>
        <template #description>
          {{ doc.description }}
        </template>
        <template #headline>
          <div class="flex items-center gap-2">
            <UBadge v-for="tag in doc.tags" :key="tag" variant="subtle">
              {{ tag }}
            </UBadge>
          </div>
        </template>
      </UPageHeader>

      <UPageBody>
        <UCard>
          <div v-if="doc.image" class="relative w-full h-80 -m-4 mb-6 rounded-t-lg overflow-hidden">
            <NuxtImg
              :src="doc.image"
              :alt="doc.title"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="prose dark:prose-invert max-w-none">
            <ContentRenderer :value="doc" />
          </div>

          <template #footer>
            <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t">
              <span v-if="doc.date">
                Published: {{ new Date(doc.date).toLocaleDateString(locale) }}
              </span>
              <UButton
                :to="$localePath('blog')"
                variant="ghost"
                size="sm"
              >
                {{ $t('back_to_articles') || 'Back to Articles' }}
              </UButton>
            </div>
          </template>
        </UCard>
      </UPageBody>

      <template v-if="doc?.body?.toc?.links?.length" #right>
        <UContentToc highlight highlight-color="warning" color="warning" :links="doc.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
