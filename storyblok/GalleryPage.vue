<template>
  <!-- Team -->
  <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <!-- Title -->
    <div class="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
      <h2
        class="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
        Our leadership
      </h2>
    </div>
    <!-- End Title -->
    <!-- Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
      <StoryblokComponent
        v-for="blok in blok.body"
        :key="blok._uid"
        :blok="blok" />
    </div>
    <!-- End Grid -->
  </div>
</template>
<script setup>
  defineProps({ blok: Object });
</script>
