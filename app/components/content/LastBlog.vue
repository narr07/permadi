<!-- app/components/content/LastBlog.vue -->
<script setup lang="ts">
const { locale } = useI18n()
const { t } = useI18n()

// Mengambil 3 artikel terbaru dari koleksi blog
const { data: lastPosts } = await useAsyncData('latest-blogs', () => {
  return queryCollection(`blog_${locale.value}`)
    .order('date', 'DESC') // Urutkan berdasarkan tanggal terbaru
    .limit(3) // Batasi hasil menjadi 3 artikel
    .all() // Ambil semua artikel yang sesuai
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
      <NuxtLink :to="`/blog${post?.path}`">
        <UCard class="h-fullm mb-2  hover:bg-yellow duration-100 ease-in-out dark:hover:bg-permadi-700">
          <div class="flex flex-col h-full justify-between">
            <h3 class="text-lg line-clamp-1 text-balance font-semibold">
              {{ post?.title }}
            </h3>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>
