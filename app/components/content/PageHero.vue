<script setup lang="ts">
// Gunakan dynamic import untuk SVG components
const SvgDesigner = defineAsyncComponent(() => import('./SvgDesigner.vue'))
const SvgGuru = defineAsyncComponent(() => import('./SvgGuru.vue'))
const SvgProgrammer = defineAsyncComponent(() => import('./SvgProgrammer.vue'))

const { t } = useI18n()
const items = [
  { component: markRaw(SvgDesigner), title: t('focus.desain') },
  { component: markRaw(SvgGuru), title: t('focus.guru') },
  { component: markRaw(SvgProgrammer), title: t('focus.program') },
]
</script>

<template>
  <UContainer class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <UCard class="flex flex-col py-6 justify-center items-center text-center">
      <h1 class="pb-4 font-black text-g3">
        Dinar Permadi Yusup
      </h1>
      <DelayHydration>
        <LazyHeroDescription />
      </DelayHydration>
    </UCard>
    <UCard class="flex flex-col">
      <UCarousel
        v-slot="{ item }"
        loop
        :autoplay="{ delay: 2000 }"
        :items="items"
        class="w-full max-w-xs mx-auto"
      >
        <div class="w-full flex flex-col justify-center items-center">
          <Suspense>
            <component :is="item.component" />
            <template #fallback>
              <div class="loading-placeholder">
                <USkeleton height="200px" width="200px" />
              </div>
            </template>
          </Suspense>
          <h3 class="mt-2 text-center">
            {{ item.title }}
          </h3>
        </div>
      </UCarousel>
    </UCard>
  </UContainer>
</template>
