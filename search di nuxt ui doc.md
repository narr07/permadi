docs/app/components/search/Search.vue

<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

defineProps<{
  navigation?: ContentNavigationItem[]
}>()

const { status, search, init } = useSearchCollection('docs', {
  immediate: false,
  ignoredTags: ['style']
})

const { links, groups, searchTerm } = useSearch()
const { track } = useAnalytics()

const fuse = {
  resultLimit: 20,
  fuseOptions: {
    useTokenSearch: false,
    threshold: 0
  }
}

onNuxtReady(init)

watchDebounced(searchTerm, (term) => {
  if (term) {
    track('Search Performed', { term })
  }
}, { debounce: 500 })
</script>

<template>
  <UContentSearch
    v-model:search-term="searchTerm"
    :links="links"
    :groups="groups"
    :navigation="navigation"
    :search="search"
    :search-status="status"
    :fuse="fuse"
    :transition="false"
    :unmount-on-hide="false"
  />
</template>

docs/app/components/header/Header.vue

<script setup lang="ts">
const route = useRoute()
const { desktopLinks } = useHeader()
const { open } = useChat()
const { track } = useAnalytics()

function toggleChat() {
  if (!open.value) {
    track('AI Chat Opened', { source: 'header' })
  }
  open.value = !open.value
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <UHeader
    :ui="{
      left: 'min-w-0',
      right: 'gap-0.5',
      container: [route.path.startsWith('/blog/') ? 'max-w-none' : '']
    }"
    class="flex flex-col"
  >
    <template #left>
      <HeaderLogo />

      <VersionMenu />
    </template>

    <UNavigationMenu :items="desktopLinks" variant="link" content-orientation="vertical" />

    <template #right>
      <UTooltip text="Search" :kbds="['meta', 'K']" ignore-non-keyboard-focus>
        <UContentSearchButton />
      </UTooltip>

      <UTooltip text="Ask AI" :kbds="['meta', 'I']" ignore-non-keyboard-focus>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-bot-message-square"
          aria-label="Ask AI for help"
          @click="toggleChat"
        />
      </UTooltip>

      <ThemePicker />

      <UTooltip text="Open on GitHub" class="hidden lg:flex">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>

    <template #toggle="{ open, toggle, ui }">
      <HeaderToggleButton
        :open="open"
        :class="ui.toggle({ toggleSide: 'right' })"
        @click="toggle"
      />
    </template>

    <template #body>
      <HeaderBody />
    </template>

    <template v-if="route.path.startsWith('/docs/')" #bottom>
      <HeaderBottom />
    </template>

  </UHeader>
</template>

docs/app/composables/useSearch.ts
export function useSearch() {
const route = useRoute()
const { frameworks } = useFrameworks()
const { track } = useAnalytics()
const { open, messages } = useChat()

const searchTerm = ref('')

function onSelect() {
track('AI Chat Opened', { source: 'search', hasSearchTerm: !!searchTerm.value })

    if (searchTerm.value) {
      messages.value = [...messages.value, {
        id: String(Date.now()),
        role: 'user',
        parts: [{ type: 'text', text: searchTerm.value }]
      }]
    }

    open.value = true

}

const links = computed(() => [{
label: 'Ask AI',
icon: 'i-lucide-bot-message-square',
kbds: ['meta', 'i'],
ui: {
itemLeadingIcon: 'group-data-highlighted:not-group-data-disabled:text-primary'
},
onSelect
}, {
label: 'Get Started',
description: 'Learn how to install and configure the library.',
icon: 'i-lucide-square-play',
to: '/docs/getting-started',
active: route.path.startsWith('/docs/getting-started')
}, {
label: 'Components',
description: 'Explore all available components.',
icon: 'i-lucide-square-code',
to: '/docs/components',
active: route.path.startsWith('/docs/components')
}, {
label: 'Composables',
description: 'Learn how to use the available composables.',
icon: 'i-lucide-square-function',
to: '/docs/composables',
active: route.path.startsWith('/docs/composables')
}, {
label: 'Typography',
description: 'Discover typography features and customization options.',
icon: 'i-lucide-square-pilcrow',
to: '/docs/typography',
active: route.path.startsWith('/docs/typography')
}, {
label: 'Templates',
description: 'Explore official starter templates.',
icon: 'i-lucide-panels-top-left',
to: '/templates'
}, {
label: 'Showcase',
description: 'Discover websites built with the library.',
icon: 'i-lucide-presentation',
to: '/showcase'
}, {
label: 'Community',
description: 'Explore community projects and resources.',
icon: 'i-lucide-globe',
to: '/community'
}, {
label: 'Playground',
description: 'Try components live in your browser.',
icon: 'i-lucide-square-terminal',
to: '/play',
target: '\_blank'
}, {
label: 'Blog',
description: 'Read articles and tutorials.',
icon: 'i-lucide-newspaper',
to: '/blog',
active: route.path.startsWith('/blog')
}, {
label: 'Figma',
description: 'Access the official Figma design kit.',
icon: 'i-simple-icons-figma',
to: '/figma'
}, {
label: 'Team',
description: 'Meet the team behind the project.',
icon: 'i-lucide-users',
to: '/team'
}, {
label: 'Releases',
description: 'Stay up to date with the latest changes.',
icon: 'i-lucide-rocket',
to: '/releases'
}, {
label: 'GitHub',
description: 'Check out the repository on GitHub.',
icon: 'i-simple-icons-github',
to: 'https://github.com/nuxt/ui/releases',
target: '\_blank'
}])

const groups = computed(() => [{
id: 'framework',
label: 'Framework',
items: frameworks.value
}, {
id: 'ai',
label: 'AI',
ignoreFilter: true,
postFilter: (searchTerm: string, items: any[]) => {
if (!searchTerm) {
return []
}

      return items
    },
    items: [{
      label: 'Ask AI',
      icon: 'i-lucide-bot-message-square',
      ui: {
        itemLeadingIcon: 'group-data-highlighted:not-group-data-disabled:text-primary'
      },
      onSelect
    }]

}])

return {
links,
groups,
searchTerm
}
}
