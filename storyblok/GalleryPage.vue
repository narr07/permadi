<script setup>
defineProps({ blok: Object })
</script>

<template>
  <!-- Team -->
  <UContainer class="max-w-[85rem] py-24 md:pt-32 mx-auto">
    <!-- Title -->
    <div class="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
      <h1
        data-aos="zoom-in"
        data-aos-duration="300"
        class="text-center text-g2 md:text-g3 headline mb-4"
      >
        {{ blok.headline }}
      </h1>
    </div>
    <!-- End Title -->
    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 ">
      <StoryblokComponent
        v-for="blok in blok.body"
        :key="blok._uid"
        :blok="blok"
      />
    </div>
    <!-- End Grid -->
  </UContainer>
</template>
