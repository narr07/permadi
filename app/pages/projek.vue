<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const { locale } = useI18n()
const collection = computed(() => `${locale.value}_pages` as keyof Collections)

const { data: page } = await useAsyncData(`page-projek-${locale.value}`, () => {
  return queryCollection(collection.value).path(`/${locale.value}/projek`).first()
})

useSeoMeta({
  title: () => page.value?.title,
  ogTitle: () => page.value?.title,
  description: () => (page.value as any)?.description,
  ogDescription: () => (page.value as any)?.description,
})

useSchemaOrg([
  defineWebPage({
    name: 'Permadi',
    description: 'Dinar Permadi Yusup is a teacher at SDN Teja 2, full-stack developer, and a passionate graphic designer and UI/UX designer. He is also the founder of Permadi.dev, a personal website showcasing his projects and design work.',
    image: 'https://permadi.dev/permadi.jpg',
    url: 'https://permadi.dev',
  }),
])

defineOgImageComponent('Permadi', {
  title: () => page.value?.title,
  description: () => (page.value as any)?.description,
  headline: 'Permadi',
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
