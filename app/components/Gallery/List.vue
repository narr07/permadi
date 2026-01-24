<script setup lang="ts">
const { locale, t } = useI18n()

const { data: galleries } = await useAsyncData(`gallery-list-${locale.value}`, async () => {
  const collection = `${locale.value}_gallery` as any
  return await queryCollection(collection).all()
}, {
  watch: [locale],
})

// Extract all unique categories for filter
const allCategories = computed(() => {
  const categorySet = new Set<string>()
  galleries.value?.forEach((gallery) => {
    if (gallery.category)
      categorySet.add(gallery.category)
  })
  return Array.from(categorySet).sort()
})

// Filter and pagination state
const selectedCategory = ref<string | undefined>(undefined)
const currentPage = ref(1)
const itemsPerPage = 12

// Filtered galleries
const filteredGalleries = computed(() => {
  if (!galleries.value)
    return []
  if (!selectedCategory.value)
    return galleries.value
  return galleries.value.filter(gallery =>
    gallery.category === selectedCategory.value,
  )
})

// Paginated galleries
const paginatedGalleries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredGalleries.value.slice(start, end)
})

// Reset page when filter changes
watch(selectedCategory, () => {
  currentPage.value = 1
})

const selectedGallery = ref<any>(null)
const isModalOpen = ref(false)

function openGalleryModal(gallery: any) {
  selectedGallery.value = gallery
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedGallery.value = null
}
</script>

<template>
  <div class="space-y-6 my-12">
    <!-- Filter Section -->
    <div class="flex flex-wrap items-center gap-3">
      <USelectMenu
        v-model="selectedCategory"
        :items="allCategories"
        :placeholder="t('filter_by_category') || 'Filter by category...'"
        class="w-56"
        icon="i-heroicons-funnel"
      />
      <UButton
        v-if="selectedCategory"
        size="sm"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-x-mark-20-solid"
        @click="selectedCategory = undefined"
      >
        {{ t('clear') || 'Clear' }}
      </UButton>
      <span v-if="selectedCategory" class="text-sm text-gray-500">
        {{ filteredGalleries.length }} {{ t('images_found') || 'image(s) found' }}
      </span>
    </div>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="gallery in paginatedGalleries"
        :key="gallery.stem"
        class="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-500 transition-all hover:shadow-lg"
        @click="openGalleryModal(gallery)"
      >
        <!-- Image -->
        <div class="relative overflow-hidden bg-gray-100 dark:bg-gray-800" :style="{ aspectRatio: gallery.aspectRatio || '1/1' }">
          <NuxtImg
            :src="gallery.imageUrl"
            :alt="gallery.title"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
          <!-- Overlay on Hover -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
            <div class="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 class="font-semibold line-clamp-1">
                {{ gallery.title }}
              </h3>
              <p v-if="gallery.category" class="text-xs text-gray-200 mt-1">
                {{ $t(`categories.${gallery.category}`) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="paginatedGalleries.length === 0" class="text-center py-12 text-gray-500">
      {{ t('no_images_found') || 'No images found matching the selected filter.' }}
    </div>

    <!-- Pagination -->
    <div v-if="filteredGalleries.length > itemsPerPage" class="flex justify-center pt-6">
      <UPagination
        v-model:page="currentPage"
        :total="filteredGalleries.length"
        :items-per-page="itemsPerPage"
        show-edges
      />
    </div>

    <!-- Gallery Detail Modal (Lightbox) -->
    <UModal
      v-if="selectedGallery"
      v-model:open="isModalOpen"
      :title="selectedGallery.title"
      fullscreen
    >
      <template #body>
        <div class="space-y-6">
          <!-- Full Image -->
          <div class="relative w-full flex items-center justify-center bg-black rounded-lg overflow-hidden" style="max-height: 70vh;">
            <NuxtImg
              :src="selectedGallery.imageUrl"
              :alt="selectedGallery.title"
              class="max-w-full max-h-full object-contain"
            />
          </div>

          <!-- Details -->
          <div class="space-y-4">
            <!-- Category -->
            <div v-if="selectedGallery.category">
              <UBadge variant="subtle" color="primary">
                {{ $t(`categories.${selectedGallery.category}`) }}
              </UBadge>
            </div>

            <!-- Title -->
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ selectedGallery.title }}
              </h3>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <UButton
          color="neutral"
          variant="ghost"
          @click="closeModal"
        >
          {{ t('close') || 'Close' }}
        </UButton>
      </template>
    </UModal>
  </div>
</template>
