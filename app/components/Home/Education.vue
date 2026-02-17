<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const pendidikan = ref<TimelineItem[]>([
  {
    date: '2015 - 2021',
    title: 'Universitas Pendidikan Indonesia',
    description: 'S1 PGSD',
    icon: 'i-lucide-school',
    value: 'upi',
  },
  {
    date: '2012 - 2015',
    title: 'SMA Negeri 1 Rajagaluh',
    description: 'Sekolah Menengah Atas - Jurusan IPA',
    icon: 'i-lucide-graduation-cap',
    value: 'sman1rjl',
  },
  {
    date: '2009 - 2012',
    title: 'SMP Negeri 1 Rajagaluh',
    description: 'Sekolah Menengah Pertama',
    icon: 'i-lucide-book',
    value: 'smpn1rjl',
  },
  {
    date: '2003 - 2009',
    title: 'SD Negeri Teja 1',
    description: 'Sekolah Dasar',
    icon: 'i-lucide-book-open',
    value: 'sdn1teja',
  },
])

const active = ref<string | number>('upi')

const activeSchool = computed(() => pendidikan.value.find(item => item.value === active.value))

function onSelect(_e: Event, item: TimelineItem) {
  if (item.value) {
    active.value = item.value
  }
}
</script>

<template>
  <UContainer>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center">
      <!-- Kolom Kiri: Timeline -->
      <UCard
        class="border dark:border-primary-700/30 border-primary-900/10"
        :ui="{ body: 'p-6' }"
      >
        <UTimeline
          v-model="active"
          :items="pendidikan"
          class="cursor-pointer"
          @select="onSelect"
        />
      </UCard>

      <!-- Kolom Kanan: Gambar & Detail (hidden di mobile) -->
      <UCard
        class="hidden lg:flex flex-col items-center justify-center text-center h-full min-h-[300px] border dark:border-primary-700/30 border-primary-900/10 spotlight"
        spotlight
      >
        <div v-if="activeSchool" class="space-y-6">
          <div class="flex justify-center">
            <div class="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <UIcon :name="activeSchool.icon" class="w-16 h-16 text-primary" />
            </div>
          </div>

          <div class="space-y-2">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ activeSchool.title }}
            </h3>
            <p class="text-primary font-medium">
              {{ activeSchool.date }}
            </p>
            <p class="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {{ activeSchool.description }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
