<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

const slug = computed(() => withLeadingSlash(String(route.params.slug)))
const { data: allProject } = await useAsyncData(`articles-${slug.value}`, async () => {
  const collection = (`project_${locale.value}`) as keyof Collections
  return await queryCollection(collection)
    .select('title', 'description', 'path', 'id', 'date')
    .order('date', 'DESC')
    .all() as Collections['project_id'][] | Collections['project_en'][]
}, {
  watch: [locale],
})
</script>

<template>
  <div>
    <h1>project</h1>
    <p
      v-for="project in allProject"
      :key="project.id"
    >
      <NuxtLink :to="localePath(`/project${project.path}`)">
        <strong>{{ project.title }}</strong>
      </NuxtLink>

      &nbsp;{{ project.description }}
    </p>
  </div>
</template>
