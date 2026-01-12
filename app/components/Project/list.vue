<script setup lang="ts">
const { locale } = useI18n()

const { data: projects } = await useAsyncData(`project-list-${locale.value}`, async () => {
  const collection = `project_${locale.value}` as any
  return await queryCollection(collection)
    .order('date', 'DESC')
    .all()
}, {
  watch: [locale],
})

// Extract all unique tools for filter
const allTools = computed(() => {
  const toolsSet = new Set<string>()
  projects.value?.forEach((project) => {
    project.tools?.forEach((tool: string) => toolsSet.add(tool))
  })
  return Array.from(toolsSet).sort()
})

// Filter and pagination state
const selectedTool = ref<string | undefined>(undefined)
const currentPage = ref(1)
const itemsPerPage = 10

// Filtered projects
const filteredProjects = computed(() => {
  if (!projects.value)
    return []
  if (!selectedTool.value)
    return projects.value
  return projects.value.filter(project =>
    project.tools?.includes(selectedTool.value!),
  )
})

// Paginated projects
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProjects.value.slice(start, end)
})

// Reset page when filter changes
watch(selectedTool, () => {
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
  <div class="space-y-6">
    <!-- Filter Section -->
    <div class="flex flex-wrap items-center gap-3">
      <USelectMenu
        v-model="selectedTool"
        :items="allTools"
        placeholder="Filter by tools..."
        class="w-48"
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
        {{ filteredProjects.length }} project(s) found
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

        <template #footer>
          <div class="flex items-center justify-between gap-3">
            <UBadge variant="subtle" color="primary">
              {{ project.category }}
            </UBadge>
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
      No projects found matching the selected filter.
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
          <!-- Category Badge -->
          <div>
            <UBadge variant="subtle" color="primary">
              {{ selectedProject.category }}
            </UBadge>
          </div>

          <!-- Project Image -->
          <div class="relative w-full h-64 rounded-lg overflow-hidden">
            <NuxtImg
              :src="selectedProject.image"
              :alt="selectedProject.title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Tools Used -->
          <div v-if="selectedProject.tools && selectedProject.tools.length">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tools & Technologies
            </h3>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tool in selectedProject.tools"
                :key="tool"
                variant="soft"
                color="neutral"
              >
                {{ tool }}
              </UBadge>
            </div>
          </div>

          <!-- Date -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Date
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ new Date(selectedProject.date).toLocaleDateString(locale, { year: 'numeric', month: 'long' }) }}
            </p>
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
          View Project
        </UButton>
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
