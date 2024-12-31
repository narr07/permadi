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
  <UCard class="">
    <h2 v-if="$slots.title" class=" md:text-8xl font-black text-5xl">
      <slot name="title" mdc-unwrap="p" />
    </h2>
    <slot />
  </UCard>
</template>
