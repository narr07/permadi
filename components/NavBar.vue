<script setup>
const route = useRoute()
const localePath = useLocalePath()
function isCurrentRoute(path) {
  return route.path === localePath(path)
}
function togglePopover(open, close) {
  if (open)
    close()
}
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})
const storyblokApi = useStoryblokApi()
const { data } = await storyblokApi.get('cdn/stories/global', {
  version: 'draft',
  language: locale.value,
  resolve_links: 'url',
})
const headerMenu = ref(null)
headerMenu.value = data.story.content.navbar
onMounted(() => {
  window.addEventListener('scroll', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
const showHeader = ref(true)
const lastScrollPosition = ref(0)
function onScroll() {
  const currentScrollPosition
      = window.pageYOffset || document.documentElement.scrollTop
  if (currentScrollPosition < 0)
    return
  if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 60)
    return
  showHeader.value = currentScrollPosition < lastScrollPosition.value
  lastScrollPosition.value = currentScrollPosition
}
</script>

<template>
  <nav>
    <div
      :class="[showHeader ? 'translate-y-0' : '-translate-y-[72px]']"
      class="fixed w-full top-2 z-50 transform-gpu transition-transform duration-150 ease-in-out"
    >
      <UContainer>
        <div
          class="dark:bg-permadi-900 bg-permadi-100 ring-1 ring-gray-800 dark:ring-gray-800 rounded p-2"
        >
          <div class="flex flex-row justify-between items-center">
            <div class="flex">
              <UTooltip text="Dinar Permadi Yusup">
                <NuxtLink
                  title="Logo"
                  rel="noopener"
                  aria-label="Logo"
                  :to="localePath('/')"
                >
                  <Logo class="h-10 w-10" />
                </NuxtLink>
              </UTooltip>
            </div>
            <div class="flex items-center">
              <nav
                v-for="blok in headerMenu"
                :key="blok._uid"
                class="md:flex-row hidden md:flex mr-1 flex-row justify-between md:space-x-6"
              >
                <div class="flex items-center space-x-4">
                  <UButton
                    role="link"
                    :title="blok.label || 'link'"
                    :aria-label="blok.label || 'link'"
                    rel="noopener noreferrer"
                    class="uppercase"
                    color="gray"
                    :variant="
                      isCurrentRoute(storyblokLink(blok.link))
                        ? 'solid'
                        : 'ghost'
                    "
                    :to="localePath(storyblokLink(blok.link))"
                  >
                    {{ blok.label }}
                  </UButton>
                </div>
              </nav>
              <div class="flex items-center ml-4">
                <!-- <Search /> -->
                <div class="flex items-center">
                  <UPopover :popper="{ arrow: true }">
                    <template #default="{ open, close }">
                      <UButton
                        title="language"
                        aria-label="language"
                        color="gray"
                        :variant="open ? 'solid' : 'ghost'"
                        :trailing-icon="
                          open
                            ? 'i-ph-globe-hemisphere-west-duotone'
                            : 'i-ph-globe-hemisphere-east-duotone'
                        "
                        @click="togglePopover(open, close)"
                      />
                    </template>
                    <template #panel="{ close }">
                      <UCard
                        :ui="{
                          body: {
                            padding: 'px-1 py-1  sm:px-1 sm:py-1',
                          },
                        }"
                      >
                        <div class="flex space-x-2 flex-row items-center">
                          <div v-for="lang in availableLocales" :key="lang">
                            <UButton
                              title="language switch"
                              aria-label="language switch"
                              color="gray"
                              :variant="
                                $route.path === switchLocalePath(lang)
                                  && $i18n.locale === lang
                                  ? 'solid'
                                  : 'ghost'
                              "
                              class="uppercase"
                              :to="switchLocalePath(lang)"
                              @click="close"
                            >
                              {{ lang }}
                            </UButton>
                          </div>
                        </div>
                      </UCard>
                    </template>
                  </UPopover>
                  <UTooltip text="Color Toggle">
                    <DarkMode />
                  </UTooltip>
                </div>
                <div class="md:hidden mobiledropdown">
                  <UPopover :popper="{ arrow: true }">
                    <template #default="{ open, close }">
                      <UButton
                        aria-label="Menu"
                        title="Menu"
                        rel="noopener noreferrer"
                        role="button"
                        color="gray"
                        :variant="open ? 'solid' : 'ghost'"
                        :trailing-icon="
                          open
                            ? 'i-ph-circles-three-plus-duotone'
                            : 'i-ph-circles-four-duotone'
                        "
                        @click="togglePopover(open, close)"
                      />
                    </template>
                    <template #panel="{ close }">
                      <UCard
                        :ui="{
                          body: {
                            padding: 'px-1 py-1  sm:px-1 sm:py-1',
                          },
                        }"
                      >
                        <div class="flex space-y-2 w-40 flex-col">
                          <div v-for="blok in headerMenu" :key="blok._uid">
                            <UButton
                              role="link"
                              :title="blok.label"
                              :aria-label="blok.label"
                              rel="noopener noreferrer"
                              class="w-full"
                              color="gray"
                              :variant="
                                isCurrentRoute(storyblokLink(blok.link))
                                  ? 'solid'
                                  : 'ghost'
                              "
                              :to="localePath(storyblokLink(blok.link))"
                              @click="close"
                            >
                              <Icon :name="blok.icon.icon" />
                              {{ blok.label }}
                            </UButton>
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
    </div>
  </nav>
</template>
