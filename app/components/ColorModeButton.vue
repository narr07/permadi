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
  <div
    v-motion
    :initial="{
      scale: 1,
    }"
    :hovered="{
      scale: 1,
    }"
    :tapped="{
      scale: 0.8,
    }"
  >
    <ClientOnly v-if="!colorMode?.forced">
      <UButton
        color="secondary"
        variant="outline"

        :aria-label="isDark ? 'Aktifkan Tema Terang' : 'Aktifkan Tema Gelap'"
        square
        @click="isDark = !isDark"
      >
        <UIcon class="size-6" :name="isDark ? 'hugeicons:moon' : 'hugeicons:sun-02'" />
      </UButton>
      <template #fallback>
        <div class="size-8" />
      </template>
    </ClientOnly>
  </div>
</template>
