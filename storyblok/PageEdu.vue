<script setup>
  const items = ref();
  const props = defineProps({ blok: Object });
</script>
<template>
  <UContainer v-editable="blok" class="max-w-3xl mx-auto mt-16 mb-20">
    <div class="mb-6 w-full mx-auto text-center">
      <h2 class="text-g2 md:text-g3">{{ blok.headline}}</h2>
    </div>
    <div>
      <template>
        <UAccordion :items="blok.list">
          <template #item="{ item }">
            <UBadge :label="item.years"  class="mb-2" />
            <p>{{ item.content }}</p>
          </template>
        </UAccordion>
      </template>
    </div>
  </UContainer>
</template>
