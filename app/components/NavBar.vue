<script setup lang="ts">
import { useRoute } from 'vue-router'

// Get the current route
const route = useRoute()

/**
 * Check if the current path matches exactly or includes subpaths
 * @param path - The base path to check
 * @returns true if the path is active
 */
function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`)
}
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
          <div class="flex md:space-x-2">
            <div>
              <ULink
                aria-label="Home"
                to="/blog"
                :class="{
                  'text-blue-500 font-bold': isActive('/blog'),
                  'text-black': !isActive('/blog'),
                }"
              >
                Blog
              </ULink>
            </div>
          </div>
          <ColorModeButton />
        </div>
      </div>
    </UContainer>
  </nav>
</template>

<style>
/* Tambahkan gaya tambahan jika diperlukan */
</style>
