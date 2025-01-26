<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()
const { t } = useI18n()
const { data: blogs } = await useAsyncData(route.path, () => {
  return queryCollection(`blog_${locale.value}`).all()
})

// Mengambil satu tag dari setiap artikel
const tags = computed<string[]>(() => {
  const selectedTags = new Set<string>()
  blogs.value?.forEach((blog) => {
    if (blog.tags && blog.tags.length > 0) {
      // Ambil hanya tag pertama dari setiap artikel
      if (blog.tags[0]) {
        selectedTags.add(blog.tags[0])
      }
    }
  })
  return Array.from(selectedTags)
})
const open = ref(false)
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
    <UCollapsible v-model:open="open" class="flex flex-col gap-2 w-48">
      <UButton
        aria-label="Tag"
        :label="t('blog.tags')"
        :trailing-icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
        block
      />

      <template #content>
        <div class="flex flex-col gap-1">
          <!-- Tampilkan setiap tag yang dipilih -->
          <div v-for="tag in tags" :key="tag">
            <UButton :aria-label="tag" class="  gap-2" size="xs" :to="localePath(`/blog/tags/${tag}`)">
              {{ tag }}
            </UButton>
          </div>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
