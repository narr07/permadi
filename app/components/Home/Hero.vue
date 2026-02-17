<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: '',
  description: '',
})
const { t } = useI18n()
const items = [
  {
    component: resolveComponent('SvgDev'),
    title: t('developer.title'),
    description: t('developer.description'),
  },
  {
    component: resolveComponent('SvgDesigner'),
    title: t('designer.title'),
    description: t('designer.description'),
  },
  {
    component: resolveComponent('SvgGuru'),
    title: t('teacher.title'),
    description: t('teacher.description'),
  },
]
</script>

<template>
  <div class="flex gap-4 flex-col md:flex-row items-stretch">
    <!-- Left Card: Hero Content -->
    <UCard
      class="flex-3"
      :ui="{ body: 'flex flex-col gap-6 h-full justify-center ' }"
    >
      <h1 class="text-g4 font-black font-title leading-[1.1] text-brand-900 dark:text-white uppercase transition-colors">
        <slot name="title" mdc-unwrap="p">
          {{ title }}
        </slot>
      </h1>

      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
        <slot name="description" mdc-unwrap="p">
          {{ description }}
        </slot>
      </p>
    </UCard>

    <!-- Right Card: Carousel Section -->
    <UCard class="flex-2 overflow-hidden" :ui="{ body: 'p-0 h-full flex flex-col relative' }">
      <!-- Radial Glow Background (Dark Mode Only)
      <div class="absolute inset-5 top-10 dark:bg-[radial-gradient(circle_at_50%_50%,var(--color-brand-400)_0%,transparent_70%)] hidden dark:block opacity-20 pointer-events-none" /> -->

      <UCarousel
        v-slot="{ item }"
        loop
        :items="items"
        :ui="{
          item: 'basis-full',
          dots: 'absolute inset-x-0 bottom-6 flex flex-wrap items-center justify-center gap-3',
        }"
        dots
        class="w-full h-full"
      >
        <div class="flex flex-col items-center justify-center p-8 pb-16 h-full text-center min-h-[400px] relative">
          <!-- Radial Glow Background -->

          <component :is="item.component" class="w-full max-h-64 drop-shadow-2xl z-10" />

          <div class="mt-8 space-y-2">
            <h3 class="text-xl font-black uppercase tracking-tight text-brand-900 dark:text-white font-title leading-tight">
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[240px] mx-auto">
              {{ item.description }}
            </p>
          </div>
        </div>
      </UCarousel>
    </UCard>
  </div>
</template>
