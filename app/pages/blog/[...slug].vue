<!-- eslint-disable prefer-template -->
<script lang="ts" setup>
import type { Collections } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale, localeProperties } = useI18n()
const slug = computed(() => withLeadingSlash(`${String(route.params.slug)}`))

const { data: page } = await useAsyncData('blog' + slug.value, async () => {
  const collection = ('content_' + locale.value) as keyof Collections
  return await queryCollection(collection).path(slug.value).first() as Collections['content_id'] | Collections['content_en']
}, {
  watch: [locale],
})
</script>

<template>
  <div v-if="page">
    <article class="writing mx-auto px-4 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
      <h1>
        {{ page?.title }}
      </h1>

      <ContentRenderer
        v-if="page"
        :dir="localeProperties?.dir ?? 'ltr'"
        :value="page"
      />
    </article>
  </div>
</template>
