<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const pendidikan = ref<TimelineItem[]>([
  {
    date: '2015 - 2021',
    title: 'Universitas Pendidikan Indonesia',
    description: 'S1 PGSD',
    icon: 'i-lucide-school',
  },
  {
    date: '2012 - 2015',
    title: 'SMA Negeri 1 Rajagaluh',
    description: 'Sekolah Menengah Atas - Jurusan IPA',
    icon: 'i-lucide-graduation-cap',
  },
  {
    date: '2009 - 2012',
    title: 'SMP Negeri 1 Rajagaluh',
    description: 'Sekolah Menengah Pertama',
    icon: 'i-lucide-book',
  },
  {
    date: '2003 - 2009',
    title: 'SD Negeri Teja 1',
    description: 'Sekolah Dasar',
    icon: 'i-lucide-book-open',
  },

])
</script>

<template>
  <UContainer>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center">
      <!-- Kolom Kiri: Timeline -->
      <UCard class="space-y-4">
        <UTimeline :items="pendidikan" />
      </UCard>

      <!-- Kolom Kanan: Gambar (hidden di mobile) -->
      <UCard class="hidden lg:block">
        <NuxtImg
          src="/logo.png"
          alt="Education"
          class="w-auto items-center justify-center h-96"
        />
      </UCard>
    </div>
  </UContainer>
</template>
