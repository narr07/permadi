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
useSchemaOrg([
  defineArticle({
    title: () => pageProject?.value?.title,
    description: () => pageProject?.value?.description,
  }),
])

useSeoMeta({
  keywords: () => pageProject.value?.tags
    ? pageProject.value.tags.join(', ')
    : 'dinar, permadi, dinar permadi, guru, developer, programmer',
})

defineOgImageComponent('Page', {
  title: () => pageProject.value?.title,
  description: () => pageProject.value?.description,
})
</script>

<template>
  <UContainer v-if="pageProject">
    <article>
      <UCard class="mb-2">
        <div class="relative aspect-video max-w-2xl mx-auto object-cover bg-cover rounded overflow-hidden ring-2 ring-permadi-900 dark:ring-permadi-600">
          <NuxtImg
            v-if="pageProject?.image"
            loading="eager"
            :src="pageProject.image"
            :alt="pageProject.title"
            :title="pageProject.title"
            width="1000"
            height="600"
            format="webp"
            class="rounded bg-cover bg-center h-full w-full"
          />
        </div>
      </UCard>
      <UCard>
        <div class="mb-2 mx-auto  max-w-2xl">
          <div v-if="pageProject" :value="pageProject">
            <h1 class="text-g3">
              {{ pageProject.title }}
            </h1>
          </div>
          <p>
            {{ pageProject?.description }}
          </p>
        </div>
        <div class="prose mx-auto  prose-permadi dark:prose-invert">
          <ContentRenderer
            v-if="pageProject"
            :dir="localeProperties?.dir ?? 'ltr'"
            :value="pageProject"
          />
        </div>
      </UCard>
    </article>
  </UContainer>
</template>
