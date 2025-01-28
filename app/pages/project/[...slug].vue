<script lang="ts" setup>
import type { Collections } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const slug = computed(() => withLeadingSlash(String(route.params.slug)))

const { data: projectPage } = await useAsyncData(`page-${locale.value}-${slug.value}`, async () => {
  const collection = (`project_${locale.value}`) as keyof Collections
  const content = await queryCollection(collection).path(slug.value).first()
  return content
}, {
  watch: [localePath],
})

if (projectPage?.value?.seo) {
  useSeoMeta(projectPage.value.seo)
}
defineOgImageComponent('Page', {
  title: projectPage?.value?.title || t('website.project'),
  description: projectPage?.value?.description || t('website.description'),
})
</script>

<template>
  <UContainer class=" ">
    <!-- Header -->
    <div class="">
      <div class=" ">
        <UCard class="mb-2">
          <div v-if="projectPage" :value="projectPage">
            <h1 class="text-g3">
              {{ projectPage.title }}
            </h1>
          </div>
        </UCard>
        <UCard class="mb-2">
          <div class="aspect-w-16 aspect-h-9 max-w-3xl mx-auto">
            <NuxtImg

              sizes="100vw sm:50vw md:400px"
              height="675"
              width="1200"
              :placeholder="[50, 25, 75, 5]"
              class="mx-auto h-96 aspect-video object-fit w-full rounded" loading="lazy" :title="projectPage?.title" :alt="projectPage?.title" :src="projectPage?.image"
            />
          </div>
        </UCard>

        <!-- Konten -->
        <UCard>
          <div class="prose dark:prose-invert prose-sm drop max-w-6xl mx-auto prose-permadi">
            <ContentRenderer v-if="projectPage" :value="projectPage" />
          </div>
        </UCard>
      </div>

      <!-- toc -->
    </div>

    <ScrollToTop />
  </UContainer>
</template>
