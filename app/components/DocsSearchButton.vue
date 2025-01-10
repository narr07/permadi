<!-- eslint-disable ts/no-use-before-define -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const { locale } = useI18n()

// Buat ref untuk menyimpan hasil pencarian
interface SearchItem {
  id: string
  title: string
  titles: string[]
  level: number
  content: string
}

const search = ref<SearchItem[]>([])

// Fungsi untuk memperbarui data pencarian
async function updateSearchData() {
  const { data } = await useAsyncData(`search-data-${locale.value}`, () =>
    queryCollectionSearchSections(`content_${locale.value}`))
  search.value = data.value || []
}

// Panggil pertama kali
await updateSearchData()

// Watch perubahan locale dan update data pencarian
watch(locale, async () => {
  await updateSearchData()
  // Update groups setelah data pencarian berubah
  groups.value = [
    {
      id: 'blog',
      label: 'Blog',
      level: 1,
      items: search.value
        .filter(item => item.id.startsWith('/blog')) // Filter untuk grup blog
        .map(item => ({
          label: item.title,
          suffix: item.content,
          to: `${item.id}`,
          icon: 'ph:notebook-duotone',
        })),
    },
    {
      id: 'project',
      label: 'Project',
      level: 1,
      items: search.value
        .filter(item => item.id.startsWith('/project')) // Filter untuk grup project
        .map(item => ({
          label: item.title,
          suffix: item.content,
          to: `${item.id}`,
          icon: 'hugeicons:folder-check',
        })),
    },
  ]
})

const router = useRouter()
const open = ref(false)

// Gunakan computed untuk groups agar reaktif
const groups = ref([
  {
    id: 'blog',
    label: 'Blog',
    level: 1,
    items: search.value
      .filter(item => item.id.startsWith('/blog')) // Filter untuk grup blog
      .map(item => ({
        label: item.title,
        suffix: item.content,
        to: `${item.id}`,
        icon: 'ph:notebook-duotone',
      })),
  },
  {
    id: 'project',
    label: 'Project',
    level: 1,
    items: search.value
      .filter(item => item.id.startsWith('/project')) // Filter untuk grup project
      .map(item => ({
        label: item.title,
        suffix: item.content,
        to: `${item.id}`,
        icon: 'hugeicons:folder-check',
      })),
  },
])

const value = ref({})

function onSelect(item: any) {
  if (item.onSelect) {
    item.onSelect()
  }
  else if (item.to) {
    if (typeof item.to === 'string' && (item.target === '_blank' || item.to.startsWith('http'))) {
      window.open(item.to, item.target || '_blank')
    }
    else {
      router.push(item.to)
    }
  }
  open.value = false
}

defineShortcuts({
  meta_k: () => {
    open.value = !open.value
  },
})
</script>

<template>
  <UModal
    v-model:open="open"

    :ui="{
      content: 'rounded max-w-[calc(100%-1rem)] h-80 sm:h-auto sm:max-h-[calc(100vh-4rem)] mx-2 mx-auto overflow-y-auto',
    }"
    close-icon="ph:x-square-duotone"
  >
    <UButton

      color="secondary"
      variant="outline"
      square
      icon="hugeicons:search-02"
      size="lg"
      aria-label="Search"
      @click="open = true"
    />
    <template #content>
      <UCommandPalette
        v-model="value"
        :groups="groups"
        class="flex-1  p-4  overflow-auto"
        :ui="{
          root: 'flex flex-col min-h-0 min-w-0 divide-y divide-[var(--ui-border)]',
        }"
        :fuse="{
          resultLimit: 5,
          matchAllWhenSearchEmpty: true,
          fuseOptions: { includeMatches: true },
        }"
        @update:model-value="onSelect"
      />
    </template>
  </UModal>
</template>
