<script setup>
defineProps({ blok: Object })
</script>

<template>
  <!-- Card Section -->
  <UContainer v-editable="blok" class="py-14 lg:py-16 mx-auto">
    <div class="mb-6 w-full mx-auto text-center">
      <h2 data-aos="zoom-in" data-aos-duration="300" class="text-g2 md:text-g3">
        {{ blok.headline }}
      </h2>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      <!-- Card -->
      <StoryblokComponent
        v-for="item in blok.list"
        :key="item._uid"
        :blok="item"
      />
      <!-- End Card -->
    </div>
    <!-- End Grid -->
  </UContainer>
  <!-- End Card Section -->
</template>
