<script setup lang="ts">
import { useRoute } from 'vue-router'

const localePath = useLocalePath()
const route = useRoute()

function isActive(path: string): boolean {
  const localizedPath = localePath(path)
  return route.path === localizedPath || (localizedPath !== '/' && localizedPath !== '/en' && route.path.startsWith(`${localizedPath}/`))
}

const menuItems = [
  { name: 'Home', path: '/', icon: 'ph:house-duotone' },
  { name: 'Blog', path: '/blog', icon: 'ph:notebook-duotone' },
]
</script>

<template>
  <nav class="fixed w-full z-50 top-1">
    <UContainer class="max-w-6xl mx-auto">
      <div class="bg-yellow-500 ring-2 dark:ring-permadi-600 ring-permadi-900 dark:bg-permadi-700 p-2 rounded">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <UTooltip text="Home" placement="bottom" :popper="{ arrow: true }">
              <ULink aria-label="logo" :to="localePath('/')">
                <Logo />
              </ULink>
            </UTooltip>
          </div>
          <div class="flex md:space-x-2">
            <div class="flex items-center space-x-4">
              <div v-for="item in menuItems" :key="item.path">
                <UTooltip :text="item.name" placement="bottom" :popper="{ arrow: true }">
                  <NuxtLink
                    :aria-label="item.name"
                    :to="localePath(item.path)"
                    class="hover:ring-2 rounded px-2 font-semibold items-center flex text-base"
                    :class="{
                      'text-permadi-900 rounded ring-2 ring-permadi-950 px-2 bg-permadi-200 dark:bg-yellow-500 hover:bg-permadi-300 dark:hover:bg-yellow-700': isActive(item.path),
                    }"
                  >
                    <UIcon :name="item.icon" class="size-6" />
                    <div class="sr-only md:not-sr-only md:ml-2">
                      {{ item.name }}
                    </div>
                  </NuxtLink>
                </UTooltip>
              </div>
            </div>
            <div class="flex items-center space-x-2 ml-4">
              <DocsSearchButton />
              <LangToogle />
              <ColorModeButton />
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </nav>
</template>
