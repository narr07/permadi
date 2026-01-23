<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { locale, setLocale } = useI18n()

const { data: nav } = await useAsyncData('navigation', () => {
  // Use locale-based collection (id_pages or en_pages)
  return queryCollectionNavigation(`${locale.value}_pages` as any)
}, {
  watch: [locale],
})

const route = useRoute()
const localePath = useLocalePath()

const items = computed<NavigationMenuItem[]>(() => {
  if (!nav.value)
    return []
  return nav.value.map((item: any) => {
    const path = localePath(item.path)
    return {
      label: item.title,
      to: path,
      active: (path === '/' || path === '/en') ? route.path === path : route.path.startsWith(path),
    }
  })
})
</script>

<template>
  <UApp>
    <UContainer class="fixed top-2 inset-x-0 z-50">
      <UHeader class="border dark:border-brand-700 border-brand-900 rounded-lg bg-(--ui-bg)/60 backdrop-blur-sm px-4">
        <template #title>
          <div class="flex items-center gap-2 text-brand-500 font-bold uppercase ">
            <UIcon name="i-lucide-compass" class="size-5" />
            <span>Architect.sys</span>
          </div>
        </template>

        <UNavigationMenu :items="items" class="justify-center uppercase   text-xs font-medium" />

        <template #right>
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

    <UMain>
      <UContainer class="py-6 pt-24">
        <NuxtPage />
      </UContainer>
    </UMain>
  </UApp>
</template>
