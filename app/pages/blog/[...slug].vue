<script lang="ts" setup>
import { useScrollspy } from '@/composables/useScrollspy'
import { useWindowScroll } from '@vueuse/core'

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

// Gunakan scrollspy untuk memantau heading
const headings = ref<Element[]>([]) // Referensi untuk elemen heading
const { activeHeadings, updateHeadings } = useScrollspy()
const { y } = useWindowScroll()

onMounted(() => {
  // Ambil semua elemen heading (misalnya <h2>) dari konten
  headings.value = Array.from(document.querySelectorAll('.prose h2, .prose h3'))
  updateHeadings(headings.value) // Daftarkan heading ke observer
})

function scrollToHeading(id: string) {
  const heading = document.getElementById(id)
  if (heading) {
    const offset = 100
    const top = heading.getBoundingClientRect().top + y.value - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

const open = ref(true)
</script>

<template>
  <UContainer class="relative overflow-auto min-h-screen">
    <!-- Header -->
    <UCard class="mb-2">
      <div v-if="page" :value="page">
        <h1 class="text-g3">
          {{ page.title }}
        </h1>
      </div>
    </UCard>
    <UCard class="mb-2">
      <UCollapsible v-model:open="open" class="flex flex-col  ">
        <UButton
          label="DAFTAR ISI"
          color="neutral"
          variant="subtle"
          :trailing-icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
          block
        />

        <template #content>
          <div>
            <ul>
              <li
                v-for="link in page?.body?.toc?.links"
                :key="link.id"
              >
                <NuxtLink
                  class="line-clamp-1"
                  :class="{
                    'text-blue-500 font-bold': activeHeadings.includes(link.id), // Tambahkan gaya untuk elemen aktif
                  }"
                  :to="`#${link.id}`"
                  @click.prevent="scrollToHeading(link.id)"
                >
                  {{ link.text }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </template>
      </UCollapsible>
    </UCard>

    <!-- Konten dan TOC -->
    <div class=" ">
      <!-- Konten -->
      <UCard>
        <div class="prose dark:prose-invert prose-sm drop max-w-6xl mx-auto prose-permadi">
          <ContentRenderer v-if="page" :value="page" />
        </div>
      </UCard>

      <!-- Daftar Isi -->
    </div>
  </UContainer>
</template>
