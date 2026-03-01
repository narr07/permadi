<script setup lang="ts">
const { locale, t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

// Helper: generate slug from stem (e.g., "1.sdnteja2" → "sdnteja2")
function stemToSlug(stem: string): string {
  const parts = stem.split('/')
  const filename = parts[parts.length - 1] || ''
  return filename.replace(/^\d+\./, '')
}

const { data: project } = await useAsyncData(`project-${locale.value}-${route.params.slug}`, async () => {
  const collection = `${locale.value}_project` as any
  const allProjects = await queryCollection(collection).all()

  return allProjects.find((p: any) => stemToSlug(p.stem) === route.params.slug) || null
}, {
  watch: [locale],
})

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const projectImages = computed<string[]>(() => project.value?.images || [project.value?.image].filter(Boolean))

// SEO
useSeoMeta({
  title: project.value?.title,
  ogTitle: project.value?.title,
  description: project.value?.description,
  ogDescription: project.value?.description,
  ogImage: project.value?.image,
  ogType: 'article',
  ogLocale: locale.value === 'id' ? 'id_ID' : 'en_US',
  ogSiteName: 'Permadi',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineWebPage({
    name: project.value?.title,
    description: project.value?.description,
    inLanguage: locale.value === 'id' ? 'id-ID' : 'en-US',
  }),
])

defineOgImageComponent('Permadi', {
  title: project.value?.title,
  description: project.value?.description,
  headline: 'Project',
})
</script>

<template>
  <UPage v-if="project">
    <!-- Breadcrumb -->
    <div class="mb-6">
      <UBreadcrumb
        :items="[
          { label: t('nav.projects'), to: localePath('/projek'), icon: 'i-narr-project' },
          { label: project.title },
        ]"
      />
    </div>

    <UPageHeader
      :title="project.title"
      :description="project.description"
    >
      <template #headline>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="item in project.tech"
            :key="item"
            variant="subtle"
            color="primary"
            size="sm"
          >
            {{ item }}
          </UBadge>
        </div>
      </template>
    </UPageHeader>

    <!-- Project Images -->
    <div class="mt-6 relative w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
      <UCarousel
        v-if="projectImages.length > 1"
        v-slot="{ item }"
        :items="projectImages"
        arrows
        dots
        :prev="{ variant: 'solid', color: 'neutral' }"
        :next="{ variant: 'solid', color: 'neutral' }"
        class="w-full relative py-6"
        :ui="{
          item: 'basis-full flex justify-center items-center',
          dots: 'absolute inset-x-0 bottom-4 flex justify-center gap-2 z-10',
        }"
      >
        <NuxtImg
          :src="item"
          :alt="project.title"
          class="w-full max-h-[60vh] object-contain mx-auto"
          format="webp"
          quality="90"
          draggable="false"
        />
      </UCarousel>
      <NuxtImg
        v-else
        :src="project.image"
        :alt="project.title"
        class="w-full max-h-[60vh] object-contain mx-auto"
        format="webp"
        quality="90"
      />
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center gap-3 mt-6">
      <UButton
        v-if="project.link"
        :to="project.link"
        target="_blank"
        color="primary"
        icon="i-narr-external"
        trailing
        size="lg"
      >
        {{ t('view_project') || 'View Project' }}
      </UButton>
      <UButton
        v-if="project.repo"
        :to="project.repo"
        target="_blank"
        color="neutral"
        variant="outline"
        icon="i-narr-soc-github"
        size="lg"
      >
        Source Code
      </UButton>
    </div>
  </UPage>
</template>
