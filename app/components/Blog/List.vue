// app/components/Blog/List.vue
<script setup lang="ts">
import { Motion } from 'motion-v'

const { locale, t } = useI18n()
const localePath = useLocalePath()

// Helper function to generate clean slug from content path
function extractSlug(path: string): string {
  const parts = path.split('/')
  const filename = parts[parts.length - 1] || ''

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

// Query the collection based on current locale
const { data: posts } = await useAsyncData(`blog-list-${locale.value}`, () => {
  return queryCollection(`${locale.value}_blog`)
    .order('date', 'DESC')
    .all()
}, {
  watch: [locale],
})

// Filter states
const selectedCategory = ref<string | undefined>(undefined)

// Extract unique categories from posts
const allCategories = computed(() => {
  const categorySet = new Set<string>()
  posts.value?.forEach((post) => {
    if (post.category) {
      categorySet.add(post.category)
    }
  })
  return Array.from(categorySet).sort().map(cat => ({
    label: t(`categories.${cat}`) || cat,
    value: cat,
  }))
})

// Filtered posts
const filteredPosts = computed(() => {
  if (!posts.value)
    return []
  if (!selectedCategory.value)
    return posts.value
  return posts.value.filter(post => post.category === selectedCategory.value)
})

// Fetch reaction counts
const reactionCounts = ref<Record<number, { love: number, like: number, sad: number }>>({})
const reactionsLoading = ref(true)

async function fetchReactions() {
  if (!posts.value || posts.value.length === 0) {
    reactionsLoading.value = false
    return
  }

  const postIds = posts.value
    .map((post: any) => post.idBlog)
    .filter((id: any) => id != null)

  if (postIds.length === 0) {
    reactionsLoading.value = false
    return
  }

  reactionsLoading.value = true
  try {
    const data = await $fetch<Record<number, { love: number, like: number, sad: number }>>('/api/reactions/batch', {
      query: { postIds: postIds.join(',') },
    })
    reactionCounts.value = data
  }
  catch (e) {
    console.error('Failed to fetch reactions:', e)
  }
  finally {
    reactionsLoading.value = false
  }
}

// Fetch reactions on mount and when posts change
onMounted(() => fetchReactions())
watch(posts, () => fetchReactions())

// Get total reactions for a post
function getTotalReactions(postId: number | undefined): number {
  if (!postId || !reactionCounts.value[postId])
    return 0
  const counts = reactionCounts.value[postId]
  return counts.love + counts.like + counts.sad
}

// Generate proper URL using localePath
function getBlogUrl(post: any): string {
  const slug = extractSlug(post.path)
  return localePath(`/blog/${slug}`)
}

// Format date based on locale
function formatDate(dateStr: string) {
  if (!dateStr)
    return ''
  const date = new Date(dateStr)

  return new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const img = useImage()
const imageLoadedMap = reactive<Record<string, boolean>>({})
function onImageLoaded(key: string) {
  imageLoadedMap[key] = true
}

// Preload the first image for LCP optimization
watchEffect(() => {
  const firstPost = filteredPosts.value?.[0]
  if (firstPost?.image) {
    const preloadUrl = img(firstPost.image, { width: 600, format: 'webp', quality: 100 } as any)
    useHead({
      link: [
        { rel: 'preload', as: 'image', href: preloadUrl, imagesrcset: img.getSizes(firstPost.image, { width: 600, format: 'webp' } as any).srcset },
      ],
    })
  }
})
</script>

<template>
  <UPage class="space-y-6">
    <UPageHeader
      :title="t('blog.title')"
      :description="t('blog.description')"
      headline="Blog"
    />
    <!-- Filter Section -->
    <div v-if="allCategories.length > 0" class="flex flex-wrap py-4 justify-end items-center gap-3">
      <USelectMenu
        v-model="selectedCategory"
        :items="allCategories"
        value-key="value"
        label-key="label"
        :placeholder="t('filter_by_category') || 'Filter by Category'"
        class="w-48"
        icon="i-narr-filter"
      />
      <UButton
        v-if="selectedCategory"
        size="sm"
        variant="ghost"
        color="neutral"
        icon="i-narr-close"
        @click="selectedCategory = undefined"
      >
        {{ t('clear') || 'Clear' }}
      </UButton>
      <span v-if="selectedCategory" class="text-sm text-gray-500">
        {{ filteredPosts.length }} {{ t('articles_found') || 'article(s) found' }}
      </span>
    </div>

    <!-- Blog Posts Grid -->
    <UBlogPosts v-if="filteredPosts && filteredPosts.length > 0">
      <Motion
        v-for="(post, index) in filteredPosts"
        :key="post.path"
        :initial="{ opacity: 0, transform: 'translateY(20px)' }"
        :in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.05 * index, duration: 0.2 }"
      >
        <UBlogPost
          :title="post.title"
          :description="post.description"
          :image="{ src: post.image, alt: post.title }"
          :to="getBlogUrl(post)"
          variant="outline"
          class="h-full"
          :ui="{ title: 'line-clamp-2', description: 'line-clamp-2', footer: 'px-4 sm:px-6 pb-4 sm:pb-6' }"
        >
          <template #header>
            <div class="relative overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800">
              <NuxtImg
                :src="post.image"
                :alt="post.title"
                format="webp"
                quality="80"
                width="600"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                :placeholder="post.image && index > 0 ? img(post.image, { height: 20, width: 35, format: 'webp', blur: 5, quality: 30 } as any) : undefined"
                class="object-cover object-top w-full h-full transform transition-all duration-500 group-hover/blog-post:scale-110"
                :class="imageLoadedMap[post.path] || index === 0 ? 'blur-0' : 'blur-xl scale-105'"
                @load="onImageLoaded(post.path)"
                @error="onImageLoaded(post.path)"
              />
              <!-- Category badge overlay on image -->
              <UBadge
                v-if="post.category"
                color="neutral"
                variant="solid"
                size="sm"
                class="absolute top-3 right-3 z-10"
              >
                {{ t(`categories.${post.category}`) }}
              </UBadge>
            </div>
          </template>

          <template #badge />

          <template #date>
            <ClientOnly>
              {{ formatDate(post.date) }}
            </ClientOnly>
          </template>

          <template #footer>
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2">
                <UBadge
                  v-if="post.readingTime"
                  color="neutral"
                  variant="subtle"
                  icon="i-narr-time"
                  :label="`${post.readingTime} min`"
                />
              </div>

              <ClientOnly>
                <div v-if="reactionsLoading && post.idBlog" class="flex items-center gap-1">
                  <USkeleton class="h-6 w-14 rounded-md" />
                  <USkeleton class="h-6 w-14 rounded-md" />
                  <USkeleton class="h-6 w-14 rounded-md" />
                </div>

                <div v-else-if="post.idBlog && getTotalReactions(post.idBlog) > 0" class="flex items-center gap-1">
                  <UButton
                    v-if="reactionCounts[post.idBlog]?.love"
                    color="error"
                    variant="subtle"
                    size="xs"
                    icon="i-narr-love"
                    :label="String(reactionCounts[post.idBlog]?.love ?? 0)"
                  />
                  <UButton
                    v-if="reactionCounts[post.idBlog]?.like"
                    color="info"
                    variant="subtle"
                    size="xs"
                    icon="i-narr-lovefinger"
                    :label="String(reactionCounts[post.idBlog]?.like ?? 0)"
                  />
                  <UButton
                    v-if="reactionCounts[post.idBlog]?.sad"
                    color="warning"
                    variant="subtle"
                    size="xs"
                    icon="i-narr-like"
                    :label="String(reactionCounts[post.idBlog]?.sad ?? 0)"
                  />
                </div>
              </ClientOnly>
            </div>
          </template>
        </UBlogPost>
      </Motion>
    </UBlogPosts>

    <div v-else class="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
      <UIcon name="i-narr-loading" class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 text-lg">
        {{ selectedCategory ? (t('no_articles_found') || 'Tidak ada artikel untuk kategori ini.') : (t('no_articles') || 'Belum ada artikel yang dipublikasikan.') }}
      </p>
    </div>
  </UPage>
</template>
