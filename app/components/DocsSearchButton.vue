<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const { locale } = useI18n()
const localePath = useLocalePath()

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
  try {
    const data = await queryCollectionSearchSections(`content_${locale.value}`)
    search.value = data || [] // Fallback ke array kosong jika data undefined atau null
  }
  catch (error) {
    console.error('Gagal memuat data pencarian:', error)
    search.value = [] // Fallback ke array kosong jika terjadi error
  }
}

// Panggil pertama kali
updateSearchData()

// Watch perubahan locale dan update data pencarian
watch(localePath, updateSearchData)
watchEffect(() => {
  updateSearchData()
})

// Gunakan computed untuk membuat grup secara reaktif
const groups = computed(() => [
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
])

const router = useRouter()
const open = ref(false)
const value = ref({})

// Fungsi untuk menangani pemilihan item pencarian
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

// Shortcut keyboard untuk membuka modal
defineShortcuts({
  meta_k: () => {
    open.value = !open.value
  },
})
</script>

<template>
  <!-- Tombol pencarian -->
  <UButton
    square
    icon="hugeicons:search-02"
    size="lg"
    aria-label="Search"
    @click="open = true"
  />

  <!-- Modal pencarian -->
  <UModal
    v-model:open="open"
    :ui="{
      content: 'rounded max-w-[calc(100%-1rem)] h-80 sm:h-auto sm:max-h-[calc(100vh-4rem)] mx-2 mx-auto overflow-y-auto',
    }"
    close-icon="ph:x-square-duotone"
  >
    <template #content>
      <UCommandPalette
        v-model="value"
        :groups="groups"
        class="flex-1 p-4 overflow-auto"
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
