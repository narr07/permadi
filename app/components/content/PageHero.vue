<script setup lang="ts">
import SvgDesigner from './SvgDesigner.vue'
import SvgGuru from './SvgGuru.vue'
import SvgProgrammer from './SvgProgrammer.vue'

const { t } = useI18n()
const items = [
  { component: SvgDesigner, title: t('focus.desain') },
  { component: SvgGuru, title: t('focus.guru') },
  { component: SvgProgrammer, title: t('focus.program') },
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
      <h1 class="pb-4 font-black text-g3">
        Dinar Permadi Yusup
      </h1>
      <DelayHydration>
        <LazyHeroDescription />
      </DelayHydration>
    </UCard>
  </UContainer>
</template>
