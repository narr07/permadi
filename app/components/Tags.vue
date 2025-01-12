<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()
const { t } = useI18n()
const { data: blogs } = await useAsyncData(route.path, () => {
  return queryCollection(`blog_${locale.value}`).all()
})

// Mengumpulkan semua tag dari blog
const tags = computed<string[]>(() => {
  const allTags = new Set<string>()
  blogs.value?.forEach((blog) => {
    if (blog.tags) {
      blog.tags.forEach(tag => allTags.add(tag))
    }
  })
  return Array.from(allTags)
})
</script>

<template>
  <div
    v-motion
    :initial="{
      opacity: 0,
      y: 50,
    }"
    :visible="{
      opacity: 1,
      y: 0,
    }" class="flex w-full justify-end items-center"
  >
    <UCollapsible class="flex flex-col gap-2 w-48">
      <UButton
        :label="t('blog.tags')"
        color="neutral"
        variant="subtle"
        trailing-icon="i-lucide-chevron-down"
        block
      />

      <template #content>
        <div class="flex flex-col gap-1">
          <div v-for="tag in tags" :key="tag">
            <UButton class="ring-2 gap-2" size="xs" :to="localePath(`/blog/tags/${tag}`)">
              {{ tag }}
            </UButton>
          </div>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
