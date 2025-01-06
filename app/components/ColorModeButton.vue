<script setup>
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton
      v-motion
      :tapped="{
        scale: 0.8,
      }"
      color="primary"
      variant="subtle"
      :aria-label="isDark ? 'Aktifkan Tema Terang' : 'Aktifkan Tema Gelap'"
      square
      @click="isDark = !isDark"
    >
      <UIcon class="size-6" :name="isDark ? 'openmoji:new-moon-face' : 'openmoji:sun-with-face'" />
    </UButton>
    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
