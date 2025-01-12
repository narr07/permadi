<script lang="ts" setup>
import type { Collections } from '@nuxt/content'
import { useScrollspy } from '@/composables/useScrollspy'
import { useWindowScroll } from '@vueuse/core'
import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale } = useI18n()

const slug = computed(() => withLeadingSlash(String(route.params.slug)))

const { data: projectPage } = await useAsyncData(`page-${slug.value}`, async () => {
  const collection = (`project_${locale.value}`) as keyof Collections
  const content = await queryCollection(collection).path(slug.value).first()
  return content
}, {
  watch: [locale],
})

if (projectPage?.value?.seo) {
  useSeoMeta(projectPage.value.seo)
}
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
          <NuxtImg class="mx-auto " :src="projectPage?.image" />
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
