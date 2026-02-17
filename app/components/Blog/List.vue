// app/components/Blog/List.vue
<script setup lang="ts">
import { Motion } from 'motion-v'

const { locale, t } = useI18n()
const localePath = useLocalePath()

// Helper function to generate clean slug from content path
function extractSlug(path: string): string {
  // Path format: /id/blog/my-article or /en/blog/my-article
  const parts = path.split('/')
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

// Query the collection based on current locale
const { data: posts } = await useAsyncData(`blog-list-${locale.value}`, () => {
  return queryCollection(`${locale.value}_blog`)
    // .where('path', 'LIKE', `/${locale.value}/blog/%`)
    .order('date', 'DESC')
    .all()
}, {
  watch: [locale],
})

// Fetch reaction counts for all posts
const reactionCounts = ref<Record<number, { love: number, like: number, sad: number }>>({})

async function fetchReactions() {
  if (!posts.value || posts.value.length === 0)
    return

  const postIds = posts.value
    .map((post: any) => post.idBlog)
    .filter((id: any) => id != null)

  if (postIds.length === 0)
    return

  try {
    const data = await $fetch<Record<number, { love: number, like: number, sad: number }>>('/api/reactions/batch', {
      query: { postIds: postIds.join(',') },
    })
    reactionCounts.value = data
  }
  catch (e) {
    console.error('Failed to fetch reactions:', e)
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
  <div class=" my-12">
    <UBlogPosts v-if="posts && posts.length > 0">
      <Motion
        v-for="(post, index) in posts"
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
          :ui="{ title: 'line-clamp-2', description: 'line-clamp-2' }"
        >
          <template #badge>
            <UBadge v-if="post.category" color="primary" variant="solid" size="sm">
              {{ t(`categories.${post.category}`) }}
            </UBadge>
          </template>

          <template #date>
            <div class="space-y-3">
              <time v-if="post.date" :datetime="post.date" class="block text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(post.date) }}
              </time>

              <div class="flex items-center justify-between w-full">
                <!-- Reading time -->
                <div class="flex items-center gap-2">
                  <UBadge
                    v-if="post.readingTime"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                    icon="i-heroicons-clock"
                    :label="`${post.readingTime} min`"
                  />
                </div>

                <!-- Reactions -->
                <div v-if="post.idBlog && getTotalReactions(post.idBlog) > 0" class="flex items-center gap-1">
                  <UBadge
                    v-if="reactionCounts[post.idBlog]?.love"
                    color="error"
                    variant="subtle"
                    size="xs"
                    icon="i-heroicons-heart"
                    :label="String(reactionCounts[post.idBlog]?.love ?? 0)"
                  />
                  <UBadge
                    v-if="reactionCounts[post.idBlog]?.like"
                    color="info"
                    variant="subtle"
                    size="xs"
                    icon="i-heroicons-hand-thumb-up"
                    :label="String(reactionCounts[post.idBlog]?.like ?? 0)"
                  />
                  <UBadge
                    v-if="reactionCounts[post.idBlog]?.sad"
                    color="warning"
                    variant="subtle"
                    size="xs"
                    icon="i-heroicons-face-frown"
                    :label="String(reactionCounts[post.idBlog]?.sad ?? 0)"
                  />
                </div>
              </div>
            </div>
          </template>
        </UBlogPost>
      </Motion>
    </UBlogPosts>

    <div v-else class="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
      <UIcon name="i-heroicons-inbox" class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 text-lg">
        {{ t('no_articles') || 'Belum ada artikel yang dipublikasikan.' }}
      </p>
    </div>
  </div>
</template>
