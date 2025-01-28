<!-- eslint-disable no-console -->
<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

// Daftar bahasa dengan ikon
const languages = computed(() =>
  locales.value.map(locale => ({
    value: locale.value,
    code: locale.code,
    icon:
      locale.value === 'en'
        ? 'openmoji:flag-england'
        : 'openmoji:flag-indonesia',
  })),
)

// Bahasa yang dipilih
const selected = ref(
  languages.value.find(language => language.value === locale.value) || languages.value[0],
)

// Fungsi toggle bahasa
function toggleLocale() {
  const newLocale = locale.value === 'en' ? 'id' : 'en'
  const newLanguage = languages.value.find(language => language.value === newLocale)
  if (newLanguage) {
    selected.value = newLanguage
    setLocale(newLocale)
  }
}
</script>

<template>
  <div>
    <UTooltip :text="locale === 'en' ? 'Switch to Indonesian' : 'Ubah ke Inggris'" placement="bottom">
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
        <UButton
          rel="alternate"
          square
          @click="toggleLocale"
        >
          <UIcon class="size-6" :name="selected?.icon || ''" /> <span class="sr-only">Lang</span>
        </UButton>
      </div>
    </UTooltip>
  </div>
</template>
