<script setup>
  const props = defineProps({ blok: Object });
</script>
<template>
  <UContainer v-editable="blok">
    <header class="flex items-center h-screen overflow-hidden">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <h1
          data-aos="zoom-in"
          data-aos-duration="300"
          class="text-g3 lg:text-g4 text-center"
          itemprop="headline">
          {{ blok.headline }}
        </h1>
        <p
          data-aos="zoom-in"
          data-aos-duration="300"
          data-aos-delay="100"
          class="mt-5 max-w-3xl text-center mx-auto text-body-dark"
          itemprop="description">
          {{ blok.subheadline }}
        </p>
        <div class="mt-8 gap-3 flex justify-center">
          <UButton
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="300"
            to="/cv.pdf"
            target="_blank"
            class=" ring-1 ring-primary-800">
            <Icon :name="blok.cta_icon.icon" />
            {{ blok.cta }}
          </UButton>
        </div>
      </div>
    </header>
  </UContainer>
</template>
