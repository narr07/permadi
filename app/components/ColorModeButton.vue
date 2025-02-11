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
  <div>
    <UButton
      class="button"
      :aria-label="isDark ? 'Aktifkan Tema Terang' : 'Aktifkan Tema Gelap'"
      square
      @click="isDark = !isDark"
    >
      <UIcon class="size-5" :name="isDark ? 'hugeicons:moon' : 'hugeicons:sun-02'" />
    </UButton>
  </div>
</template>
