<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const menuItems = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Blog', path: '/blog', icon: 'blog' },
]
</script>

<template>
  <nav class="fixed w-full z-50 top-1">
    <UContainer class="max-w-6xl mx-auto">
      <div class="bg-yellow-500 ring-2 dark:ring-permadi-600 ring-permadi-900 dark:bg-permadi-700 p-2 rounded">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <UTooltip text="Home" placement="bottom" :popper="{ arrow: true }">
              <ULink aria-label="logo" to="/">
                <Logo />
              </ULink>
            </UTooltip>
          </div>
          <div class="flex md:space-x-6">
            <div class="flex items-center  space-x-4">
              <div v-for="item in menuItems" :key="item.path">
                <NuxtLink
                  :aria-label="item.name"
                  :to="item.path"
                  class="      font-semibold items-center flex text-base   "
                  :class="{
                    'text-permadi-900 rounded  ring-2 ring-permadi-950 px-2 bg-permadi-200 dark:bg-yellow-500 hover:bg-permadi-300 dark:hover:bg-yellow-700 ': isActive(item.path),
                  }"
                >
                  {{ item.name }}
                </NuxtLink>
              </div>
            </div>
            <ColorModeButton />
          </div>
        </div>
      </div>
    </UContainer>
  </nav>
</template>
