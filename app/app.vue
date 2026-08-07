<script setup lang="ts">
// Search index (navigation + files) di-fetch dari SERVER API.
// Sebelumnya queryCollectionSearchSections() dijalankan di client dan memaksa
// browser mengunduh sqlite3.wasm (386 KiB) + sql_dump.txt (24 KiB) — sumber
// utama beban jalur kritis. Dipindah ke server: browser hanya menerima JSON.
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

import * as locales from '@nuxt/ui/locale'
import { breakpointsTailwind, useBreakpoints, useIdle } from '@vueuse/core'

const { locale, setLocale, t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('md')

// Search term for ContentSearch
const searchTerm = ref('')

// Auto-hide mobile navigation on idle (2 seconds timeout)
const { idle } = useIdle(2000)
// Struktur yang dikembalikan queryCollectionSearchSections (server) — match
// dengan prop `files` dari UContentSearch (ContentSearchFile[]).
interface SearchSection {
  id: string
  title: string
  titles: string[]
  level: number
  content: string
}
interface SearchIndex {
  navigation: ContentNavigationItem[]
  files: SearchSection[]
}
const { data: searchIndex } = useLazyFetch<SearchIndex>('/api/search', {
  query: computed(() => ({ locale: locale.value })),
  // server: false — jangan fetch saat SSR/prerender, hanya di client.
  server: false,
})

const navigation = computed(() => searchIndex.value?.navigation ?? [])
const files = computed(() => searchIndex.value?.files ?? [])
const items = computed<NavigationMenuItem[]>(() => [
  {
    label: t('nav.home'),
    to: localePath('/'),
    active: route.path === localePath('/'),
    icon: 'i-narr-home',
  },
  {
    label: t('nav.blog'),
    to: localePath('/blog'),
    active: route.path.startsWith(localePath('/blog')),
    icon: 'i-narr-article',
  },
  {
    label: t('nav.projects'),
    to: localePath({ name: 'projek' }),
    active: route.path.startsWith(localePath({ name: 'projek' }) as string),
    icon: 'i-narr-project',
  },
  {
    label: t('nav.gallery'),
    to: localePath({ name: 'galeri' }),
    active: route.path.startsWith(localePath({ name: 'galeri' }) as string),
    icon: 'i-narr-gallery',
  },
])
const socials = [
  { icon: 'i-narr-soc-mail', to: `mailto:${'dinarpermadi07'}@${'gmail.com'}`, label: 'Email' },
  { icon: 'i-narr-soc-ig', to: 'https://www.instagram.com/narr07/', label: 'Instagram' },
  { icon: 'i-narr-soc-github', to: 'https://github.com/narr07', label: 'GitHub' },
  { icon: 'i-narr-soc-behance', to: 'https://www.behance.net/narr07', label: 'Behance' },
  { icon: 'i-narr-soc-x', to: 'https://x.com/dinarpermadi07', label: 'X' },
]
const site = useSiteConfig()

useSchemaOrg([
  defineWebSite({
    name: site.name,
    description: site.description,
    url: site.url,
    inLanguage: locale.value === 'id' ? 'id-ID' : 'en-US',
  }),
])
</script>

<template>
  <UApp :locale="locales[locale]">
    <UContainer class="fixed top-2 inset-x-0 z-50">
      <nav
        class="flex items-center justify-between border dark:border-brand-700 border-brand-900 rounded-lg bg-(--ui-bg)/60 backdrop-blur-sm px-4 py-2 transition-transform duration-300 ease-in-out"
        :class="(idle && isMobile) ? '-translate-y-[150%]' : 'translate-y-0'"
      >
        <!-- Left: Logo -->
        <!-- no-prefetch: home adalah landing page, hindari unduhan payload rute lain -->
        <NuxtLink no-prefetch :to="localePath('/')" class="flex items-center gap-2 text-brand-500 font-bold uppercase">
          <LogoNav size="40" />
        </NuxtLink>
        <!-- Center: Desktop Navigation (hidden on mobile) -->
        <UNavigationMenu :items="items" class="hidden sm:flex justify-center uppercase text-xs font-medium" />
        <!-- Right: Action buttons -->
        <div class="flex items-center gap-1">
          <UContentSearchButton collapsed />
          <UColorModeButton />
          <!-- Language switcher -->
          <UButton
            color="neutral"
            variant="ghost"
            :icon="locale === 'id' ? 'i-narr-en' : 'i-narr-id'"
            :aria-label="t('nav.switch_language')"
            @click="setLocale(locale === 'id' ? 'en' : 'id')"
          />
        </div>
      </nav>
    </UContainer>

    <!-- Mobile Bottom Navigation -->
    <UContainer class="sm:hidden fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] inset-x-0 z-50">
      <nav
        class="flex items-center justify-around border dark:border-brand-700 border-brand-900 rounded-lg bg-(--ui-bg)/80 backdrop-blur-md px-2 py-2 shadow-lg transition-transform duration-300 ease-in-out"
        :class="idle ? 'translate-y-[200%]' : 'translate-y-0'"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.label"
          no-prefetch
          :to="item.to"
          class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200"
          :class="item.active
            ? 'text-primary-500 bg-primary-50 dark:bg-primary-950/50 scale-110'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'"
        >
          <UIcon :name="item.icon" class="size-6" />
          <span class="sr-only">{{ item.label }}</span>
        </NuxtLink>
      </nav>
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
      <UContainer class="py-6 pt-16 sm:pt-24">
        <NuxtPage />
      </UContainer>
    </UMain>
    <LazyBackToTop hydrate-on-idle />
    <UFooter
      class="pb-24 sm:pb-0"
      :ui="{
        container: 'py-6 lg:py-4 lg:flex lg:items-center lg:justify-between lg:gap-x-3',
        left: 'flex flex-col items-center lg:items-start lg:flex-1 gap-2 lg:order-1',
        right: 'flex items-center justify-center lg:justify-end gap-x-1.5 lg:flex-1 lg:order-3 mt-4 lg:mt-0',
      }"
    >
      <template #top>
        <UContainer class="flex justify-center  lg:justify-start">
          <LazyNewsletter />
        </UContainer>
      </template>
      <template #left>
        <div class="flex items-center gap-2">
          <p class="text-muted text-sm">
            © 2021-<ClientOnly fallback="2026">
              {{ new Date().getFullYear() }}
            </ClientOnly> - narr07
          </p>
          <ClientOnly>
            <Visitor />
          </ClientOnly>
        </div>
      </template>
      <template #right>
        <UTooltip
          v-for="social in socials"
          v-once
          :key="social.label" :text="social.label"
        >
          <UButton
            :icon="social.icon"
            color="neutral"
            variant="ghost"
            :to="social.to"
            target="_blank"
            :aria-label="social.label"
          >
            <span class="sr-only">{{ social.label }}</span>
          </UButton>
        </UTooltip>
      </template>
    </UFooter>
  </UApp>
</template>
