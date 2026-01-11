<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { locale, setLocale } = useI18n()
const { data: navigation } = await useAsyncData(
  `navigation-${locale.value}`,
  () => queryCollectionNavigation(`content_${locale.value}` as any),
  { watch: [locale] },
)
const route = useRoute()
const localePath = useLocalePath()
const isMenuOpen = ref(false)
// Menutup popover saat berpindah halaman
watch(() => route.path, () => {
  isMenuOpen.value = false
})
const items = computed<NavigationMenuItem[]>(() => {
  if (!navigation.value)
    return []
  return navigation.value.map((item: any) => {
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
  <UHeader :toggle="false" class="top-2   rounded-md border-2 border-permadi-900 dark:border-permadi-700 max-w-6xl mx-auto">
    <template #title>
      <NuxtLink :to="localePath('/')">
        <UiLogo />
      </NuxtLink>
    </template>
    <div class="hidden lg:flex">
      <UNavigationMenu
        class="-mx-2.5  "
        :items="items"
        :ui="{
          list: 'gap-1.5 ',
          link: 'navactive-link ',
        }"
      />
    </div>
    <template #right>
      <UColorModeButton />
      <UButton
        color="neutral"
        variant="ghost"
        :icon="locale === 'id' ? 'i-narr-flag-id' : 'i-narr-flag-en'"
        @click="setLocale(locale === 'id' ? 'en' : 'id')"
      />
      <!-- Popover Menu untuk Mobile -->
      <UPopover v-model:open="isMenuOpen" :ui="{ content: 'w-48 p-2' }" class="lg:hidden">
        <UButton
          :icon="isMenuOpen ? 'i-narr-close' : 'i-narr-menu'"
          color="neutral"
          variant="ghost"
          aria-label="Menu"
        />
        <template #content>
          <UNavigationMenu
            :items="items"
            orientation="vertical"
            class="w-full"
            :ui="{
              link: 'data-active:bg-primary-500  not-data-active:hover:bg-primary-500',
            }"
          />
        </template>
      </UPopover>
    </template>
  </UHeader>
</template>

<style>
@reference "../../../app/assets/css/main.css";
.navactive-link {
  @apply rounded transition-all duration-200;
}
.navactive-link[data-active] {
  @apply bg-permadi-200 py-1 dark:bg-yellow-500 border text-permadi-900;
}
.navactive-link:not([data-active]):hover {
  @apply bg-permadi-100 py-1 border dark:border-yellow-500/10 border-permadi-200/10 dark:bg-yellow-500/50;
}
.navactive-link:not([data-active]) {
  @apply border-transparent;
}
</style>
