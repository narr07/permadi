<script setup lang="ts">
import type { GalleryItem } from '~~/server/api/cloudinary-gallery.get'

const { t } = useI18n()
const img = useImage()

// Fetch gallery from Cloudinary API (cached server route)
const { data: galleries } = await useFetch<GalleryItem[]>('/api/cloudinary-gallery', {
  key: 'gallery-list',
  default: () => [],
})

// Extract all unique tags for filter
const allTags = computed(() => {
  const tagSet = new Set<string>()
  galleries.value?.forEach((gallery) => {
    gallery.tags?.forEach((tag: string) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
})

// Filter and pagination state
const selectedTag = ref<string | undefined>(undefined)
const currentPage = ref(1)
const itemsPerPage = 16

// Filtered galleries
const filteredGalleries = computed(() => {
  if (!galleries.value)
    return []
  let result = galleries.value
  if (selectedTag.value) {
    result = result.filter(gallery =>
      gallery.tags?.includes(selectedTag.value!),
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
watch(selectedTag, () => {
  currentPage.value = 1
})

function clearFilters() {
  selectedTag.value = undefined
}

const selectedGallery = ref<GalleryItem | null>(null)
const isModalOpen = ref(false)

// Track image loaded state for list items
const imageLoadedMap = reactive<Record<string, boolean>>({})
function onImageLoaded(key: string) {
  imageLoadedMap[key] = true
}

// Preload the first image for LCP optimization
watchEffect(() => {
  const firstGallery = filteredGalleries.value?.[0]
  if (firstGallery?.image) {
    const preloadUrl = img(firstGallery.image, { provider: 'cloudinary', width: 300, format: 'webp', quality: 80 } as any)
    useHead({
      link: [
        { rel: 'preload', as: 'image', href: preloadUrl, imagesrcset: img.getSizes(firstGallery.image, { provider: 'cloudinary', width: 300, format: 'webp', quality: 80 } as any).srcset },
      ],
    })
  }
})

function openGalleryModal(gallery: GalleryItem) {
  selectedGallery.value = gallery
  isModalOpen.value = true
}

watch(isModalOpen, (val) => {
  if (!val) {
    selectedGallery.value = null
  }
})
</script>

<template>
  <UPage class="space-y-6">
    <UPageHeader
      :title="t('gallery.title')"
      :description="t('gallery.description')"
      headline="Gallery"
    />
    <!-- Filter Section -->
    <div class="flex py-4 justify-end flex-wrap items-center gap-3">
      <USelectMenu
        v-model="selectedTag"
        :items="allTags"
        placeholder="Tag"
        class="w-48"
        icon="i-narr-filter"
      />
      <UButton
        v-if="selectedTag"
        size="sm"
        variant="ghost"
        color="neutral"
        icon="i-narr-close"
        @click="clearFilters"
      >
        {{ t('clear') || 'Clear' }}
      </UButton>
      <span v-if="selectedTag" class="text-sm text-gray-500">
        {{ filteredGalleries.length }} {{ t('images_found') || 'image(s) found' }}
      </span>
    </div>

    <!-- Gallery Masonry -->
    <div :key="`${currentPage}-${selectedTag}`" class="columns-2 md:columns-3 lg:columns-4 gap-4">
      <div
        v-for="(gallery, index) in paginatedGalleries"
        :key="gallery.public_id"
        class="group break-inside-avoid mb-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-500 transition-all hover:shadow"
      >
        <!-- Image (clickable to open modal) -->
        <div
          class="relative cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800"
          :style="{ aspectRatio: `${gallery.width} / ${gallery.height}` }"
          @click="openGalleryModal(gallery)"
        >
          <!-- Skeleton pulse placeholder (matches aspect-ratio) -->
          <div
            v-if="!imageLoadedMap[gallery.public_id] && index >= 4"
            class="absolute inset-0 animate-pulse bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center z-10"
          >
            <UIcon name="i-narr-loading" class="animate-spin size-6 text-gray-400 dark:text-gray-500" />
          </div>
          <!-- Image with blur-up loading effect -->
          <NuxtImg
            provider="cloudinary"
            :src="gallery.image"
            :alt="gallery.alt || gallery.title"
            format="webp"
            quality="80"
            width="300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            :loading="index < 4 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            class="w-full h-auto transform transition-all duration-500 group-hover:scale-110"
            :class="imageLoadedMap[gallery.public_id] || index < 4 ? 'opacity-100' : 'opacity-0'"
            @load="onImageLoaded(gallery.public_id)"
          />
          <!-- Overlay on Hover -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
            <div class="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 class="font-semibold line-clamp-1">
                {{ gallery.title }}
              </h3>
              <p v-if="gallery.tags?.length" class="text-xs text-gray-200 mt-1">
                {{ gallery.tags.join(', ') }}
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
    >
      <template #content>
        <NuxtImg
          provider="cloudinary"
          :src="selectedGallery.image"
          :alt="selectedGallery.alt || selectedGallery.title"
          format="webp"
          quality="90"
          width="900"
          densities="1x 2x"
          class="w-full h-auto max-h-[90vh] object-contain rounded-xl"
        />
      </template>
    </UModal>
  </UPage>
</template>
