<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const open = ref(false)

// Shortcut untuk toggle popover
defineShortcuts({
  o: () => open.value = !open.value,
})

// Fetch blog data
const { data: blogs } = await useAsyncData(route.path, () => {
  return queryCollection(`blog_${locale.value}`).all()
}, {
  watch: [locale],
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
</script>

<template>
  <div

    class="flex w-full justify-end items-center"
  >
    <UPopover v-model:open="open">
      <UButton
        aria-label="Tag"
        :label="t('blog.tags')"
        :trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        color="neutral"
      />

      <template #content>
        <div class="p-2 flex flex-col gap-1 min-w-48">
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
