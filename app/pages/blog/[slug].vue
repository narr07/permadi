<script setup lang="ts">
const { locale, locales, t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const setI18nParams = useSetI18nParams()

// Helper function to generate clean slug from path
function generateSlug(contentPath: string): string {
  // Extract the last part of the path (filename without locale prefix)
  const parts = contentPath.split('/')
  const filename = parts[parts.length - 1] || ''

  // Clean the slug: remove special characters, convert to lowercase, replace spaces with hyphens
  return filename
    .replace(/^\d+\.?\s*/, '') // Remove number prefix like "1." or "1. "
    .toLowerCase()
    .replace(/['`]/g, '') // Remove apostrophes
    .replace(/[!?.,;:"()[\]{}]/g, '') // Remove punctuation
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

const { data: article } = await useAsyncData(`blog-${locale.value}-${route.params.slug}`, async () => {
  const collectionName = `${locale.value}_blog` as any
  // With prefix config: id = /blog/*, en = /en/blog/*
  const pathPrefix = locale.value === 'id' ? '/blog/%' : `/${locale.value}/blog/%`

  // Get all blog posts for current locale
  const allPosts = await queryCollection(collectionName)
    .where('path', 'LIKE', pathPrefix)
    .all()

  // Find matching document by comparing slug from path
  const matchingPost = allPosts.find((post: any) => {
    const slug = generateSlug(post.path)
    return slug === route.params.slug
  })

  if (!matchingPost)
    return null

  // Find translations based on idBlog
  const translations: Record<string, any> = {}


  for (const loc of locales.value) {
    const locCode = typeof loc === 'string' ? loc : loc.code
    const locCollection = `${locCode}_blog` as any
    // With prefix config: id = /blog/*, en = /en/blog/*
    const locPathPrefix = locCode === 'id' ? '/blog/%' : `/${locCode}/blog/%`

    // Find the translated post with the same idBlog
    const allTranslatedPosts = await queryCollection(locCollection)
      .where('path', 'LIKE', locPathPrefix)
      .all()


    const translatedPost = allTranslatedPosts.find((post: any) => post.idBlog === matchingPost.idBlog)

    if (translatedPost) {
      const slug = generateSlug(translatedPost.path)
      translations[locCode] = { slug }
    }
  }

  return {
    ...matchingPost,
    translations,
  }
}, {
  watch: [locale],
})

// Fetch surround (prev/next) posts
const { data: surround } = await useAsyncData(`blog-surround-${locale.value}-${route.params.slug}`, async () => {
  if (!article.value)
    return null
  const collectionName = `${locale.value}_blog` as any
  return queryCollectionItemSurroundings(collectionName, article.value.path, {
    fields: ['title', 'description'],
  })
}, {
  watch: [locale, article],
})

// Update i18n params for language switcher (do this before potential 404)
watch(article, (newArticle) => {
  if (newArticle?.translations) {
    setI18nParams(newArticle.translations)
  }
}, { immediate: true })

// Handle 404 - use non-fatal error to allow prerender to continue
if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post tidak ditemukan' })
}

useSeoMeta({
  title: article.value?.title,
  ogTitle: article.value?.title,
  description: article.value?.description,
  ogDescription: article.value?.description,
  ogImage: article.value?.image,
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineArticle({
    headline: article.value?.title,
    description: article.value?.description,
    image: article.value?.image,
    datePublished: article.value?.date,
    author: {
      name: 'Permadi',
      url: 'https://permadi.pages.dev',
    },
  }),
])
</script>

<template>
  <div v-if="article" class="py-12 md:py-20 space-y-4">
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
          {{ article.title }}
        </template>
        <template #description>
          {{ article.description }}
        </template>
        <template #headline>
          <div class="flex items-center gap-3 flex-wrap">
            <div v-if="article.readingTime" class="flex items-center gap-1 text-sm text-gray-500">
              <UIcon name="i-heroicons-clock" class="w-4 h-4" />
              <span>{{ article.readingTime }} {{ t('min_read') || 'menit baca' }}</span>
            </div>
            <UBadge v-for="tag in article.tags" :key="tag" variant="subtle">
              {{ tag }}
            </UBadge>
          </div>
        </template>
      </UPageHeader>

      <UPageBody :ui="{ wrapper: 'px-0 sm:px-0' }">
        <UCard :ui="{ body: 'p-2 sm:p-4' }">
          <div v-if="article.image" class="relative w-full h-80 -m-2 sm:-m-4 mb-6 rounded-t-lg overflow-hidden">
            <NuxtImg
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="prose dark:prose-invert max-w-none">
            <ContentRenderer :value="article" />
          </div>

          <!-- Reaction Buttons -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <ReactionButtons :post-id="article.idBlog" />
          </div>

          <template #footer>
            <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t">
              <span v-if="article.date">
                {{ t('published') || 'Dipublikasikan' }}: {{ new Date(article.date).toLocaleDateString(locale) }}
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

        <USeparator v-if="surround?.filter(Boolean).length" class="my-8" />

        <UContentSurround :surround="(surround as any)" />
      </UPageBody>

      <template v-if="article?.body?.toc?.links?.length" #right>
        <UContentToc highlight highlight-color="warning" color="warning" :links="article.body.toc.links" />
      </template>
    </UPage>
  </div>
</template>
