<script setup lang="ts">
const tabItems = [
  {
    label: '1',
    icon: 'i-lucide-layout-template',
    content: 'Creative Designer focused on building beautiful and intuitive user interfaces. I love playing with colors and layouts to create the best user experience.',
  },
  {
    label: '2',
    icon: 'i-lucide-code',
    content: 'Full-stack Developer with a passion for clean code and efficient architectures. Building robust applications with modern technologies like Nuxt and Vue.',
  },
  {
    label: '3',
    icon: 'i-lucide-graduation-cap',
    content: 'Educator and mentor sharing knowledge about web development and design. Helping aspiring developers grow their skills and reach their potential.',
  },
]

const carouselItems = [
  'designer',
  'developer',
  'teacher',
]
</script>

<template>
  <UContainer class="py-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Left Column: Tabs -->
      <div class="space-y-6">
        <UTabs :items="tabItems" class="w-full">
          <template #content="{ item }">
            <UCard class="mt-4">
              <p class="text-lg text-gray-600 dark:text-gray-400">
                {{ item.content }}
              </p>
            </UCard>
          </template>
        </UTabs>
      </div>

      <!-- Right Column: Carousel -->
      <div class="flex justify-center items-center pb-8">
        <UCarousel
          v-slot="{ item }"
          :items="carouselItems"
          loop
          :autoplay="{ delay: 1000 }"
          dots
          :ui="{
            item: 'basis-full',
            dot: 'cursor-pointer size-3 bg-permadi-500 data-[state=active]:bg-yellow-500 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-permadi-700',
            dots: 'flex justify-center gap-2',
          }"
          class="w-full max-w-sm"
        >
          <div class="flex flex-col items-center justify-center w-full">
            <SvgDesigner v-if="item === 'designer'" class="h-64 lg:h-80" />
            <SvgDev v-else-if="item === 'developer'" class="h-64 lg:h-80" />
            <SvgGuru v-else-if="item === 'teacher'" class="h-64 lg:h-80" />

            <p class="mt-4 text-2xl font-black text-permadi-700 dark:text-permadi-400">
              {{ $t(`global.${item}`) }}
            </p>
          </div>
        </UCarousel>
      </div>
    </div>
  </UContainer>
</template>

<!-- <template>
  <UTabs :items="tabItems" class="w-full">
    <template #designer>
      <UCard class="mt-4">
        <h3 class="text-xl font-bold mb-4">Creative Designer Skills</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-figma" class="size-12 mb-2 text-purple-500" />
            <span class="text-sm font-medium">Figma</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-palette" class="size-12 mb-2 text-pink-500" />
            <span class="text-sm font-medium">UI Design</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-layout" class="size-12 mb-2 text-blue-500" />
            <span class="text-sm font-medium">Layouts</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-paintbrush" class="size-12 mb-2 text-orange-500" />
            <span class="text-sm font-medium">Illustration</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-image" class="size-12 mb-2 text-green-500" />
            <span class="text-sm font-medium">Graphics</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-sparkles" class="size-12 mb-2 text-yellow-500" />
            <span class="text-sm font-medium">Creative</span>
          </div>
        </div>
      </UCard>
    </template>

    <template #developer>
      <UCard class="mt-4">
        <h3 class="text-xl font-bold mb-4">Developer Skills</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-code" class="size-12 mb-2 text-green-600" />
            <span class="text-sm font-medium">Vue.js</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-box" class="size-12 mb-2 text-blue-600" />
            <span class="text-sm font-medium">Nuxt</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-database" class="size-12 mb-2 text-purple-600" />
            <span class="text-sm font-medium">Database</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-server" class="size-12 mb-2 text-red-600" />
            <span class="text-sm font-medium">Backend</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-terminal" class="size-12 mb-2 text-gray-600" />
            <span class="text-sm font-medium">DevOps</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-git-branch" class="size-12 mb-2 text-orange-600" />
            <span class="text-sm font-medium">Git</span>
          </div>
        </div>
      </UCard>
    </template>

    <template #teacher>
      <UCard class="mt-4">
        <h3 class="text-xl font-bold mb-4">Teaching Skills</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-graduation-cap" class="size-12 mb-2 text-blue-500" />
            <span class="text-sm font-medium">Mentoring</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-book-open" class="size-12 mb-2 text-green-500" />
            <span class="text-sm font-medium">Tutorial</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-presentation" class="size-12 mb-2 text-purple-500" />
            <span class="text-sm font-medium">Workshop</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-video" class="size-12 mb-2 text-red-500" />
            <span class="text-sm font-medium">Video Course</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-users" class="size-12 mb-2 text-yellow-500" />
            <span class="text-sm font-medium">Community</span>
          </div>
          <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-lightbulb" class="size-12 mb-2 text-orange-500" />
            <span class="text-sm font-medium">Guidance</span>
          </div>
        </div>
      </UCard>
    </template>
  </UTabs>
</template>

<script setup>
const tabItems = [
  {
    label: 'Designer',
    icon: 'i-lucide-layout-template',
    slot: 'designer', // Nama slot yang akan digunakan
  },
  {
    label: 'Developer',
    icon: 'i-lucide-code',
    slot: 'developer',
  },
  {
    label: 'Teacher',
    icon: 'i-lucide-graduation-cap',
    slot: 'teacher',
  },
]
</script> -->
