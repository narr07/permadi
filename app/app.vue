<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { locale, setLocale, t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

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
  <UApp>
    <UContainer class="fixed top-2 inset-x-0 z-50">
      <UHeader class="border dark:border-brand-700 border-brand-900 rounded-lg bg-(--ui-bg)/60 backdrop-blur-sm px-4">
        <template #title>
          <div class="flex items-center gap-2 text-brand-500 font-bold uppercase ">
            <UIcon name="i-lucide-compass" class="size-5" />
            <span>{{ t('header.title') }}</span>
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
