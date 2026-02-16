<script setup lang="ts">
import { Motion } from 'motion-v'

const { locale, t } = useI18n()

// Tool icon mapping
const toolIconMap: Record<string, { icon: string, label: string }> = {
  illustator: { icon: 'i-narr-d-illustrator', label: 'Illustrator' },
  photoshop: { icon: 'i-narr-d-photoshop', label: 'Photoshop' },
  affinity: { icon: 'i-narr-d-affinity', label: 'Affinity' },
  lightroom: { icon: 'i-narr-d-lightroom', label: 'Lightroom' },
  canva: { icon: 'i-narr-d-canva', label: 'Canva' },
  figma: { icon: 'i-narr-d-figma', label: 'Figma' },
}

const { data: galleries } = await useAsyncData(`gallery-list-${locale.value}`, async () => {
  const collection = `${locale.value}_gallery` as any
  return await queryCollection(collection).all()
}, {
  watch: [locale],
})

// Gallery likes
const { fetchLikes, addLike, getCount, isLikeSubmitting } = useGalleryLikes()

// Fetch likes when galleries load
watch(galleries, (items) => {
  if (items?.length) {
    fetchLikes(items.map(g => g.stem))
  }
}, { immediate: true })

// Extract all unique categories for filter
const allCategories = computed(() => {
  const categorySet = new Set<string>()
  galleries.value?.forEach((gallery) => {
    if (gallery.category) {
      gallery.category.forEach((cat: string) => categorySet.add(cat))
    }
  })
  return Array.from(categorySet).sort()
})

// Extract all unique tools for filter
const allTools = computed(() => {
  const toolSet = new Set<string>()
  galleries.value?.forEach((gallery) => {
    if (gallery.tools) {
      toolSet.add(gallery.tools)
    }
  })
  return Array.from(toolSet).sort().map(tool => ({
    value: tool,
    label: toolIconMap[tool]?.label || tool,
  }))
})

// Filter and pagination state
const selectedCategory = ref<string | undefined>(undefined)
const selectedTool = ref<string | undefined>(undefined)
const currentPage = ref(1)
const itemsPerPage = 12

// Filtered galleries
const filteredGalleries = computed(() => {
  if (!galleries.value)
    return []
  let result = galleries.value
  if (selectedCategory.value) {
    result = result.filter(gallery =>
      gallery.category?.includes(selectedCategory.value!),
    )
  }
  if (selectedTool.value) {
    result = result.filter(gallery =>
      gallery.tools === selectedTool.value,
    )
  }
  return result
})

// Paginated galleries
const paginatedGalleries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredGalleries.value.slice(start, end)
})

// Reset page when filter changes
watch([selectedCategory, selectedTool], () => {
  currentPage.value = 1
})

function clearFilters() {
  selectedCategory.value = undefined
  selectedTool.value = undefined
}

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
const img = useImage()
</script>

<template>
  <div class="space-y-6 my-12">
    <!-- Filter Section -->
    <div class="flex flex-wrap items-center gap-3">
      <USelectMenu
        v-model="selectedCategory"
        :items="allCategories"
        placeholder="Tag"
        class="w-48"
        icon="i-heroicons-funnel"
      />
      <USelectMenu
        v-model="selectedTool"
        :items="allTools"
        value-key="value"
        label-key="label"
        placeholder="Tools"
        class="w-48"
        icon="i-heroicons-wrench-screwdriver"
      />
      <UButton
        v-if="selectedCategory || selectedTool"
        size="sm"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-x-mark-20-solid"
        @click="clearFilters"
      >
        {{ t('clear') || 'Clear' }}
      </UButton>
      <span v-if="selectedCategory || selectedTool" class="text-sm text-gray-500">
        {{ filteredGalleries.length }} {{ t('images_found') || 'image(s) found' }}
      </span>
    </div>

    <!-- Gallery Masonry -->
    <UPageColumns>
      <Motion
        v-for="(gallery, index) in paginatedGalleries"
        :key="gallery.stem"
        :initial="{ opacity: 0, transform: 'scale(0.95)' }"
        :in-view="{ opacity: 1, transform: 'scale(1)' }"
        :transition="{ delay: 0.05 * index, duration: 0.4 }"
      >
        <div
          class="group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-500 transition-all hover:shadow-lg"
        >
          <!-- Image (clickable to open modal) -->
          <div
            class="relative cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800"
            @click="openGalleryModal(gallery)"
          >
            <NuxtImg
              :src="gallery.image"
              :alt="gallery.title"
              format="webp"
              :placeholder="img(gallery.image, { h: 15, w: 25, f: 'webp', blur: 5, q: 10 })"
              class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            <!-- Overlay on Hover -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
              <div class="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 class="font-semibold line-clamp-1">
                  {{ gallery.title }}
                </h3>
                <p v-if="gallery.category" class="text-xs text-gray-200 mt-1">
                  {{ gallery.category.join(', ') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Footer: Tool Icon + Like Button -->
          <div class="flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-900">
            <!-- Tool Icon (Left) -->
            <div v-if="gallery.tools && toolIconMap[gallery.tools]" class="flex items-center gap-1.5">
              <UTooltip :text="toolIconMap[gallery.tools].label">
                <UIcon
                  :name="toolIconMap[gallery.tools].icon"
                  class="size-4"
                  :class="toolIconMap[gallery.tools].color"
                />
              </UTooltip>
            </div>
            <div v-else />

            <!-- Like Button (Right) -->
            <button
              :disabled="isLikeSubmitting(gallery.stem)"
              class="group/like flex items-center gap-1.5 text-sm transition-all duration-200 rounded-full px-2 py-1 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95"
              :class="isLikeSubmitting(gallery.stem) ? 'opacity-50' : ''"
              @click.stop="addLike(gallery.stem)"
            >
              <UIcon
                name="i-lucide-heart"
                class="size-4 transition-transform duration-200 group-hover/like:scale-110"
                :class="isLikeSubmitting(gallery.stem) ? 'animate-pulse' : ''"
              />
              <span class="text-xs font-medium tabular-nums">
                {{ getCount(gallery.stem) }}
              </span>
            </button>
          </div>
        </div>
      </Motion>
    </UPageColumns>
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
    >
      <template #body>
        <div class="space-y-6">
          <!-- Full Image -->
          <div class="relative w-full flex items-center justify-center bg-black rounded-lg overflow-hidden" style="max-height: 70vh;">
            <NuxtImg
              :src="selectedGallery.image"
              :alt="selectedGallery.title"
              class="max-w-full max-h-full object-contain"
              :placeholder="img(selectedGallery.image, { h: 35, w: 25, f: 'webp', blur: 5, q: 10 })"
            />
          </div>

          <!-- Details -->
          <div class="space-y-4">
            <!-- Category -->
            <div v-if="selectedGallery.category?.length" class="flex flex-wrap gap-2">
              <UBadge v-for="cat in selectedGallery.category" :key="cat" variant="subtle" color="primary">
                {{ cat }}
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
