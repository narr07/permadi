<script lang="ts" setup>
const { visitors } = useVisitors()
</script>

<template>
  <div>
    <UTooltip text="Visitors" :delay-duration="1">
      <UButton icon="i-lucide-user" color="neutral">
        User Online: {{ visitors }}
      </UButton>
    </UTooltip>
  </div>
</template>
