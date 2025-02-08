<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

const { data: allProject } = await useAsyncData(`allproject-${route.path}`, async () => {
  const collection = (`project_${locale.value}`) as keyof Collections
  return await queryCollection(collection)
    .select('title', 'description', 'path', 'id', 'image', 'date', 'meta')
    .order('date', 'DESC')
    .all() as Collections['project_id'][] | Collections['project_en'][]
}, {
  watch: [locale],
})
</script>

<template>
  <div>
    <UContainer>
      <h1>project</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in allProject"
          :key="project.id"
        >
          <NuxtLink :to="localePath(`/project${project.path}`)" class="group flex flex-col focus:outline-none">
            <div class="relative pt-[56.25%] rounded overflow-hidden ring-2 ring-permadi-900 dark:ring-permadi-600">
              <NuxtImg
                class="size-full absolute top-0 start-0 object-cover group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out rounded "
                :src="project.image"
                :alt="project.title"
                width="600"
                height="400"
                format="webp"
                preload
                loading="lazy"
                placeholder="blur"
              />
              <span class="absolute top-0 end-0 rounded-se  rounded-es  text-xs font-medium bg-permadi-700 text-white py-1.5 px-3 dark:bg-permadi-700">
                {{ project.meta.category }}
              </span>
            </div>
            <div class="mt-2">
              <h2 class="text-xl font-semibold text-yellow-500 group-hover:text-gray-600 dark:text-neutral-300 dark:group-hover:text-white">
                {{ project.title }}
              </h2>
            </div>
          </NuxtLink>
          <USeparator />
        </div>
      </div>
    </UContainer>
  </div>
</template>
