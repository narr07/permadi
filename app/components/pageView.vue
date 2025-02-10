<script setup>
const views = await usePageViews()
</script>

<template>
  <div>
    <UTooltip text="Page Views" :delay-duration="1">
      <UButton icon="i-lucide-rocket" color="neutral">
        Page views: {{ views }}
      </UButton>
    </UTooltip>
  </div>
</template>
