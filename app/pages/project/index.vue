<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { t } = useI18n()

const { data: projects } = await useAsyncData(route.path, () => {
  return queryCollection(`project_${locale.value}`)
    .order('date', 'DESC')
    .all()
})
defineOgImageComponent('Page', {
  title: t('website.project'),
  description: t('website.description'),
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
    <div class="grid h-full grid-cols-1 md:grid-cols-3 gap-4">
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
        <UCard>
          <NuxtImg :src="content.image" class="w-full h-48 rounded object-fit" />
          <NuxtLink :to="`project${content.path}`">
            <h3 class="line-clamp-2 pt-4">
              {{ content.title }}
            </h3>
          </NuxtLink>
          <div class="absolute top-1 left-1 gap-y-1 overflow-hidden text-sm leading-6 text-permadi-900">
            <UBadge>
              {{ content?.meta.category }}
            </UBadge>
          </div>
          <div class="absolute top-1 right-1 gap-y-1 overflow-hidden text-sm leading-6 text-permadi-900">
            <NuxtLink :to="content.meta.link as string" target="_blank">
              <UBadge icon="ph:arrow-square-up-right-duotone" square />
            </NuxtLink>
          </div>
        </UCard>
        <!-- <NuxtLink :to="`project${content.path}`">
          <div class="relative isolate flex flex-col dark:ring-permadi-600 ring-2 justify-end overflow-hidden rounded px-8 pb-8 pt-40 h-96">
            <NuxtImg :src="content.image" class="absolute  inset-0 object-cover w-full h-full transition-transform duration-300 transform hover:scale-105" />
            <div class="absolute inset-0 bg-permadi-200/30 hover:bg-yellow-500/50 dark:bg-permadi-800/70 dark:hover:bg-permadi-800/30" />
            <div class="z-50 mt-3 text-xl font-bold">
              <h3 class="line-clamp-2">
                {{ content.title }}
              </h3>
              <div class="absolute top-1 right-1 gap-y-1 overflow-hidden text-sm leading-6 text-permadi-900">
                <UBadge>
                  {{ content?.meta.category }}
                </UBadge>
              </div>
            </div>
          </div>
        </NuxtLink> -->
      </div>
    </div>
    <ScrollToTop />
  </UContainer>
</template>
