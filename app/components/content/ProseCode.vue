<script setup lang="ts">
defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <slot />
</template>

<style scoped>
pre {
  margin-top: 0;
  margin-bottom: 0;
  padding: 0;
}
code .line {
  display: block;
  min-height: 1rem;
}
</style>
