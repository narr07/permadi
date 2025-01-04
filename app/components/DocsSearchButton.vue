<script setup lang="ts">
import { it } from '@nuxt/ui/runtime/locale/index.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Mengambil data dari blog
const { data } = await useAsyncData('search-data', () => queryCollectionSearchSections('blog'))

const router = useRouter()
const open = ref(false)

// Struktur grup untuk UCommandPalette
const groups = ref([
  {
    id: 'blog',
    label: 'Blog',
    items: (data.value || []).map(item => ({
      label: item.title, // Judul blog
      suffix: item.id, // ID atau slug untuk navigasi
      to: `${item.id}`, // Menentukan rute untuk navigasi
      target: '_self', // Menentukan target, bisa diubah sesuai kebutuhan
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
</script>

<template>
  <UModal
    v-model:open="open"
    title="Pencarian Blog"
    class="h-60"
    close-icon="ph:x-square-duotone"
  >
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-search"
      @click="open = true"
    />
    <template #body>
      <UCommandPalette
        v-model="value"
        :groups="groups"
        class="flex-1 scroll-py-10 h-80"
        :fuse="{
          resultLimit: 10,
          matchAllWhenSearchEmpty: true,
          fuseOptions:
            { includeMatches: true,
            } }"
        @update:model-value="onSelect"
      />
    </template>
  </UModal>
</template>
