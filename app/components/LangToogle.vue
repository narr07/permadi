<script setup lang="ts">
const { setLocale, locale } = useI18n()
</script>

<template>
  <div>
    <UButton
      :icon="locale === 'id' ? 'openmoji:flag-england' : 'openmoji:flag-indonesia'"
      square
      class="button"
      @click="setLocale(locale === 'id' ? 'en' : 'id')"
    >
      <span class="sr-only">
        {{ locale === 'id' ? 'Switch to English' : 'Ubah ke Indonesia' }}
      </span>
    </UButton>
  </div>
</template>
