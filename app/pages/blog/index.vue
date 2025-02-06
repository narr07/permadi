<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

const slug = computed(() => withLeadingSlash(String(route.params.slug)))
const { data: posts } = await useAsyncData(`articles-${slug.value}`, async () => {
  const collection = (`content_${locale.value}`) as keyof Collections
  return await queryCollection(collection)
    .select('title', 'description', 'path', 'id', 'date')
    .order('date', 'DESC')
    .all() as Collections['content_id'][] | Collections['content_en'][]
}, {
  watch: [locale],
})
</script>

<template>
  <div>
    <h1>Blog</h1>
    <p
      v-for="post in posts"
      :key="post.id"
    >
      <NuxtLink :to="localePath(`/blog${post.path}`)">
        <strong>{{ post.title }}</strong>
      </NuxtLink>

      &nbsp;{{ post.description }}
    </p>
  </div>
</template>
