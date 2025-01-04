<script setup lang="ts">
const searchTerm = ref('')
const open = ref(false) // Kontrol modal
// Definisi tipe untuk opsi pencarian
interface Option {
  id: string
  label: string
  content?: string
  suffix?: string
  to?: string
}
// Mengambil data sections
const { data: sections, status } = await useAsyncData('Pencarian', () => {
  return queryCollectionSearchSections('blog').then(data =>
    data.map(section => ({
      id: section.id,
      label: section.title,
      content: section.content,
      suffix: `Level ${section.level}`,
      to: `${section.id}`, // Sesuaikan path dengan kebutuhan
    })),
  )
})
const groups = computed(() => [
  {
    id: 'sections',
    label: searchTerm.value ? `Pencarian “${searchTerm.value}”...` : 'Sections',
    items: sections.value?.filter(section =>
      section.label.toLowerCase().includes(searchTerm.value.toLowerCase()),
    ) || [],
    ignoreFilter: true,
  },
])
// Fungsi untuk navigasi dan menutup modal
const router = useRouter()
function onSelect(option: Option) {
  if (option.to) {
    router.push(option.to)
    open.value = false // Tutup modal setelah navigasi berhasil
  }
}
</script>

<template>
  <UModal
    v-model:open="open" title="Pencarian"
    class="h-60"
    close-icon="ph:x-square-duotone"
    :ui="{
      overlay: 'fixed inset-0 bg-[var(--ui-bg-elevated)]/40 backdrop-blur-sm',
      content: 'fixed  w-full h-2/3 bg-[var(--ui-bg)] divide-y divide-[var(--ui-border)] flex flex-col focus:outline-none',
      header: 'px-4 py-5 sm:px-6',
      body: 'flex-1 overflow-y-auto   p-1 sm:p-1',
      footer: 'flex items-center gap-1.5 p-4 sm:px-6',
      title: 'text-[var(--ui-text-highlighted)] font-semibold',
      description: 'mt-1 text-[var(--ui-text-muted)] text-sm',
      close: 'absolute top-4 end-4',

    }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-search"
      @click="open = true"
    />
    <template #body>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :loading="status === 'pending'"
        :groups="groups"
        placeholder="Pencarian..."
        class="h-80"
        @update:model-value="onSelect"
      />
    </template>
  </UModal>
</template>
