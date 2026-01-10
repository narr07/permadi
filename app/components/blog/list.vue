<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()
const setI18nParams = useSetI18nParams()

// Reset params untuk halaman list (tidak pakai slug)
onMounted(() => {
  setI18nParams({})
})

const { data: blogs } = await useAsyncData(`blog-list-${locale.value}`, async () => {
  const collection = `blog_${locale.value}` as any
  return await queryCollection(collection)
    .order('date', 'DESC')
    .select('title', 'path', 'description', 'idBlog')
    .all()
}, {
  watch: [locale],
})

function getBlogLink(blog: any) {
  const slug = blog.path.split('/').pop()
  return localePath({ name: 'blog-slug', params: { slug } })
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <UCard v-for="blog in blogs" :key="blog.path" class="relative">
      <NuxtLink :to="getBlogLink(blog)" class="focus:outline-none" tabindex="-1">
        <span class="absolute inset-0" aria-hidden="true" />
      </NuxtLink>
      <div class="hidden">
        {{ blog.path }}
      </div>

      <template #header>
        <h2 class="text-xl font-bold leading-tight">
          {{ blog.title }}
        </h2>
      </template>

      <p class="text-gray-500 dark:text-gray-400 line-clamp-2">
        {{ blog.description }}
      </p>

      <template #footer>
        <div class="flex items-center justify-between gap-3">
          <UBadge variant="subtle" color="neutral">
            ID: {{ blog.idBlog }}
          </UBadge>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-right-20-solid"
            trailing
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
