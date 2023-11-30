<script setup>
  const props = defineProps({ blok: Object });
  const textContent = computed(() => renderRichText(props.blok.content));
</script>
<template>
  <div>
    <p>{{ blok.label }}</p>
    <div v-html="textContent" class="prose"></div>
  </div>
</template>
