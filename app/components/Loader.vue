<script lang="ts" setup>
defineProps<{
  isMounting: boolean
}>()
</script>

<template>
  <div
    v-if="!isMounting"
    class="bg-permadi-400 z-[999999] min-w-full min-h-dvh fixed top-0 left-0 text-permadi-900 flex justify-center items-center"
  >
    <div class="flex flex-col items-center ">
      <div class="animate-bounce ease-in-out mb-4">
        <Logo height="200px" width="200px" />
      </div>
      <div>
        <div class="text-4xl font-bold font-title animate-pulse  text-permadi-800">
          Loading ...
        </div>
      </div>
    </div>
  </div>
</template>
