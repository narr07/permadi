<script lang="ts" setup>
function scrollToTop() {
  if (window) {
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <UButton
    icon="i-heroicons-chevron-up"
    variant="solid"
    size="xl"
    class="fixed z-50 bottom-5 left-5 backdrop-blur-md bg-permadi-200/80 text-black hover:!bg-permadi-300 dark:bg-permadi-800/80 dark:text-white dark:hover:!bg-permadi-900 transition duration-200"
    @click="scrollToTop()"
  />
</template>

<style></style>
