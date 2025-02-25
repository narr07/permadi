<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const { data: allProject } = await useLazyAsyncData(`allproject-${locale.value}-${route.path}`, async () => {
  const collection = (`project_${locale.value}`) as keyof Collections
  return await queryCollection(collection)
    .select('title', 'description', 'path', 'id', 'image', 'date', 'meta')
    .order('date', 'DESC')
    .all() as Collections['project_id'][] | Collections['project_en'][]
}, {
  watch: [locale],
})

const seoMeta = computed(() => ({
  title: 'Project',
  description: () => t('website.description'),
  keywords: 'dinar, permadi, dinar permadi, guru, developer, programmer',
}))

useSeoMeta({
  title: seoMeta.value.title,
  description: seoMeta.value.description,
  keywords: seoMeta.value.keywords,
  twitterTitle: seoMeta.value.title,
  twitterDescription: seoMeta.value.description,

})

defineOgImageComponent('Page', {
  title: 'Project',
  description: () => t('website.description'),
})
</script>

<template>
  <div>
    <UContainer>
      <div class="pt-8 pb-6">
        <h1 class="font-bold text-g3 md:text-g4">
          {{ t('project.title') }}
        </h1>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in allProject"
          :key="project.id"
        >
          <div class="relative">
            <div class="absolute -top-1.5 z-50 -end-1.5  ">
              <UButton square icon="ph:arrow-square-up-right-duotone" target="_blank" :to="project.meta.link as string" color="neutral">
                <span class="sr-only">{{ project.title }}</span>
              </UButton>
            </div>
            <NuxtLink :to="localePath(`/project${project.path}`)" class="group flex flex-col focus:outline-none">
              <UCard class="relative hover:bg-yellow-500 duration-100 ease-in-out dark:hover:bg-permadi-700">
                <div class="relative  aspect-video rounded overflow-hidden ring-2 ring-permadi-900 dark:ring-permadi-600">
                  <!-- Gambar dengan Skeleton Loader jika gambar belum ada -->
                  <NuxtImg
                    critical
                    class="size-full absolute top-0 start-0 object-cover group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out rounded"
                    :src="project.image"
                    :alt="project.title"
                    :title="project.title"
                    quality="70"
                    width="500"
                    height="300"
                    format="webp"
                    preload
                    loading="lazy"
                    :placeholder="[50, 25, 75, 5]"
                  />
                </div>
                <span class="absolute top-0 start-0 rounded-se rounded-es text-xs font-medium bg-permadi-700 text-white py-1.5 px-3 dark:bg-permadi-700">
                  {{ project.meta.category }}
                </span>

                <div class="mt-2">
                  <h2 class="text-xl font-semibold text-yellow-500 group-hover:text-gray-600 dark:text-neutral-300 dark:group-hover:text-white">
                    {{ project.title }}
                  </h2>
                </div>
              </UCard>
            </NuxtLink>
          </div>
          <USeparator />
        </div>
      </div>
    </UContainer>
  </div>
</template>
