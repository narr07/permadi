<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const { calculateReadingTime, formatReadingTime } = useReadingTime()
const { locale, t } = useI18n()
const itemsPerPage = 10
const currentPage = ref(1)

const { data: blogData } = await useAsyncData(`blog-${locale.value}`, async () => {
  const collection = (`blog_${locale.value}`) as keyof Collections
  const [posts, total] = await Promise.all([
    queryCollection(collection)
      .order('date', 'DESC')
      .skip((currentPage.value - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .all(),
    queryCollection(collection).count(),
  ])
  return { posts, total }
}, {
  watch: [locale, currentPage],
})

const postsWithReadingTime = computed(() =>
  (blogData.value?.posts || []).map(post => ({
    ...post,
    readingTime: calculateReadingTime(post.body),
    date: new Date(post.date), // Konversi date menjadi objek Date
  })),
)

const total = computed(() => blogData.value?.total ?? 0)
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
      <div class="grid grid-cols-1 gap-4">
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
                    {{ formatDate(post.date, locale) }}
                  </p>
                  <div v-if="post.tags.length > 0" class="mr-2">
                    <UBadge
                      color="neutral"
                      :aria-label="`Lihat artikel dengan tag ${post.tags[0]}`"
                    >
                      {{ post.tags[0] }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </div>

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
    </UContainer>
  </div>
</template>
