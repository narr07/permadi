<script setup lang="ts">
import { useId } from 'vue'

interface DotPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
  dotColor?: string // Warna titik
  dotSize?: number // Ukuran titik
}

const props = withDefaults(defineProps<DotPatternProps>(), {
  width: 10,
  height: 10,
  x: 0,
  y: 0,
  cx: 1,
  cy: 1,
  cr: 1,
  dotColor: 'black', // Default warna titik
  dotSize: 2, // Default ukuran titik
})

const id = `pattern-${useId()}`
</script>

<template>
  <svg
    aria-hidden="true"
    class="fixed inset-0 w-full h-full z-[-1]" :class="[props.className]"
    v-bind="props"
  >
    <defs>
      <!-- Define pattern with repeat -->
      <pattern
        :id="id"
        :width="props.width"
        :height="props.height"
        patternUnits="userSpaceOnUse"
        patternContentUnits="userSpaceOnUse"
        :x="props.x"
        :y="props.y"
      >
        <!-- Circle shape for the dot pattern -->
        <circle
          id="pattern-circle"
          :cx="props.cx"
          :cy="props.cy"
          :r="props.cr"
          class="fill-permadi-800 dark:fill-permadi-200 opacity-20"
        />
      </pattern>
    </defs>

    <!-- Use pattern to fill the background -->
    <rect width="100%" height="100%" stroke-width="0" :fill="`url(#${id})`" />
  </svg>
</template>
