<script setup lang="ts">
const { locale, locales, t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const setI18nParams = useSetI18nParams()
const colorMode = useColorMode()

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
  ogType: 'article',
  articleAuthor: ['Permadi'],
})

useSchemaOrg([
  defineArticle({
    headline: article.value?.title,
    description: article.value?.description,
    image: article.value?.image,
    datePublished: article.value?.date,
    author: {
      name: 'Permadi',
      url: 'https://permadi.dev',
    },
    publisher: {
      name: 'Permadi',
    },
  }),
])

// const { copy, copied } = useClipboard()

// // Copy seluruh konten artikel
// function copyArticle() {
//   if (!article.value)
//     return

//   // Ambil teks asli (Markdown) dari rawbody yang sudah kita tambahkan di schema
//   let content = `${article.value.title}\n\n`

//   if (article.value.description) {
//     content += `${article.value.description}\n\n`
//   }

//   // Gunakan rawbody (teks Markdown mentah)
//   if (article.value.rawbody) {
//     content += article.value.rawbody
//   }

//   copy(content)
// }
defineOgImageComponent('Permadi', {
  title: article.value?.title,
  description: article.value?.description,
  headline: 'Blog',
})

const tocColor = computed(() => colorMode.value === 'dark' ? 'warning' : 'info')
const isMobileTocOpen = ref(false)

function handleTocClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  // Check if what was clicked was an anchor tag
  if (target.closest('a')) {
    isMobileTocOpen.value = false
  }
}

const siteConfig = useSiteConfig()
const articleUrl = computed(() => article.value ? `${siteConfig.url}${article.value.path}` : '')

const articleTags = computed(() => article.value?.tags?.map((t: string) => t.replace(/\s+/g, '')).join(','))
</script>

<template>
  <div v-if="article" class="py-8 space-y-4">
    <UPage>
      <!-- <UTooltip :text="copied ? 'Copied!' : 'Copy content'">
        <UButton
          :color="copied ? 'success' : 'neutral'"
          variant="ghost"
          size="sm"
          :icon="copied ? 'i-narr-copy-check' : 'i-narr-copy'"
          label="Copy content"
          @click="copyArticle"
        />
      </UTooltip> -->
      <UPageHeader>
        <template #title>
          {{ article.title }}
        </template>
        <template #description>
          {{ article.description }}
        </template>
        <template #headline>
          <div class="flex flex-col gap-2">
            <div v-if="article.readingTime" class="flex items-center gap-1 text-sm text-gray-500">
              <UIcon name="i-narr-time" class="w-4 h-4" />
              <span>{{ article.readingTime }} {{ t('min_read') || 'menit baca' }}</span>
            </div>
            <div class="flex flex-wrap py-2 gap-2">
              <UBadge v-for="tag in article.tags" :key="tag" class="uppercase text-xs" variant="subtle">
                {{ tag }}
              </UBadge>
            </div>
          </div>
        </template>
      </UPageHeader>

      <UPageBody :ui="{ wrapper: 'px-0 sm:px-0' }">
        <UCard :ui="{ body: 'p-2 sm:p-4' }">
          <div class="prose dark:prose-invert  max-w-none">
            <ContentRenderer :value="article" />
          </div>

          <!-- Share Buttons -->
          <div class="py-4 flex flex-col items-center">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              {{ t('share') || 'Bagikan' }}
            </p>
            <div class="share-buttons">
              <SocialShare
                v-for="network in ['facebook', 'x', 'linkedin', 'email', 'threads', 'whatsapp']"
                :key="network"
                :network="network"
                :styled="true"
                :label="false"
                :url="articleUrl"
                :title="article.title"
                :hashtags="articleTags"
              />
            </div>
          </div>
          <!-- Reaction Buttons -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <ClientOnly>
              <ReactionButtons :post-id="article.idBlog" />
            </ClientOnly>
          </div>

          <template #footer>
            <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t">
              <ClientOnly>
                <span v-if="article.date">
                  {{ t('published') || 'Dipublikasikan' }}: {{ new Date(article.date).toLocaleDateString(locale) }}
                </span>
              </ClientOnly>
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
        <div class="hidden lg:block sticky top-24">
          <UContentToc
            :color="tocColor"
            highlight
            :highlight-color="tocColor"
            :links="article.body.toc.links"
            class="max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
          />
        </div>
      </template>

      <!-- Mobile TOC: Popover button -->
      <div v-if="article?.body?.toc?.links?.length" class="lg:hidden fixed bottom-24 left-4 z-40">
        <UPopover
          v-model:open="isMobileTocOpen"
          :popper="{ placement: 'top-end' }"
          overlay
        >
          <UButton
            icon="i-narr-list"
            color="neutral"
            variant="subtle"
            class="rounded-full shadow-xl"
            aria-label="Table of Contents"
          />
          <template #content>
            <div class="p-4 w-64" @click="handleTocClick">
              <UContentToc
                title="Daftar Isi"
                :default-open="true"
                :color="tocColor"
                highlight
                :highlight-color="tocColor"
                :links="article.body.toc.links"
                class="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
                :ui="{ trigger: 'cursor-default pointer-events-none pb-3 border-b border-gray-200 dark:border-gray-800', trailing: 'hidden' }"
              />
            </div>
          </template>
        </UPopover>
      </div>
    </UPage>
  </div>
</template>

<style scoped>
.share-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.share-buttons :deep(.social-share-button) {
  color: #fff !important;
  padding: 0.5rem;
  border-radius: 0.5rem;
  aspect-ratio: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.share-buttons :deep(.social-share-button:hover) {
  transform: scale(1.1);
  opacity: 0.85;
}
</style>
