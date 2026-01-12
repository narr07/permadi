<script setup lang="ts">
const { locale } = useI18n()

const { data: galleries } = await useAsyncData(`gallery-list-${locale.value}`, async () => {
  const collection = `gallery_${locale.value}` as any
  return await queryCollection(collection)
    .order('date', 'DESC')
    .all()
}, {
  watch: [locale],
})

// Extract all unique tools for filter
const allTools = computed(() => {
  const toolsSet = new Set<string>()
  galleries.value?.forEach((gallery) => {
    gallery.tools?.forEach((tool: string) => toolsSet.add(tool))
  })
  return Array.from(toolsSet).sort()
})

// Filter and pagination state
const selectedTool = ref<string | undefined>(undefined)
const currentPage = ref(1)
const itemsPerPage = 10

// Filtered galleries
const filteredGalleries = computed(() => {
  if (!galleries.value)
    return []
  if (!selectedTool.value)
    return galleries.value
  return galleries.value.filter(gallery =>
    gallery.tools?.includes(selectedTool.value!),
  )
})

// Paginated galleries
const paginatedGalleries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredGalleries.value.slice(start, end)
})

// Reset page when filter changes
watch(selectedTool, () => {
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
  <div class="space-y-6">
    <!-- Filter Section -->
    <div class="flex flex-wrap items-center gap-3">
      <USelectMenu
        v-model="selectedTool"
        :items="allTools"
        placeholder="Filter by editing tools..."
        class="w-56"
        icon="i-heroicons-funnel"
        :search-input="{ placeholder: 'Search tools...' }"
      />
      <UButton
        v-if="selectedTool"
        size="sm"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-x-mark-20-solid"
        @click="selectedTool = undefined"
      >
        Clear
      </UButton>
      <span v-if="selectedTool" class="text-sm text-gray-500">
        {{ filteredGalleries.length }} image(s) found
      </span>
    </div>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="gallery in paginatedGalleries"
        :key="gallery.stem"
        class="group relative cursor-pointer overflow-hidden rounded-lg border border-default hover:border-primary transition-all hover:shadow-lg"
        @click="openGalleryModal(gallery)"
      >
        <!-- Image -->
        <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <NuxtImg
            :src="gallery.image"
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
                {{ gallery.category }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="paginatedGalleries.length === 0" class="text-center py-12 text-gray-500">
      No images found matching the selected filter.
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

    <!-- Gallery Detail Modal -->
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
              :src="selectedGallery.image"
              :alt="selectedGallery.title"
              class="max-w-full max-h-full object-contain"
            />
          </div>

          <!-- Details -->
          <div class="space-y-4">
            <!-- Category -->
            <div v-if="selectedGallery.category">
              <UBadge variant="subtle" color="primary">
                {{ selectedGallery.category }}
              </UBadge>
            </div>

            <!-- Description -->
            <div>
              <p class="text-gray-700 dark:text-gray-300">
                {{ selectedGallery.description }}
              </p>
            </div>

            <!-- Tools Used -->
            <div v-if="selectedGallery.tools && selectedGallery.tools.length">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Editing Tools
              </h4>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="tool in selectedGallery.tools"
                  :key="tool"
                  variant="soft"
                  color="neutral"
                  size="sm"
                >
                  {{ tool }}
                </UBadge>
              </div>
            </div>

            <!-- Date -->
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ new Date(selectedGallery.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) }}
              </p>
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
          Close
        </UButton>
      </template>
    </UModal>
  </div>
</template>
