<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()

// Construct the expected content path from the route
// If route is /blog/hello-world, we look for /id/blog/hello-world or /en/blog/hello-world
const slug = route.params.slug as string
const contentPath = `/${locale.value}/blog/${slug}`

const { data: page } = await useAsyncData(`blog-${contentPath}`, () => {
  return queryCollection(`${locale.value}_pages`)
    .where('path', '=', contentPath)
    .first()
})

// Handle 404
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post tidak ditemukan', fatal: true })
}

// SEO
useSeoMeta({
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description,
  ogImage: page.value?.image,
})
</script>

<template>
  <UContainer class="py-12 md:py-20">
    <div v-if="page" class="max-w-3xl mx-auto">
      <!-- Back button -->
      <NuxtLink
        :to="locale === 'id' ? '/blog' : '/en/blog'"
        class="inline-flex items-center text-sm text-gray-500 hover:text-primary-500 transition-colors mb-8 group"
      >
        <UIcon name="i-heroicons-arrow-left" class="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Blog
      </NuxtLink>

      <!-- Header -->
      <header class="mb-10 text-center md:text-left">
        <div v-if="page.category" class="mb-4">
          <UBadge color="primary" variant="subtle" size="lg" class="rounded-full">
            {{ $t(`categories.${page.category}`) }}
          </UBadge>
        </div>

        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          {{ page.title }}
        </h1>

        <div class="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-500 text-sm">
          <div v-if="page.date" class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
            <time :datetime="page.date">{{ page.date }}</time>
          </div>
        </div>
      </header>

      <!-- Image -->
      <div v-if="page.image" class="mb-12 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
        <NuxtImg
          :src="page.image"
          :alt="page.title"
          class="w-full h-auto aspect-21/9 object-cover"
          width="800"
          height="343"
        />
      </div>

      <!-- Content -->
      <article class="prose prose-gray dark:prose-invert max-w-none prose-lg md:prose-xl prose-headings:font-bold prose-a:text-primary-500 hover:prose-a:text-primary-600 transition-colors prose-img:rounded-2xl shadow-sm">
        <ContentRenderer :value="page" />
      </article>

      <!-- Footer/Tags -->
      <footer v-if="page.tags && page.tags.length > 0" class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Tagar Terkait:
        </h4>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="tag in page.tags"
            :key="tag"
            color="neutral"
            variant="solid"
            size="sm"
            class="rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:text-primary-500 transition-all cursor-pointer"
          >
            #{{ tag }}
          </UBadge>
        </div>
      </footer>
    </div>
  </UContainer>
</template>
