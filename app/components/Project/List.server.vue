<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()
const img = useImage()

const { data: projects } = await useAsyncData(`project-list-${locale.value}`, async () => {
  const collection = `${locale.value}_project` as any
  try {
    return await queryCollection(collection)
      .order('stem', 'DESC')
      .all()
  }
  catch (e) {
    console.error('Error querying projects:', e)
    return []
  }
}, {
  watch: [locale],
})

// Generate slug from stem (e.g., "id/projek/1.sdnteja2" → "sdnteja2")
function stemToSlug(stem: string): string {
  const parts = stem.split('/')
  const filename = parts[parts.length - 1] || ''
  return filename.replace(/^\d+\./, '')
}

// Extract all unique tech for filter
const allTech = computed(() => {
  const techSet = new Set<string>()
  projects.value?.forEach((project) => {
    project.tech?.forEach((item: string) => techSet.add(item))
  })
  return Array.from(techSet).sort()
})

// Filter and pagination state
const selectedTech = ref<string | undefined>(undefined)
const currentPage = ref(1)
const itemsPerPage = 12

// Filtered projects
const filteredProjects = computed(() => {
  if (!projects.value)
    return []
  if (!selectedTech.value)
    return projects.value
  return projects.value.filter(project =>
    project.tech?.includes(selectedTech.value!),
  )
})

// Paginated projects
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProjects.value.slice(start, end)
})

// Reset page when filter changes
watch(selectedTech, () => {
  currentPage.value = 1
})

// Track image loaded state for list items
const imageLoadedMap = reactive<Record<string, boolean>>({})
function onImageLoaded(key: string) {
  imageLoadedMap[key] = true
}

// Preload the first image for LCP optimization
watchEffect(() => {
  const firstProject = filteredProjects.value?.[0]
  if (firstProject?.image) {
    const preloadUrl = img(firstProject.image, { width: 600, format: 'webp', quality: 100 } as any)
    useHead({
      link: [
        { rel: 'preload', as: 'image', href: preloadUrl, imagesrcset: img.getSizes(firstProject.image, { width: 600, format: 'webp' } as any).srcset },
      ],
    })
  }
})
</script>

<template>
  <UPage class="space-y-6">
    <UPageHeader
      :title="t('project.title')"
      :description="t('project.description')"
      headline="Project"
    />
    <!-- Filter Section -->
    <div class="flex flex-wrap py-4 justify-end items-center gap-3">
      <USelectMenu
        v-model="selectedTech"
        :items="allTech"
        placeholder="Tags"
        class="w-48"
        icon="i-narr-filter"
      />
      <UButton
        v-if="selectedTech"
        size="sm"
        variant="ghost"
        color="neutral"
        icon="i-narr-close"
        @click="selectedTech = undefined"
      >
        {{ t('clear') || 'Clear' }}
      </UButton>
      <span v-if="selectedTech" class="text-sm text-gray-500">
        {{ filteredProjects.length }} {{ t('projects_found') || 'project(s) found' }}
      </span>
    </div>

    <!-- Projects Grid -->
    <UBlogPosts>
      <NuxtLink
        v-for="(project, index) in paginatedProjects"
        :key="project.stem"
        :to="localePath(`/projek/${stemToSlug(project.stem)}`)"
        class="block"
      >
        <UBlogPost
          :title="project.title"
          variant="outline"
          class="cursor-pointer group/project-card h-full"
        >
          <template #header>
            <div class="relative overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800">
              <NuxtImg
                :src="project.image"
                :alt="project.title"
                format="webp"
                quality="80"
                width="600"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                :placeholder="project.image && index > 0 ? img(project.image, { height: 20, width: 35, format: 'webp', blur: 5, quality: 30 } as any) : undefined"
                class="object-cover object-top w-full h-full transform transition-all duration-500 group-hover/project-card:scale-110"
                :class="imageLoadedMap[project.stem] || index === 0 ? 'blur-0' : 'blur-xl scale-105'"
                @load="onImageLoaded(project.stem)"
                @error="onImageLoaded(project.stem)"
              />
            </div>
          </template>

          <template #badge>
            <div class="flex flex-wrap gap-1">
              <UBadge
                v-for="item in project.tech?.slice(0, 2)"
                :key="item"
                variant="subtle"
                color="primary"
                size="xs"
              >
                {{ item }}
              </UBadge>
              <UBadge v-if="project.tech?.length > 2" variant="subtle" color="neutral" size="xs">
                +{{ project.tech.length - 2 }}
              </UBadge>
            </div>
          </template>
        </UBlogPost>
      </NuxtLink>
    </UBlogPosts>

    <!-- Empty State -->
    <div v-if="paginatedProjects.length === 0" class="text-center py-12 text-gray-500">
      {{ t('no_projects_found') || 'No projects found matching the selected filter.' }}
    </div>

    <!-- Pagination -->
    <div v-if="filteredProjects.length > itemsPerPage" class="flex justify-center pt-6">
      <UPagination
        v-model:page="currentPage"
        :total="filteredProjects.length"
        :items-per-page="itemsPerPage"
        show-edges
      />
    </div>
  </UPage>
</template>
