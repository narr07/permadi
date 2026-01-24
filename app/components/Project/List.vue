<script setup lang="ts">
const { locale, t } = useI18n()

const { data: projects } = await useAsyncData(`project-list-${locale.value}`, async () => {
  const collection = `${locale.value}_project` as any
  return await queryCollection(collection)
    .order('featured', 'DESC')
    .all()
}, {
  watch: [locale],
})

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
const itemsPerPage = 6

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

const selectedProject = ref<any>(null)
const isModalOpen = ref(false)

function openProjectModal(project: any) {
  selectedProject.value = project
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedProject.value = null
}
</script>

<template>
  <div class="space-y-6 my-12">
    <!-- Filter Section -->
    <div class="flex flex-wrap items-center gap-3">
      <USelectMenu
        v-model="selectedTech"
        :items="allTech"
        :placeholder="t('filter_by_tech') || 'Filter by tech...'"
        class="w-48"
        icon="i-heroicons-funnel"
      />
      <UButton
        v-if="selectedTech"
        size="sm"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-x-mark-20-solid"
        @click="selectedTech = undefined"
      >
        {{ t('clear') || 'Clear' }}
      </UButton>
      <span v-if="selectedTech" class="text-sm text-gray-500">
        {{ filteredProjects.length }} {{ t('projects_found') || 'project(s) found' }}
      </span>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="project in paginatedProjects"
        :key="project.stem"
        class="cursor-pointer hover:shadow-lg transition-shadow"
        @click="openProjectModal(project)"
      >
        <template #header>
          <div class="relative w-full h-48 -m-4 mb-4 overflow-hidden">
            <NuxtImg
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover"
            />
          </div>
          <h2 class="text-xl font-bold leading-tight mt-2">
            {{ project.title }}
          </h2>
        </template>

        <p v-if="project.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {{ project.description }}
        </p>

        <template #footer>
          <div class="flex items-center justify-between gap-3">
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
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-arrow-right-20-solid"
              trailing
            />
          </div>
        </template>
      </UCard>
    </div>

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

    <!-- Project Detail Modal -->
    <UModal
      v-if="selectedProject"
      v-model:open="isModalOpen"
      :title="selectedProject.title"
      :ui="{ footer: 'justify-between' }"
    >
      <template #body>
        <div class="space-y-6">
          <!-- Project Image -->
          <div class="relative w-full h-64 rounded-lg overflow-hidden">
            <NuxtImg
              :src="selectedProject.image"
              :alt="selectedProject.title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Description -->
          <div v-if="selectedProject.description">
            <p class="text-gray-600 dark:text-gray-400">
              {{ selectedProject.description }}
            </p>
          </div>

          <!-- Tech Used -->
          <div v-if="selectedProject.tech && selectedProject.tech.length">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {{ t('tech_used') || 'Technologies' }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="item in selectedProject.tech"
                :key="item"
                variant="soft"
                color="neutral"
              >
                {{ item }}
              </UBadge>
            </div>
          </div>

          <!-- Featured Badge -->
          <div v-if="selectedProject.featured">
            <UBadge variant="solid" color="warning">
              {{ t('featured') || 'Featured' }}
            </UBadge>
          </div>
        </div>
      </template>

      <template #footer>
        <UButton
          v-if="selectedProject.link"
          :to="selectedProject.link"
          target="_blank"
          color="primary"
          icon="i-heroicons-arrow-top-right-on-square-20-solid"
          trailing
        >
          {{ t('view_project') || 'View Project' }}
        </UButton>
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
