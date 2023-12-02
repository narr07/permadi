<template>
  <UCard class="cardHover text-center">
    <NuxtImg
      class="rounded-xl sm:w-48 sm:h-48 lg:w-60 lg:h-60 mx-auto"
      :src="blok.image.filename + '/m/600x0'"
      :alt="blok.title" />
    <div class="mt-2">
      <h3
        class="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-gray-200">
        {{ blok.title }}
      </h3>
    </div>
  </UCard>
  <!-- End Col -->
  <!-- End Team -->
</template>
<script setup>
  defineProps({ blok: Object });
</script>
