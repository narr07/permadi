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
  <div class="flex flex-col gap-16 lg:gap-24 items-center justify-center py-8">
    <!-- Top Section: Text & Logo -->
    <div class="flex flex-col items-center justify-center text-center gap-8 w-full">
      <h1 class="max-w-5xl text-4xl md:text-5xl font-black font-title leading-[1.1] text-brand-900 dark:text-white uppercase transition-colors">
        <slot name="title" mdc-unwrap="p">
          {{ title }}
        </slot>
      </h1>

      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
        <slot name="description" mdc-unwrap="p">
          {{ description }}
        </slot>
      </p>

      <Logo class="mt-4" size="160" />
    </div>

    <!-- Bottom Section: Grid of Cards -->
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      <UCard
        v-for="(item, index) in items"
        :key="index"
        class="h-full transition-transform duration-300 hover:shadow-xl dark:hover:shadow-primary/10"
        :ui="{ body: 'p-8 flex flex-col items-center justify-center text-center h-full' }"
      >
        <component :is="item.component" class="w-full max-h-48 drop-shadow-2xl z-10 mb-8" />

        <h3 class="text-xl font-black uppercase tracking-tight text-brand-900 dark:text-white font-title leading-tight mb-3">
          {{ item.title }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[240px] mx-auto">
          {{ item.description }}
        </p>
      </UCard>
    </div>
  </div>
</template>
