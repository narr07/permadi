<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const showButton = computed(() => y.value > 300)

const circumference = 2 * Math.PI * 45 // radius 45 for viewBox 100

const scrollProgress = computed(() => {
  if (!import.meta.client)
    return 0
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight
  return totalHeight > 0 ? y.value / totalHeight : 0
})

const strokeDashoffset = computed(() => {
  return circumference - (scrollProgress.value * circumference)
})

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-10 opacity-0 scale-90"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100 scale-100"
    leave-to-class="translate-y-10 opacity-0 scale-90"
  >
    <div
      v-if="showButton"
      class="fixed bottom-6 right-6 z-50"
    >
      <div class="relative flex items-center justify-center p-1 group">
        <!-- Progress Circle -->
        <svg
          class="absolute inset-0 size-full -rotate-90 transform pointer-events-none"
          viewBox="0 0 100 100"
        >
          <!-- Background circle (optional, provides a track) -->
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            class="stroke-gray-200/50 dark:stroke-gray-800/50"
            stroke-width="6"
          />
          <!-- Progress circle -->
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            class="text-primary-500 "
            stroke-width="6"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
          />
        </svg>

        <!-- Button -->
        <UButton
          icon="i-narr-arrow-up"
          color="neutral"
          variant="subtle"
          size="xs"
          class="rounded-full    relative z-10"
          aria-label="Back to Top"
          @click="scrollToTop"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Ensure smooth rotation on the SVG for the dashoffset to work correctly from top */
svg {
  filter: drop-shadow(0 4px 6px -1px rgb(0 0 0 / 0.1));
}
</style>
