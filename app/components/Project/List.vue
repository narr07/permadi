<script setup lang="ts">
const { locale } = useI18n()
const isOpen = ref(false)
const selectedProject = ref<any>(null)

const { data: projects } = await useAsyncData(`project-list-${locale.value}`, () => {
  return queryCollection(`${locale.value}_project`)
    .order('featured', 'DESC')
    .all()
})

// eslint-disable-next-line antfu/top-level-function
const openModal = (project: any) => {
  selectedProject.value = project
  isOpen.value = true
}
</script>

<template>
  <div class="project-list-container my-12">
    <div v-if="projects && projects.length > 0" class="grid gap-6 grid-cols-1 md:grid-cols-2">
      <div
        v-for="project in projects"
        :key="project.id"
        class="group relative overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-primary-500/50"
        @click="openModal(project)"
      >
        <!-- Overlay for better text readability -->
        <div class="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent opacity-60 z-10 transition-opacity group-hover:opacity-80" />

        <NuxtImg
          v-if="project.image"
          :src="project.image"
          :alt="project.title"
          class="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div class="absolute bottom-0 left-0 right-0 p-8 z-20 transform transition-transform duration-300 group-hover:-translate-y-2">
          <div class="flex flex-wrap gap-2 mb-3">
            <UBadge
              v-for="tag in project.tech.slice(0, 3)"
              :key="tag"
              variant="solid"
              color="primary"
              size="xs"
              class="rounded-full px-2 backdrop-blur-md bg-primary-500/80"
            >
              {{ tag }}
            </UBadge>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">
            {{ project.title }}
          </h3>
          <p class="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {{ project.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal Detail -->
    <UModal v-model="isOpen" :transition="false" class="sm:max-w-2xl">
      <template #content>
        <div v-if="selectedProject" class="p-0 overflow-hidden bg-white dark:bg-gray-900 rounded-3xl">
          <div class="relative h-64 md:h-80">
            <NuxtImg
              :src="selectedProject.image"
              :alt="selectedProject.title"
              class="w-full h-full object-cover"
            />
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-heroicons-x-mark"
              class="absolute top-4 right-4 rounded-full shadow-lg"
              @click="isOpen = false"
            />
          </div>

          <div class="p-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">
                {{ selectedProject.title }}
              </h2>
              <UButton
                v-if="selectedProject.link"
                :to="selectedProject.link"
                target="_blank"
                color="primary"
                variant="soft"
                icon="i-heroicons-arrow-top-right-on-square"
                class="rounded-full"
              >
                Lihat Proyek
              </UButton>
            </div>

            <div class="flex flex-wrap gap-2 mb-6">
              <UBadge
                v-for="tag in selectedProject.tech"
                :key="tag"
                color="neutral"
                variant="subtle"
                class="rounded-full"
              >
                {{ tag }}
              </UBadge>
            </div>

            <p class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
              {{ selectedProject.description }}
            </p>

            <div v-if="selectedProject.body" class="prose dark:prose-invert max-w-none border-t border-gray-100 dark:border-gray-800 pt-6">
              <ContentRenderer :value="selectedProject" />
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
</style>
