<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="py-10">
    <USeparator
      :label="label"
      color="primary"
      :ui="{
        root: 'flex items-center',
        container: 'order-first flex shrink-0 pe-6',
        label: 'text-lg font-black uppercase  font-title',
      }"
    />
  </div>
</template>
