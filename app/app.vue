<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Home',
  to: '/',
  active: route.path.startsWith('/')
}, {
  label: 'About',
  to: '/about',
  active: route.path.startsWith('/about')
}])
</script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        Tes
      </template>

      <UNavigationMenu :items="items" />

      <template #right>
        <UColorModeButton />

      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <UContainer>
        <NuxtPage />
      </UContainer>
    </UMain>

    <!-- <UFooter /> -->
  </UApp>
</template>
