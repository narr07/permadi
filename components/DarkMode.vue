<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})

const ariaLabel = computed(() => {
  return isDark.value ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'
})
</script>

<template>
  <ClientOnly>
    <UTooltip
      text="Mode Warna"
      placement="bottom"
      :popper="{ arrow: true }"
    >
      <UButton

        :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
        color="gray"
        variant="ghost"
        :aria-label="ariaLabel"

        @click="isDark = !isDark"
      />
    </UTooltip>
    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>
