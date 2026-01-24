<script setup lang="ts">
const { locale, locales, t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const setI18nParams = useSetI18nParams()

// Helper function to generate slug from path
function generateSlug(contentPath: string): string {
  // Extract the last part of the path (filename without locale prefix)
  const parts = contentPath.split('/')
  return parts[parts.length - 1] || ''
}

const { data: doc } = await useAsyncData(`blog-${locale.value}-${route.params.slug}`, async () => {
  const collectionName = `${locale.value}_pages` as any

  // Get all blog posts for current locale
  const allDocs = await queryCollection(collectionName)
    .where('path', 'LIKE', `/${locale.value}/blog/%`)
    .all()

  // Find matching document by comparing slug from path
  const matchingDoc = allDocs.find((d: any) => {
    const slug = generateSlug(d.path)
    return slug === route.params.slug
  })

  if (!matchingDoc)
    return null

  // Find translations based on idBlog
  const translations: Record<string, any> = {}
  for (const loc of locales.value) {
    const locCode = typeof loc === 'string' ? loc : loc.code
    const locCollection = `${locCode}_pages` as any

    // Find the translated doc with the same idBlog
    const allTranslatedDocs = await queryCollection(locCollection)
      .where('path', 'LIKE', `/${locCode}/blog/%`)
      .all()

    const translatedDoc = allTranslatedDocs.find((d: any) => d.idBlog === matchingDoc.idBlog)

    if (translatedDoc) {
      const slug = generateSlug(translatedDoc.path)
      translations[locCode] = { slug }
    }
  }

  return {
    ...matchingDoc,
    translations,
  }
}, {
  watch: [locale],
})

// Handle 404
if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post tidak ditemukan', fatal: true })
}

// Update i18n params for language switcher
watch(doc, (newDoc) => {
  if (newDoc?.translations) {
    setI18nParams(newDoc.translations)
  }
}, { immediate: true })

useSeoMeta({
  title: doc.value?.title,
  ogTitle: doc.value?.title,
  description: doc.value?.description,
  ogDescription: doc.value?.description,
  ogImage: doc.value?.image,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UContainer v-if="doc" class="py-12 md:py-20 space-y-4">
    <UPage>
      <UButton
        :to="localePath('/blog')"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-arrow-left-20-solid"
      >
        {{ t('back') || 'Kembali' }}
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
                {{ t('published') || 'Published' }}: {{ new Date(doc.date).toLocaleDateString(locale) }}
              </span>
              <UButton
                :to="localePath('/blog')"
                variant="ghost"
                size="sm"
              >
                {{ t('back_to_articles') || 'Kembali ke Artikel' }}
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
