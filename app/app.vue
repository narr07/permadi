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
            :label="locale === 'id' ? 'EN' : 'ID'"
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
                <button
                  class="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  @click="setLocale(locale === 'id' ? 'en' : 'id'); mobileMenuOpen = false"
                >
                  <UIcon name="i-lucide-languages" class="size-4" />
                  {{ locale === 'id' ? 'English' : 'Indonesia' }}
                </button>
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
          Copyright © {{ new Date().getFullYear() }}
        </p>
      </template>

      <UNavigationMenu :items="items" variant="link" />

      <template #right>
        <UButton
          icon="i-simple-icons-discord"
          color="neutral"
          variant="ghost"
          to="https://go.nuxt.com/discord"
          target="_blank"
          aria-label="Discord"
        />
        <UButton
          icon="i-simple-icons-x"
          color="neutral"
          variant="ghost"
          to="https://go.nuxt.com/x"
          target="_blank"
          aria-label="X"
        />
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/nuxt"
          target="_blank"
          aria-label="GitHub"
        />
      </template>
    </UFooter>
  </UApp>
</template>
