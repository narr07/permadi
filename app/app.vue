<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import * as locales from '@nuxt/ui/locale'

import { breakpointsTailwind, useBreakpoints, useIdle } from '@vueuse/core'
import { motion } from 'motion-v'

const { locale, setLocale, t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('md')

// Search term for ContentSearch
const searchTerm = ref('')

// Auto-hide mobile navigation on idle (2 seconds timeout)
const { idle } = useIdle(2000)
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
  { icon: 'i-narr-soc-mail', to: 'https://go.nuxt.com/discord', label: 'Email' },
  { icon: 'i-narr-soc-ig', to: 'https://go.nuxt.com/x', label: 'Instagram' },
  { icon: 'i-narr-soc-github', to: 'https://github.com/nuxt/nuxt', label: 'GitHub' },
  { icon: 'i-narr-soc-behance', to: 'https://go.nuxt.com/x', label: 'Behance' },
  { icon: 'i-narr-soc-x', to: 'https://go.nuxt.com/x', label: 'X' },
]
useSchemaOrg([
  definePerson({
    name: 'Dinar Permadi Yusup',
    jobTitle: 'Teacher',
    description: 'Dinar Permadi Yusup is a teacher at SDN Teja 2, full-stack developer, and a passionate graphic designer and UI/UX designer. He is also the founder of Permadi.dev and Permadi.id.',
    image: 'https://permadi.dev/permadi.jpg',
  }),
  defineWebSite({
    name: 'Permadi',
    description: 'Dinar Permadi Yusup is a teacher at SDN Teja 2, full-stack developer, and a passionate graphic designer and UI/UX designer. He is also the founder of Permadi.dev and Permadi.id.',
    image: 'https://permadi.dev/permadi.jpg',
    url: 'https://permadi.dev',
  }),
])
</script>

<template>
  <UApp :locale="locales[locale]">
    <UContainer class="fixed top-2 inset-x-0 z-50">
      <motion.nav
        :animate="{ y: (idle && isMobile) ? -100 : 0 }"
        :transition="{ type: 'spring', stiffness: 200, damping: 20 }"
        class="flex items-center justify-between border dark:border-brand-700 border-brand-900 rounded-lg bg-(--ui-bg)/60 backdrop-blur-sm px-4 py-2"
      >
        <!-- Left: Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2 text-brand-500 font-bold uppercase">
          <Logo size="40" />
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
      </motion.nav>
    </UContainer>

    <!-- Mobile Bottom Navigation -->
    <UContainer class="sm:hidden fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] inset-x-0 z-50">
      <motion.nav
        :animate="{ y: idle ? 150 : 0 }"
        :transition="{ type: 'spring', stiffness: 200, damping: 20 }"
        class="flex items-center justify-around border dark:border-brand-700 border-brand-900 rounded-lg bg-(--ui-bg)/80 backdrop-blur-md px-2 py-2 shadow-lg"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.label"
          :to="item.to"
          class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200"
          :class="item.active
            ? 'text-primary-500 bg-primary-50 dark:bg-primary-950/50 scale-110'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'"
        >
          <UIcon :name="item.icon" class="size-6" />
          <span class="sr-only">{{ item.label }}</span>
        </NuxtLink>
      </motion.nav>
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
    <BackToTop />
    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright © narr07 - {{ new Date().getFullYear() }}
        </p>
      </template>
      <UNavigationMenu :items="items" variant="link" />
      <template #right>
        <UTooltip
          v-for="social in socials"
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
