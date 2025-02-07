<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const currentPage = ref(1)
const blogData = ref<{ posts: any[], total: number }>({ posts: [], total: 0 })
const itemsPerPage = 10

// eslint-disable-next-line unused-imports/no-unused-vars
const slug = computed(() => withLeadingSlash(String(route.params.slug)))
const isLoading = ref(true) // Status loading

// Fungsi untuk mengambil data blog
async function fetchBlogData() {
  isLoading.value = true // Set loading true
  try {
    const collection = (`blog_${locale.value}`) as keyof Collections
    const [posts, total] = await Promise.all([
      queryCollection(collection)
        .order('date', 'DESC')
        .skip((currentPage.value - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .all(),
      queryCollection(collection).count(),
    ])
    blogData.value = { posts, total }
  }
  catch (error) {
    console.error('Error fetching blog data:', error)
    blogData.value = { posts: [], total: 0 }
  }
  finally {
    isLoading.value = false // Set loading false
  }
}

// Gunakan watchEffect untuk memantau perubahan dan memanggil fetch data
watchEffect(() => {
  fetchBlogData()
})

// Reset halaman ke pertama saat locale berubah
watch(locale, () => {
  currentPage.value = 1
})

// Utility functions
function extractTextFromBody(body: any): string {
  if (!body?.value || !Array.isArray(body.value))
    return ''

  return body.value.reduce((text: string, item: any[]) => {
    if (Array.isArray(item)) {
      const content = item.map((element) => {
        if (typeof element === 'string')
          return element
        if (Array.isArray(element))
          return extractTextFromBody({ value: [element] })
        if (element?.value)
          return element.value
        return ''
      }).join(' ')

      return `${text} ${content}`
    }
    return text
  }, '')
}

function calculateReadingTime(body: any): number {
  const text = extractTextFromBody(body)
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function useReadingTime() {
  const formatReadingTime = (minutes: number): string =>
    locale.value === 'id' ? `${minutes} menit baca` : `${minutes} min read`

  return {
    calculateReadingTime,
    formatReadingTime,
  }
}

const total = computed(() => blogData.value?.total ?? 0)
const { formatReadingTime } = useReadingTime()

// Computed untuk posts dengan reading time
const postsWithReadingTime = computed(() =>
  (blogData.value?.posts || []).map(post => ({
    ...post,
    readingTime: calculateReadingTime(post.body),
  })),
)

// SEO Metadata
const seoMeta = computed(() => ({
  title: 'Blog',
  description: t('website.description'),
}))

useSeoMeta(seoMeta.value)

defineOgImageComponent('Page', {
  title: 'Blog',
  description: t('website.description'),
})
</script>

<template>
  <div>
    <UContainer>
      <!-- Judul -->
      <div class="pt-8 pb-4">
        <h1 class="font-bold text-g4">
          {{ t('blog.title') }}
        </h1>
      </div>

      <!-- Tags -->
      <div class="py-4">
        <Tags />
      </div>

      <!-- Daftar Artikel -->
      <div v-if="!isLoading" class="grid grid-cols-1 gap-4">
        <div v-for="post in postsWithReadingTime" :key="post.id">
          <NuxtLink
            :aria-label="t('article.read', { title: post.title })"
            :title="t('article.read', { title: post.title })"
            :to="`blog${post.path}`"
          >
            <UCard class="h-full hover:bg-yellow duration-100 ease-in-out dark:hover:bg-permadi-700">
              <div class="flex flex-col p-2 h-full justify-between">
                <h2 class="text-2xl line-clamp-2 text-permadi-700 text-balance font-semibold">
                  {{ post.title }}
                </h2>
                <div class="pt-2">
                  <USeparator color="primary" />
                </div>
                <div class="pt-2">
                  <p class="text-xs flex items-center gap-1">
                    <UIcon name="ph:timer-duotone" class="w-4 h-4" />
                    {{ formatReadingTime(post.readingTime) }}
                  </p>
                </div>

                <div class="flex items-end justify-between h-full">
                  <p class="text-xs flex items-center gap-1">
                    <UIcon name="ph:calendar-dots-duotone" class="w-4 h-4" />
                    {{ new Date(post.date).toLocaleDateString(
                      locale === 'id' ? 'id-ID' : 'en-US',
                      { day: 'numeric', month: 'long', year: 'numeric' },
                    ) }}
                  </p>
                  <div v-if="post.tags.length > 0" class="mr-2">
                    <UButton
                      :to="localePath(`/blog/tags/${post.tags[0]}`)"
                      color="neutral"
                      :aria-label="`Lihat artikel dengan tag ${post.tags[0]}`"
                      size="xs"
                    >
                      {{ post.tags[0] }}
                    </UButton>
                  </div>
                </div>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!isLoading" class="flex justify-center mt-8">
        <UPagination
          v-model:page="currentPage"
          :total="total"
          :items-per-page="itemsPerPage"
          :sibling-count="1"
          show-edges
        />
      </div>
    </UContainer>
  </div>
</template>
