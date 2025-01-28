<script lang="ts" setup>
function scrollToTop() {
  if (window) {
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <UButton
    icon="ph:caret-double-up-duotone"
    square

    rel="noopener noreferrer"
    class="fixed z-50   bottom-2  md:hidden  left-2 backdrop-blur-md bg-permadi-200/80 text-black hover:!bg-permadi-300 dark:bg-permadi-800/80 dark:text-white dark:hover:!bg-permadi-900 transition duration-200"
    @click="scrollToTop()"
  >
    <span class="sr-only">To Top</span>
  </UButton>
</template>

<style></style>
