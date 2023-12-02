<template>
  <!-- Team -->
  <UContainer class="max-w-[85rem]  py-20  mx-auto">
    <!-- Title -->
    <div class="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
      <h1 data-aos="zoom-in"
          data-aos-duration="300"
      class="text-g3 text-center">
        Gallery Saya
      </h1>
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
  </UContainer>
</template>
<script setup>
  defineProps({ blok: Object });
</script>
