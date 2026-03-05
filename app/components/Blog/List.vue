// app/components/Blog/List.vue
<script setup lang="ts">
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

// Tell Nuxt to prerender all blog post pages (+ their OG images)
if (posts.value?.length) {
  prerenderRoutes(posts.value.map(post => localePath(`/blog/${extractSlug(post.path)}`)))
}

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
      <span v-if="selectedCategory" class="text-sm ">
        {{ filteredPosts.length }} {{ t('articles_found') || 'article(s) found' }}
      </span>
    </div>

    <!-- Blog Posts List -->
    <UPageList v-if="filteredPosts && filteredPosts.length > 0" divide>
      <div
        v-for="post in filteredPosts"
        :key="post.path"
        role="listitem"
      >
        <UPageCard
          variant="ghost"
          :to="getBlogUrl(post)"
        >
          <template #leading>
            <div class="flex items-center justify-center size-10 rounded-lg bg-primary/10 dark:bg-primary/15 shrink-0">
              <LazySvgDev v-if="post.category === 'programmer'" class="size-8" />
              <LazySvgGuru v-else-if="post.category === 'pendidikan'" class="size-8" />
              <LazySvgDesigner v-else-if="post.category === 'desainer'" class="size-8" />
              <UIcon v-else name="i-lucide-file-text" class="size-5 text-primary" />
            </div>
          </template>

          <template #body>
            <div class="flex flex-col gap-2">
              <!-- Title & Description (rendered by UPageCard default) -->
              <div class="flex flex-col gap-1">
                <h2 class="text-g2 font-semibold  line-clamp-1 group-hover/page-card:text-primary transition-colors">
                  {{ post.title }}
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ post.description }}
                </p>
              </div>

              <!-- Date + Reading Time -->
              <div class="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                <ClientOnly>
                  <span>{{ formatDate(post.date) }}</span>
                </ClientOnly>
                <span v-if="post.readingTime" class="flex items-center gap-1">
                  <UIcon name="i-narr-time" class="size-3.5" />
                  {{ post.readingTime }} min
                </span>
              </div>

              <!-- Tags badges -->
              <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-1.5">
                <UBadge
                  v-for="tag in post.tags"
                  :key="tag"
                  class="uppercase"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  :label="tag"
                />
              </div>
            </div>
          </template>

          <template #footer>
            <ClientOnly>
              <div v-if="reactionsLoading && post.idBlog" class="flex items-center gap-1">
                <USkeleton class="h-5 w-12 rounded-md" />
                <USkeleton class="h-5 w-12 rounded-md" />
                <USkeleton class="h-5 w-12 rounded-md" />
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
          </template>
        </UPageCard>
      </div>
    </UPageList>

    <div v-else class="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
      <UIcon name="i-narr-loading" class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 text-lg">
        {{ selectedCategory ? (t('no_articles_found') || 'Tidak ada artikel untuk kategori ini.') : (t('no_articles') || 'Belum ada artikel yang dipublikasikan.') }}
      </p>
    </div>
  </UPage>
</template>
