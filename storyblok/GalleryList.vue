<script setup>
defineProps({ blok: Object })
</script>

<template>
  <UCard
    data-aos="zoom-in"
    data-aos-duration="300"
    class="cardHover text-center  p-1 md:p-0"
  >
    <div>
      <NuxtImg
        class="rounded aspect-square sm:w-48 object-cover bg-cover bg-permadi-300 dark:bg-permadi-700 sm:h-48 lg:w-60 lg:h-60 mx-auto ring-1 ring-permadi-800"
        :src="`${blok.image.filename}/m/600x0`"
        loading="lazy"
        height="500"
        width="500"
        :alt="blok.title"
      />
    </div>
    <div class="my-2">
      <h2 class="font-medium line-clamp-2">
        {{ blok.title }}
      </h2>
    </div>
    <Icon class="" :name="blok.tools.icon" size="32" />
  </UCard>
  <!-- End Col -->
  <!-- End Team -->
</template>
