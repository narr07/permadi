<script setup>
  const props = defineProps({ blok: Object });
</script>
<template>
  <UContainer v-editable="blok">
    <header class="flex items-center h-screen overflow-hidden">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <h1 class="text-g3 lg:text-g4 text-center" itemprop="headline">
          {{ blok.headline }}
        </h1>
        <div class="mt-5 max-w-3xl text-center mx-auto">
          <p itemprop="description">
            {{ blok.subheadline }}
          </p>
        </div>
        <div class="mt-8 gap-3 flex justify-center">
          <UButton
            :to="blok.cta_url"
            class="animate-bounce ring-1 ring-primary-800">
            <Icon :name="blok.cta_icon.icon" />
            {{ blok.cta }}
          </UButton>
        </div>
      </div>
    </header>
  </UContainer>
  <UContainer class="pb-20">
    <!-- Grid -->
    <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
      <UCard class="relative drop-shadow-2 dark:drop-shadow-2gelap">
        <Swiper
          :slides-per-view="1"
          :modules="[SwiperAutoplay, SwiperPagination]"
          :loop="true"
          :pagination="true"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: true,
          }">
          <SwiperSlide>
            <div class="flex items-center justify-center">
              <svgGuru />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="flex items-center justify-center">
              <SvgProgrammer />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="flex items-center justify-center">
              <SvgDesigner />
            </div>
          </SwiperSlide>
        </Swiper>
      </UCard>
      <div>
        <h1 class="block text-g3">
          {{ blok.headline }}
        </h1>
        <p class="mt-3 text-lg text-gray-800 dark:text-gray-400">
          {{ blok.subheadline }}
        </p>
        <!-- Buttons -->
        <div class="mt-7 grid gap-3 w-full sm:inline-flex">
          <a
            class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="#">
            Get started
            <svg
              class="flex-shrink-0 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
        </div>
        <!-- End Buttons -->
        <!-- Review -->
      </div>
      <!-- End Col -->
    </div>
    <!-- End Grid -->
  </UContainer>
  <!-- End Hero -->
</template>
