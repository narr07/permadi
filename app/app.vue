<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import * as locales from '@nuxt/ui/locale'

const { locale, setLocale, t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

// Search term for ContentSearch
const searchTerm = ref('')

// Get blog navigation based on current locale
const { data: navigation, refresh: refreshNavigation } = await useAsyncData(
  'blog-navigation',
  () => queryCollectionNavigation(`${locale.value}_blog`),
)

// Get blog files for search based on current locale (lazy loaded on client)
const { data: files, refresh: refreshFiles } = useLazyAsyncData(
  'blog-search-files',
  () => queryCollectionSearchSections(`${locale.value}_blog`),
  { server: false },
)

// Refresh data when locale changes
watch(locale, async () => {
  await Promise.all([
    refreshNavigation(),
    refreshFiles(),
  ])
})

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: t('nav.home'),
    to: localePath('/'),
    active: route.path === localePath('/'),
  },
  {
    label: t('nav.blog'),
    to: localePath('/blog'),
    active: route.path.startsWith(localePath('/blog')),
  },
  {
    label: t('nav.projects'),
    to: localePath('/project'),
    active: route.path.startsWith(localePath('/project')),
  },
  {
    label: t('nav.gallery'),
    to: localePath('/gallery'),
    active: route.path.startsWith(localePath('/gallery')),
  },
])
</script>

<template>
  <UApp :locale="locales[locale]">
    <UContainer class="fixed top-2 inset-x-0 z-50">
      <UHeader class="border dark:border-brand-700 border-brand-900 rounded-lg bg-(--ui-bg)/60 backdrop-blur-sm px-4 py-2">
        <template #title>
          <div class="flex items-center gap-2 text-brand-500 font-bold uppercase ">
            <Logo />
          </div>
        </template>

        <UNavigationMenu :items="items" class="justify-center uppercase text-xs font-medium" />

        <template #right>
          <UContentSearchButton collapsed />
          <UColorModeButton />
          <UButton
            color="neutral"
            variant="ghost"
            :label="locale === 'id' ? 'EN' : 'ID'"
            @click="setLocale(locale === 'id' ? 'en' : 'id')"
          />
        </template>

        <template #body>
          <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5 uppercase" />
        </template>
      </UHeader>
    </UContainer>

    <!-- Content Search Modal (Blog only) -->
    <ClientOnly>
      <LazyUContentSearch
        v-model:search-term="searchTerm"
        :files="files"
        :navigation="navigation"
        :placeholder="t('search.placeholder', 'Search blog...')"
        shortcut="meta_k"
        :color-mode="false"
        :fuse="{ resultLimit: 20 }"
      />
    </ClientOnly>

    <UMain>
      <UContainer class="py-6 pt-24">
        <NuxtPage />
      </UContainer>
    </UMain>
  </UApp>
</template>
