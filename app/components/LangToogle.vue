<script setup lang="ts">
const { setLocale, locale } = useI18n()
</script>

<template>
  <!-- Menampilkan hanya satu tombol sesuai dengan bahasa yang sedang aktif -->
  <UButton
    :key="locale"
    class="button"
    square
    :icon="locale === 'id' ? 'openmoji:flag-england' : 'openmoji:flag-indonesia'"
    aria-label="Change language"
    @click="setLocale(locale === 'en' ? 'id' : 'en')"
  >
    <span class="sr-only">
      {{ locale }} <!-- Display language based on current locale -->
    </span>
  </UButton>
</template>
