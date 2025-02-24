<!-- app/components/content/LastBlog.vue -->
<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const { locale } = useI18n()
const { t } = useI18n()
const localePath = useLocalePath()

// Mengambil 3 artikel terbaru dari koleksi blog
const { data: lastPosts } = await useLazyAsyncData(`latest-blogs-${locale.value}`, async () => {
  const collection = (`blog_${locale.value}`) as keyof Collections
  return await queryCollection(collection)
    .select('title', 'path', 'date')
    .order('date', 'DESC') // Urutkan berdasarkan tanggal terbaru
    .limit(3) // Batasi hasil menjadi 3 artikel
    .all() as Collections['blog_id'][] | Collections['blog_en'][]
}, {
  watch: [locale],
  server: true, // Memastikan eksekusi di server
})

// const { data: lastPost } = await useAsyncData(route.path, () => {
//   return queryCollection(`blog_${locale.value}`).first()
// })
</script>

<template>
  <div v-if="lastPosts && lastPosts.length > 0">
    <h2 class="py-4">
      {{ t('hero.new') }}
    </h2>
    <div v-for="post in lastPosts" :key="post.path">
      <NuxtLink
        :to="localePath(`/blog${post?.path}`)"

        :aria-label="`${t('article.read')} ${post.title}`"
        :title="`${t('article.read')} ${post.title}`"
      >
        <UCard
          :ui="{
            body: 'p-4 sm:p-2', // atau 'px-2 py-2' untuk padding horizontal dan vertical
          }"
          class="h-full mb-2 hover:bg-yellow duration-100 ease-in-out dark:hover:bg-permadi-700"
        >
          <div class="flex flex-col h-full justify-between">
            <h3 class="text-base line-clamp-1 font-body text-balance font-semibold">
              {{ post?.title }}
            </h3>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>
