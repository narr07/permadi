<script setup>
const { setLocale, locale } = useI18n()
const currentLocale = ref(locale.value)

function toggleLocale() {
  const newLocale = currentLocale.value === 'en' ? 'id' : 'en'
  setLocale(newLocale)
  currentLocale.value = newLocale
}
</script>

<template>
  <ClientOnly>
    <UTooltip :text="currentLocale === 'en' ? 'Switch to Indonesian' : 'Ubah ke  Inggris'" placement="bottom">
      <UButton
        :icon="currentLocale === 'en' ? 'circle-flags:en' : 'circle-flags:id'"
        color="primary"
        variant="subtle"
        :aria-label="currentLocale === 'en' ? 'Switch to Indonesian' : 'Switch to English'"
        @click="toggleLocale"
      />
    </UTooltip>
    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
