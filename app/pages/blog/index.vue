<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { calculateReadingTime, formatReadingTime } = useReadingTime()
const { locale, t } = useI18n()
const localePath = useLocalePath()

// Pagination state
const itemsPerPage = 10
const route = useRoute()
const router = useRouter()

// Ambil nilai `page` dari query parameter, default ke 1 jika tidak ada
const currentPage = ref(Number(route.query.page) || 1)

// Update query parameter saat `currentPage` berubah
watch(currentPage, (newPage) => {
  router.replace({
    query: {
      ...route.query,
      page: newPage.toString(),
    },
  })
})

// Ambil semua data blog
const { data: allBlog } = await useAsyncData(`allBlog-${route.path}`, async () => {
  const collection = (`blog_${locale.value}`) as keyof Collections
  return await queryCollection(collection)
    .select('title', 'description', 'path', 'id', 'date', 'body', 'tags')
    .order('date', 'DESC')
    .all() as Collections['blog_id'][] | Collections['blog_en'][]
}, {
  watch: [locale],
})

// Total item untuk pagination
const totalItems = computed(() => allBlog.value?.length ?? 0)

// Data blog yang dipotong berdasarkan halaman
const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allBlog.value?.slice(start, end) ?? []
})

// Tambahkan readingTime dan format tanggal
const postsWithReadingTime = computed(() =>
  paginatedBlogs.value.map(post => ({
    ...post,
    readingTime: calculateReadingTime(post.body),
    date: new Date(post.date), // Konversi date menjadi objek Date
  })),
)

const seoMeta = computed(() => ({
  title: 'Blog',
  description: t('website.description'),
}))

useSeoMeta(seoMeta.value)

defineOgImageComponent('Page', {
  title: 'Blog',
  description: t('website.description'),
})
// SEO
defineOgImageComponent('Page', {
  title: t('website.blog'),
  description: t('website.description'),
})
</script>

<template>
  <div>
    <UContainer>
      <!-- Judul -->
      <div class="pt-8 pb-4">
        <h1 class="font-bold text-g3 md:text-g4">
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
          <div>
            <NuxtLink
              :aria-label="t('article.read', { title: post.title })"
              :title="t('article.read', { title: post.title })"
              :to="localePath(`/blog${post.path}`)"
            >
              <UCard class="h-full hover:bg-yellow-500 duration-100 ease-in-out dark:hover:bg-permadi-700">
                <div class="flex flex-col p-2 h-full justify-between">
                  <!-- Judul Artikel -->
                  <h2 class="text-g2 md:text-g3 line-clamp-2 text-permadi-700 text-balance font-semibold">
                    {{ post.title }}
                  </h2>

                  <!-- Separator -->
                  <div class="pt-2">
                    <USeparator color="primary" />
                  </div>

                  <!-- Reading Time -->
                  <div class="pt-2">
                    <p class="text-xs flex items-center gap-1">
                      <UIcon name="ph:timer-duotone" class="w-4 h-4" />
                      {{ formatReadingTime(post.readingTime) }}
                    </p>
                  </div>

                  <!-- Tanggal dan Tag -->
                  <div class="flex items-end justify-between h-full">
                    <p class="text-xs flex items-center gap-1">
                      <UIcon name="ph:calendar-dots-duotone" class="w-4 h-4" />
                      {{ formatDate(post.date, locale) }}
                    </p>
                    <div v-if="post.tags.length > 0" class="mr-2">
                      <UButton
                        :to="localePath(`/blog/tags/${post.tags[0]}`)"
                        color="neutral"
                        :aria-label="`Lihat artikel dengan tag ${post.tags[0]}`"
                        size="xs"
                      >
                        <p class="text-xs  ">
                          {{ post.tags[0] }}
                        </p>
                      </UButton>
                    </div>
                  </div>
                </div>
              </UCard>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-8">
        <UPagination
          v-model:page="currentPage"
          :items-per-page="itemsPerPage"
          active-color="neutral"

          :sibling-count="1"
          :total="totalItems"
        />
      </div>
    </UContainer>
  </div>
</template>
