<script setup lang="ts">
import SvgDesigner from './SvgDesigner.vue'
import SvgGuru from './SvgGuru.vue'
import SvgProgrammer from './SvgProgrammer.vue'

const items = [
  { component: SvgDesigner, title: 'Designer' },
  { component: SvgGuru, title: 'Teacher' },
  { component: SvgProgrammer, title: 'Programmer' },
]
</script>

<template>
  <UContainer class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <UCard class="flex flex-col">
      <UCarousel
        v-slot="{ item }"
        loop
        :autoplay="{ delay: 2000 }" :items="items" class="w-full max-w-xs mx-auto"
      >
        <div class="w-full flex flex-col justify-center items-center">
          <component :is="item.component" />
          <h3 class="mt-2 text-center">
            {{ item.title }}
          </h3>
        </div>
      </UCarousel>
    </UCard>
    <UCard class="flex flex-col py-6 justify-center items-center text-center">
      <h2 v-show="$slots.title" class="pb-4 font-black text-g3">
        <slot name="title" mdc-unwrap="p" />
      </h2>
      <slot />
    </UCard>
  </UContainer>
</template>
