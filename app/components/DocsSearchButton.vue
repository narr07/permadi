<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// const route = useRoute()
const { locale } = useI18n()

// const { data: page } = await useAsyncData(route.path, () => {
//   return queryCollection(`content_${locale.value}`).first()
// })
// Mengambil data dari blog
const { data: search } = await useAsyncData('search-data', () => queryCollectionSearchSections(`content_${locale.value}`))

const router = useRouter()
const open = ref(false)

const groups = ref([
  {
    id: 'blog',
    label: 'Blog',
    level: 1,
    items: (search.value || []).map(item => ({
      label: item.title, // Judul blog
      suffix: item.content, // ID atau slug untuk navigasi
      to: `${item.id}`, // Menentukan rute untuk navigasi
      icon: 'ph:notebook-duotone', // Ganti dengan ikon default
    })),
  },
])

const value = ref({})

// Fungsi untuk menangani pemilihan item
function onSelect(item: any) {
  if (item.onSelect) {
    item.onSelect()
  }
  else if (item.to) {
    if (typeof item.to === 'string' && (item.target === '_blank' || item.to.startsWith('http'))) {
      window.open(item.to, item.target || '_blank')
    }
    else {
      router.push(item.to) // Menggunakan router untuk navigasi
    }
  }
  open.value = false // Menutup modal setelah pemilihan item
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
      color="primary"
      variant="subtle"
      icon="i-lucide-search"
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
          resultLimit: 10,
          matchAllWhenSearchEmpty: true,
          fuseOptions: { includeMatches: true },
        }"
        @update:model-value="onSelect"
      />
    </template>
  </UModal>
</template>
