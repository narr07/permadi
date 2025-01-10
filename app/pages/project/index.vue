<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { t } = useI18n()

const { data: projects } = await useAsyncData(route.path, () => {
  return queryCollection(`project_${locale.value}`)
    .order('date', 'DESC')
    .all()
})
</script>

<template>
  <UContainer>
    <div class="py-8">
      <h1
        v-motion
        :initial="{
          opacity: 0,
          y: 50,
        }"
        :visible="{
          opacity: 1,
          y: 0,
        }"
        class=" font-bold text-g4"
      >
        {{ t('project.title') }}
      </h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3  gap-4">
      <div
        v-for="content in projects"
        :key="content.id"
        v-motion
        :initial="{
          opacity: 0,
          y: 50,
        }"
        :visible="{
          opacity: 1,
          y: 0,
        }"
      >
        <NuxtLink :to="`project${content.path}`">
          <UCard class="h-full hover:bg-yellow   duration-100 ease-in-out dark:hover:bg-permadi-700 ">
            <div class="flex flex-col p-2 h-full justify-between ">
              <h2 class="text-g2 line-clamp-2    text-balance font-semibold">
                {{ content.title }}
              </h2>
            </div>
            <template #header>
              <NuxtImg
                :src="content.image"
                :alt="content.title"
                format="webp"
                width="800"
                height="600"
                loading="lazy"
                decoding="async"
                class="object-cover w-full rounded h-48"
              />
            </template>
          </UCard>
        </NuxtLink>
      </div>
    </div>
    <ScrollToTop />
  </UContainer>
</template>
