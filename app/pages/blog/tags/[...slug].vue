<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const currentPage = ref(1)
const itemsPerPage = 5

// Mengubah slug menjadi array jika itu adalah string yang dipisahkan koma
const { slug } = route.params
const filter = Array.isArray(slug) ? slug : slug?.split(',')

// Fetch posts dengan useAsyncData
const { data: postsData } = await useAsyncData(`blog-${route.path}-${currentPage.value}`, () => {
  return queryCollection(`blog_${locale.value}`)
    .where('tags', 'LIKE', `%${filter?.join('%')}%`)
    .order('date', 'DESC')
    .skip((currentPage.value - 1) * itemsPerPage)
    .limit(itemsPerPage)
    .all()
}, {
  watch: [currentPage, locale],
})

// Fetch total posts
const { data: totalPosts } = await useAsyncData(`blog-total-${route.path}`, () => {
  return queryCollection(`blog_${locale.value}`)
    .where('tags', 'LIKE', `%${filter?.join('%')}%`)
    .count()
}, {
  watch: [localePath],
})

// Reset page when locale changes
watch(localePath, () => {
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
  const { locale } = useI18n()

  const formatReadingTime = (minutes: number): string => {
    return locale.value === 'id'
      ? `${minutes} menit baca`
      : `${minutes} min read`
  }

  return {
    calculateReadingTime,
    formatReadingTime,
  }
}

const total = computed(() => totalPosts.value ?? 0)
const { formatReadingTime } = useReadingTime()

// Computed untuk posts dengan reading time
const postsWithReadingTime = computed(() =>
  postsData.value?.map(post => ({
    ...post,
    readingTime: calculateReadingTime(post.body),
  })) || [],
)

defineOgImageComponent('Page', {
  title: `${t('website.tag')} ${filter?.join(', ')}`,
  description: t('website.description'),
})
</script>

<template>
  <UContainer class="py-8">
    <header class="page-heading">
      <div class="wrapper">
        <h1 class="text-5xl font-extrabold">
          {{ `${t('website.tag')} ${filter?.join(', ')}` }}
        </h1>
      </div>
    </header>

    <section class="page-section">
      <!-- Komponen Tags jika ada -->
      <Tags />

      <ul class="mt-6">
        <li v-if="!postsWithReadingTime.length">
          {{ t('website.tagNo') }}
        </li>

        <li v-for="article in postsWithReadingTime" :key="article.path" class="flex flex-col mb-4">
          <NuxtLink :to="localePath(`/blog${article.path}`)">
            <UCard class="hover:bg-yellow duration-100 ease-in-out dark:hover:bg-permadi-700">
              <header>
                <h1 class="text-2xl font-semibold">
                  {{ article.title }}
                </h1>
                <p class="line-clamp-2">
                  {{ article.description }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatReadingTime(article.readingTime) }}
                </p>
                <ul class="mt-4 flex flex-wrap">
                  <li v-for="(tag, n) in article.tags" :key="n" class="mr-2 mb-2">
                    <NuxtLink :to="localePath(`/blog/tags/${tag}`)">
                      <UBadge>
                        {{ tag }}
                      </UBadge>
                    </NuxtLink>
                  </li>
                </ul>
              </header>
            </UCard>
          </NuxtLink>
        </li>
      </ul>

      <!-- Pagination -->
      <!-- Pagination -->
      <div class="flex justify-center mt-8">
        <UPagination
          v-model:page="currentPage"
          :total="total"
          :items-per-page="itemsPerPage"
          :sibling-count="1"
          show-edges
        />
      </div>
    </section>
  </UContainer>
</template>
