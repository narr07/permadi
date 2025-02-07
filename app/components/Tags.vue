// app/components/Tags.vue

<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const open = ref(false)

// Shortcut untuk toggle popover
defineShortcuts({
  o: () => open.value = !open.value,
})

// Fetch blog data dengan penanganan kesalahan
const { data: blogs, error } = await useAsyncData(route.path, () => {
  return queryCollection(`blog_${locale.value}`).all()
}, {
  watch: [locale],
})

// Tangani kesalahan jika ada
if (error.value) {
  console.error('Error fetching blog data:', error.value)
}

// Mengambil satu tag dari setiap artikel
const tags = computed<string[]>(() => {
  const selectedTags = new Set<string>()
  blogs.value?.forEach((blog) => {
    if (blog.tags?.length) {
      const firstTag = blog.tags[0]
      // Hanya tambahkan jika firstTag bukan undefined
      if (firstTag) {
        selectedTags.add(firstTag)
      }
    }
  })
  return Array.from(selectedTags)
})
</script>

<template>
  <div class="flex w-full justify-end items-center">
    <UPopover v-model:open="open">
      <UButton
        aria-label="Tag"
        :label="t('blog.tags')"
        :trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        color="neutral"
      />

      <template #content>
        <div class="p-2 flex flex-col gap-1 min-w-48">
          <div v-if="tags.length === 0" class="text-gray-500 text-xs">
            {{ t('blog.noTags') }} <!-- Pesan ketika tidak ada tag -->
          </div>
          <div v-for="tag in tags" :key="tag">
            <UButton
              :aria-label="tag"
              class="w-full text-left"
              size="xs"
              variant="ghost"
              :to="localePath(`/blog/tags/${tag}`)"
            >
              {{ tag }}
            </UButton>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>
