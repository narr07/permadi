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
const { fetchLikes, addLike, getCount, isLikeSubmitting, isLoading: likesLoading } = useGalleryLikes()

// Fetch likes when galleries load
watch(galleries, (items) => {
  if (items?.length) {
    fetchLikes(items.map(g => getImageKey(g.image)))
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
    icon: toolIconMap[tool]?.icon || 'i-narr-tools',
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

// Track image loaded state for list items
const imageLoadedMap = reactive<Record<string, boolean>>({})
function onImageLoaded(key: string) {
  imageLoadedMap[key] = true
}

// Track modal image loaded state
const modalImageLoaded = ref(false)

function openGalleryModal(gallery: any) {
  selectedGallery.value = gallery
  modalImageLoaded.value = false
  isModalOpen.value = true
}

watch(isModalOpen, (val) => {
  if (!val) {
    selectedGallery.value = null
  }
})
const img = useImage()

// Reconstruct full Cloudinary URL for likes API key (backward compatibility)
const CLOUDINARY_BASE = 'https://res.cloudinary.com/daton7ry4/image/upload'
function getImageKey(imagePath: string): string {
  if (imagePath.startsWith('http'))
    return imagePath
  return `${CLOUDINARY_BASE}${imagePath}`
}
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
        icon="i-narr-filter"
      />
      <USelectMenu
        v-model="selectedTool"
        :items="allTools"
        value-key="value"
        label-key="label"
        placeholder="Tools"
        class="w-48"
      />
      <UButton
        v-if="selectedCategory || selectedTool"
        size="sm"
        variant="ghost"
        color="neutral"
        icon="i-narr-close"
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
          class="group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-500 transition-all hover:shadow"
        >
          <!-- Image (clickable to open modal) -->
          <div
            class="relative cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800"
            @click="openGalleryModal(gallery)"
          >
            <!-- Skeleton placeholder while image is loading -->
            <USkeleton
              v-if="!imageLoadedMap[gallery.stem]"
              class="w-full aspect-3/4 absolute inset-0 z-10"
            />
            <NuxtImg
              provider="cloudinary"
              :src="gallery.image"
              :alt="gallery.title"
              format="webp"
              quality="80"
              width="400"
              densities="1x 2x"
              :placeholder="img(gallery.image, { height: 35, width: 25, format: 'webp', blur: 5, quality: 30 })"
              class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
              :class="imageLoadedMap[gallery.stem] ? 'opacity-100' : 'opacity-0'"
              loading="lazy"
              @load="onImageLoaded(gallery.stem)"
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
              <UTooltip :text="toolIconMap[gallery.tools!]?.label">
                <UIcon
                  :name="toolIconMap[gallery.tools!]?.icon"
                />
              </UTooltip>
            </div>
            <div v-else />
            <!-- Like Button (Right) -->
            <USkeleton v-if="likesLoading" class="h-8 w-14 rounded-md" />
            <UButton
              v-else
              :icon="isLikeSubmitting(getImageKey(gallery.image)) ? 'i-narr-loading' : 'i-narr-love'"
              :label="String(getCount(getImageKey(gallery.image)) || 0)"
              color="neutral"
              size="sm"
              variant="subtle"
              :class="{ 'animate-pulse': isLikeSubmitting(getImageKey(gallery.image)) }"
              :disabled="isLikeSubmitting(getImageKey(gallery.image))"
              @click.stop="addLike(getImageKey(gallery.image))"
            />
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
        <div class="relative w-full flex items-center justify-center rounded-xl overflow-hidden shadow" style="max-height: 75vh;">
          <!-- Skeleton placeholder for modal image -->
          <div v-if="!modalImageLoaded" class="w-full flex flex-col items-center justify-center gap-3 py-12">
            <USkeleton class="w-full aspect-thumbnail rounded-lg" />
          </div>
          <NuxtImg
            provider="cloudinary"
            :src="selectedGallery.image"
            :alt="selectedGallery.title"
            format="webp"
            quality="90"
            width="900"
            densities="1x 2x"
            class="max-w-full max-h-full object-contain transition-opacity duration-300"
            :class="modalImageLoaded ? 'opacity-100' : 'opacity-0 absolute'"
            :placeholder="img(selectedGallery.image, { height: 50, width: 25, format: 'webp', blur: 5, quality: 30 })"
            @load="modalImageLoaded = true"
          />
        </div>
      </template>

      <template #footer>
        <div class="flex flex-wrap items-center justify-between w-full gap-4">
          <!-- Categories -->
          <div v-if="selectedGallery.category?.length" class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="cat in selectedGallery.category"
              :key="cat"
              variant="subtle"
              color="primary"
            >
              {{ cat }}
            </UBadge>
          </div>

          <!-- Tool -->
          <div v-if="selectedGallery.tools && toolIconMap[selectedGallery.tools]" class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <UTooltip :text="toolIconMap[selectedGallery.tools]?.label">
              <UIcon
                :name="toolIconMap[selectedGallery.tools]?.icon"
              />
            </UTooltip>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
