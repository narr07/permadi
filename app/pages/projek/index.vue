<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const { locale, t } = useI18n()
const collection = computed(() => `${locale.value}_pages` as keyof Collections)

const { data: page } = await useAsyncData(`page-projek-${locale.value}`, () => {
  return queryCollection(collection.value).path(`/${locale.value}/projek`).first()
})

useSeoMeta({
  title: () => page.value?.title || t('project.title'),
  ogTitle: () => page.value?.title || t('project.title'),
  description: () => (page.value as any)?.description || t('project.description'),
  ogDescription: () => (page.value as any)?.description || t('project.description'),
  ogLocale: () => locale.value === 'id' ? 'id_ID' : 'en_US',
  ogSiteName: 'Permadi',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineWebPage({
    name: () => page.value?.title || t('project.title'),
    description: () => (page.value as any)?.description || t('project.description'),
    inLanguage: () => locale.value === 'id' ? 'id-ID' : 'en-US',
  }),
])

defineOgImageComponent('Permadi', {
  title: () => page.value?.title || t('project.title'),
  description: () => (page.value as any)?.description || t('project.description'),
  headline: 'Permadi',
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
