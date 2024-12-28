<!-- <script setup>
defineProps({
  title: {
    type: String,
    default: 'Default title',
  },
  description: {
    type: String,
    default: 'Default description',
  },

})
</script> -->

<template>
  <div class="p-6 border text-center bg-white dark:bg-black dark:border-gray-700 rounded">
    <h2 v-if="$slots.title" class="text-8xl font-black">
      <slot name="title" mdc-unwrap="p" />
    </h2>
    <slot />
  </div>
</template>
