<!-- eslint-disable prefer-template -->
<script lang="ts" setup>
import type { Collections } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale, localeProperties } = useI18n()
const slug = computed(() => withLeadingSlash(`${String(route.params.slug)}`))

const { data: pageProject } = await useAsyncData('blog' + slug.value, async () => {
  const collection = ('project_' + locale.value) as keyof Collections
  return await queryCollection(collection).path(slug.value).first() as Collections['project_id'] | Collections['project_en']
}, {
  watch: [locale],
})
</script>

<template>
  <div v-if="pageProject">
    <article class="writing mx-auto px-4 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
      <h1>
        {{ pageProject?.title }}
      </h1>

      <ContentRenderer
        v-if="pageProject"
        :dir="localeProperties?.dir ?? 'ltr'"
        :value="pageProject"
      />
    </article>
  </div>
</template>
