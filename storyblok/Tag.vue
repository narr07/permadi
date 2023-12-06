<script setup>
defineProps({ blok: Object })
</script>

<template>
  <UContainer v-editable="blok" class="py-24">
    <h1 class="headline">
      {{ blok.label }}
    </h1>
    Masih dalam proses pengerjaan
    <UCard>
      <H2>Artikel dengan Tag <span> {{ blok.label }}</span> </H2>
    </UCard>
  </UContainer>
</template>
