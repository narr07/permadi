<script setup lang="ts">
import { useRoute } from 'vue-router'

const localePath = useLocalePath()
const route = useRoute()
const open = ref(false)
function isActive(path: string): boolean {
  const localizedPath = localePath(path)
  return route.path === localizedPath || (localizedPath !== '/' && localizedPath !== '/en' && route.path.startsWith(`${localizedPath}/`))
}

const menuItems = [
  { name: 'Home', path: '/', icon: 'hugeicons:home-03' },
  { name: 'Blog', path: '/blog', icon: 'hugeicons:book-04' },
  { name: 'Project', path: '/project', icon: 'hugeicons:folder-check' },
]
</script>

<template>
  <nav class="fixed w-full z-50 top-1">
    <UContainer class="max-w-6xl mx-auto">
      <div class="bg-yellow-500 ring-2 dark:ring-permadi-600 ring-permadi-900 dark:bg-permadi-700 p-2 rounded">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div>
              <ULink aria-label="logo" :to="localePath('/')">
                <Logo />
              </ULink>
            </div>
          </div>
          <div class="flex md:space-x-2">
            <div class="md:flex hidden items-center space-x-4">
              <div v-for="item in menuItems" :key="item.path">
                <div>
                  <UButton
                    color="neutral"
                    variant="outline"
                    square
                    :aria-label="item.name"
                    :to="localePath(item.path)"
                    class="hover:ring-2 rounded px-2 ring-permadi-950 font-semibold items-center flex text-base"
                    :class="{
                      'text-permadi-900 rounded ring-2 ring-permadi-950 px-2 bg-permadi-200 dark:bg-yellow-500 hover:bg-permadi-300 dark:hover:bg-yellow-700': isActive(item.path),
                    }"
                  >
                    <UIcon :name="item.icon" class="size-5" />
                    <div class="sr-only md:not-sr-only md:ml-2">
                      {{ item.name }}
                    </div>
                  </UButton>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2 ml-4">
              <LangToogle />
              <DocsSearchButton />
              <ColorModeButton />
            </div>
            <div class="md:hidden ml-4">
              <div>
                <UPopover v-model:open="open" arrow>
                  <UButton
                    :icon="open ? 'hugeicons:dashboard-square-03' : 'hugeicons:dashboard-square-01'"
                    color="neutral"

                    variant="outline"
                    square
                    aria-label="Menu"
                    size="lg"
                    class="hover:ring-2 rounded px-2 ring-permadi-950 font-semibold items-center flex text-base"
                  />

                  <template #content>
                    <UCard>
                      <div class="flex items-start flex-col space-y-2">
                        <div v-for="item in menuItems" :key="item.path" class="w-full">
                          <div class="justify-start flex flex-col w-full">
                            <UButton
                              color="neutral"
                              variant="outline"
                              square
                              :aria-label="item.name"
                              :to="localePath(item.path)"
                              class="hover:ring-2 rounded px-2 ring-permadi-950 font-semibold items-center flex text-base w-full"
                              :class="{
                                'text-permadi-900 rounded ring-2 ring-permadi-950 px-2 bg-permadi-200 dark:bg-yellow-500 hover:bg-permadi-300 dark:hover:bg-yellow-700': isActive(item.path),
                              }"
                              @click="open = false"
                            >
                              <UIcon :name="item.icon" class="size-5" />
                              <div class="flex-1 text-left">
                                {{ item.name }}
                              </div>
                            </UButton>
                          </div>
                        </div>
                      </div>
                    </UCard>
                  </template>
                </UPopover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </nav>
</template>
