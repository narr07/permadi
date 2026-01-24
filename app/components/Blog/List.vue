<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

// Helper function to extract slug from content path
function extractSlug(path: string): string {
  // Path format: /id/blog/my-article or /en/blog/my-article
  const parts = path.split('/')
  return parts[parts.length - 1] || ''
}

// Query the collection based on current locale
const { data: posts } = await useAsyncData(`blog-list-${locale.value}`, () => {
  return queryCollection(`${locale.value}_pages`)
    .where('path', 'LIKE', `/${locale.value}/blog/%`)
    .order('date', 'DESC')
    .all()
}, {
  watch: [locale],
})

// Generate proper URL using localePath
function getBlogUrl(post: any): string {
  const slug = extractSlug(post.path)
  return localePath(`/blog/${slug}`)
}
</script>

<template>
  <div class="blog-list-container my-12">
    <div v-if="posts && posts.length > 0" class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="getBlogUrl(post)"
        class="group flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-500/50"
      >
        <div class="relative aspect-video overflow-hidden">
          <NuxtImg
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            width="400"
            height="225"
          />
          <div v-else class="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-400" />
          </div>

          <div v-if="post.category" class="absolute top-4 left-4">
            <UBadge color="primary" variant="solid" size="sm" class="font-medium">
              {{ $t(`categories.${post.category}`) }}
            </UBadge>
          </div>
        </div>

        <div class="p-6 flex flex-col grow">
          <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <time v-if="post.date" :datetime="post.date">{{ post.date }}</time>
          </div>

          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-primary-500 transition-colors">
            {{ post.title }}
          </h3>

          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 grow">
            {{ post.description }}
          </p>

          <div class="flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
            <span>{{ t('read_more') || 'Baca Selengkapnya' }}</span>
            <UIcon name="i-heroicons-arrow-right" class="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </NuxtLink>
    </div>

    <div v-else class="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
      <UIcon name="i-heroicons-inbox" class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 text-lg">
        {{ t('no_articles') || 'Belum ada artikel yang dipublikasikan.' }}
      </p>
    </div>
  </div>
</template>
