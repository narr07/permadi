<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { data: nav } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('content')
})

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => {
  return (nav.value || []).map(item => ({
    label: item.title,
    to: item.path,
    active: item.path === '/' ? route.path === '/' : route.path.startsWith(item.path),
  }))
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
