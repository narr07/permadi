<script setup>
const props = defineProps({ blok: Object })
const items = ref()
</script>

<template>
  <div>
    <UContainer v-editable="blok" class="max-w-3xl mx-auto mt-16">
      <div class="mb-6 w-full mx-auto text-center">
        <h2
          data-aos="zoom-in"
          data-aos-duration="300"
          class="text-g2 md:text-g3"
        >
          {{ blok.headline }}
        </h2>
      </div>
      <UAccordion data-aos="zoom-in" data-aos-duration="300" :items="blok.list">
        <template #item="{ item }">
          <UBadge
            data-aos="zoom-in"
            data-aos-duration="100"
            :label="`Tahun: ${item.years}`"
            class="mb-2"
          />
          <div data-aos="zoom-in" data-aos-duration="100">
            {{ item.content }}
          </div>
        </template>
      </UAccordion>
    </UContainer>
  </div>
</template>
