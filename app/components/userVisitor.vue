<script lang="ts" setup>
const { visitors } = useVisitors()
</script>

<template>
  <div>
    <UTooltip text="Visitors" :delay-duration="1">
      <UButton icon="i-lucide-user" color="neutral">
        <span>
          {{ visitors }}
        </span>
      </UButton>
    </UTooltip>
  </div>
</template>
