<script setup>
defineProps({ blok: Object })
</script>

<template>
  <UCard
    :ui="{
      body: {
        padding: 'px-2 py-3 sm:p-3',
      },
    }"
    data-aos="zoom-in"
    data-aos-duration="300"
    class="group flex flex-col cardHover"
  >
    <div class="flex justify-between items-center">
      <div class="flex flow-row items-center">
        <Icon :name="blok.icon.icon" size="44" />
        <h3 v-editable="blok" class="ml-2 font-semibold">
          {{ blok.label }}
        </h3>
      </div>
      <div class="ps-3">
        <UButton
          :aria-label="blok.title"
          rel="noopener noreferrer"
          role="link"
          target="_blank"
          :to="blok.link"
          variant="ghost"
          icon="i-ph-arrow-square-up-right-duotone"
        />
      </div>
    </div>
  </UCard>
</template>
