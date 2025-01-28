<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { t } = useI18n()
const localePath = useLocalePath()

const { data: projects } = await useAsyncData(route.path, () => {
  return queryCollection(`project_${locale.value}`)
    .order('date', 'DESC')
    .all()
}, {
  watch: [localePath, locale],
})

const seoMeta = computed(() => ({
  title: 'Project',
  description: t('website.description'),
}))

useSeoMeta(seoMeta.value)

defineOgImageComponent('Page', {
  title: 'Project',
  description: t('website.description'),
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
        <UCard class="hover:bg-yellow duration-100 ease-in-out dark:hover:bg-permadi-700">
          <NuxtImg
            :title="content.title"
            loading="lazy"
            sizes="100vw sm:50vw md:400px"
            height="200"
            width="400"
            :placeholder="[50, 25, 75, 5]"
            :alt="content.title" :src="content.image" class="w-full h-48 aspect-video rounded object-fit"
          />

          <template #header>
            <div class="flex justify-between items-center">
              <div class="  overflow-hidden text-sm leading-6 text-permadi-900">
                <UBadge color="neutral">
                  {{ content?.meta.category }}
                </UBadge>
              </div>
              <div class="  text-sm leading-6 text-permadi-900">
                <UButton color="neutral" icon="ph:arrow-square-up-right-duotone" :aria-label="content.title" square :to="content.meta.link as string" target="_blank">
                  <span class="sr-only">{{ content.meta.link }}</span>
                </UButton>
              </div>
            </div>
          </template>
          <template #footer>
            <NuxtLink :to="`project${content.path}`">
              <h2 class="line-clamp-2 ">
                {{ content.title }}
              </h2>
            </NuxtLink>
          </template>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
