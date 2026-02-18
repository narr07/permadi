<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import * as locales from '@nuxt/ui/locale'

const { locale, setLocale, t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

// Search term for ContentSearch
const searchTerm = ref('')

// Mobile dropdown menu state
const mobileMenuOpen = ref(false)

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

const socials = [
  { icon: 'i-narr-soc-mail', to: 'https://go.nuxt.com/discord', label: 'Email' },
  { icon: 'i-narr-soc-ig', to: 'https://go.nuxt.com/x', label: 'Instagram' },
  { icon: 'i-narr-soc-github', to: 'https://github.com/nuxt/nuxt', label: 'GitHub' },
  { icon: 'i-narr-soc-behance', to: 'https://go.nuxt.com/x', label: 'Behance' },
  { icon: 'i-narr-soc-x', to: 'https://go.nuxt.com/x', label: 'X' },
]
</script>

<template>
  <UApp :locale="locales[locale]">
    <UContainer class="fixed top-2 inset-x-0 z-50">
      <nav class="flex items-center justify-between border dark:border-brand-700 border-brand-900 rounded-lg bg-(--ui-bg)/60 backdrop-blur-sm px-4 py-2">
        <!-- Left: Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2 text-brand-500 font-bold uppercase">
          <Logo />
        </NuxtLink>

        <!-- Center: Desktop Navigation (hidden on mobile) -->
        <UNavigationMenu :items="items" class="hidden sm:flex justify-center uppercase text-xs font-medium" />

        <!-- Right: Action buttons -->
        <div class="flex items-center gap-1">
          <UContentSearchButton collapsed />
          <UColorModeButton />

          <!-- Desktop: Language switcher -->
          <UButton
            color="neutral"
            variant="ghost"
            :icon="locale === 'id' ? 'i-narr-en' : 'i-narr-id'"
            class="hidden sm:inline-flex"
            @click="setLocale(locale === 'id' ? 'en' : 'id')"
          />

          <!-- Mobile: Popover Menu -->
          <UPopover
            v-model:open="mobileMenuOpen"
            class="sm:hidden"
          >
            <UButton
              color="neutral"
              variant="ghost"
              :icon="mobileMenuOpen ? 'i-narr-close' : 'i-narr-menu'"
            />

            <template #content>
              <div class="p-2 w-48 space-y-1">
                <!-- Nav Links -->
                <NuxtLink
                  v-for="item in items"
                  :key="item.label"
                  :to="item.to"
                  class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors"
                  :class="item.active
                    ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
                  @click="mobileMenuOpen = false"
                >
                  <UIcon
                    v-if="item.active"
                    name="i-narr-chevron-right"
                    class="size-3.5"
                  />
                  {{ item.label }}
                </NuxtLink>

                <!-- Divider -->
                <USeparator />

                <!-- Language Switcher -->
                <UButton
                  variant="ghost"
                  :icon="locale === 'id' ? 'i-narr-en' : 'i-narr-id'"
                  @click="setLocale(locale === 'id' ? 'en' : 'id'); mobileMenuOpen = false"
                />
              </div>
            </template>
          </UPopover>
        </div>
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
      <UContainer class="py-6 pt-24">
        <NuxtPage />
      </UContainer>
    </UMain>

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
          />
        </UTooltip>
      </template>
    </UFooter>
  </UApp>
</template>
