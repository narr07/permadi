<script setup>
// eslint-disable-next-line unused-imports/no-unused-vars
const props = defineProps({ blok: Object })
</script>

<template>
  <UContainer>
    <header class="flex items-center h-screen overflow-hidden">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <h1
          v-editable="blok"
          data-aos="zoom-in"
          data-aos-duration="300"
          class="text-g2 md:text-g3 text-center dark:text-permadi-200"
          itemprop="headline"
        >
          <span class="text-permadi-500 dark:text-yellow">
            Dinar Permadi Yusup:
          </span> <br>
          {{ blok.headline }}
        </h1>
        <p
          v-editable="blok"
          data-aos="zoom-in"
          data-aos-duration="300"
          data-aos-delay="100"
          class="mt-5 max-w-3xl text-center mx-auto text-body-dark"
          itemprop="description"
        >
          {{ blok.subheadline }}
        </p>
        <div class="mt-8 gap-3 flex justify-center">
          <UButton
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="300"
            to="/tags"
            class=" ring-1 ring-primary-800"
          >
            <Icon :name="blok.cta_icon.icon" />
            {{ blok.cta }}
          </UButton>
        </div>
      </div>
    </header>
  </UContainer>
</template>
