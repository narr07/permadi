<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const { locale } = useI18n()
const localePath = useLocalePath()

const { data: latestBlogs } = await useAsyncData(`latest-blogs-${locale.value}`, async () => {
  const collection = `blog_${locale.value}` as keyof Collections
  return await queryCollection(collection)
    .order('date', 'DESC')
    .select('title', 'path', 'description', 'idBlog', 'image', 'date')
    .limit(5)
    .all()
}, {
  watch: [locale],
})

function getBlogLink(blog: any) {
  const filename = blog.path.split('/').pop() || ''
  const slug = filename
    .replace(/^\d+\./, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
  return localePath({ name: 'blog-slug', params: { slug } })
}

const featuredBlog = computed(() => latestBlogs.value?.[0])
const otherBlogs = computed(() => latestBlogs.value?.slice(1) || [])
</script>

<template>
  <div v-if="latestBlogs && latestBlogs.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Featured Article (Paling Terbaru) -->
    <NuxtLink
      v-if="featuredBlog"
      :to="getBlogLink(featuredBlog)"
      class="group relative overflow-hidden rounded-lg border border-default hover:border-primary transition-colors"
    >
      <div class="relative h-64 overflow-hidden">
        <NuxtImg
          v-if="featuredBlog.image"
          :src="featuredBlog.image"
          :alt="featuredBlog.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div v-else class="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800" />
      </div>
      <div class="p-4">
        <h3 class="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
          {{ featuredBlog.title }}
        </h3>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {{ featuredBlog.description }}
        </p>
        <p v-if="featuredBlog.date" class="mt-3 text-xs text-gray-500 dark:text-gray-500">
          {{ new Date(featuredBlog.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
      </div>
    </NuxtLink>

    <!-- List 4 Artikel Lainnya -->
    <div class="space-y-4">
      <NuxtLink
        v-for="blog in otherBlogs"
        :key="blog.path"
        :to="getBlogLink(blog)"
        class="group block p-4 rounded-lg border border-default hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
      >
        <h4 class="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {{ blog.title }}
        </h4>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {{ blog.description }}
        </p>
        <p v-if="blog.date" class="mt-2 text-xs text-gray-500">
          {{ new Date(blog.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
