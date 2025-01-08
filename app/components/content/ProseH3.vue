<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h2)))
</script>

<template>
  <h2 :id="props.id">
    <NuxtLink
      v-if="props.id && generate"
      class="dark:text-yellow md:border-none no-underline border-b-2 border-dashed   hover:ring md:p-1.5  dark:hover:bg-yellow-600/20 text-g2  hover:bg-permadi-400/40  md:rounded font-bold"
      :to="`#${props.id}`"
    >
      <span class="opacity-30 font-light">
        #
      </span>
      <slot />
    </NuxtLink>
    <slot v-else />
  </h2>
</template>
