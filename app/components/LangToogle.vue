<script setup lang="ts">
const { setLocale, locales, locale } = useI18n()
</script>

<template>
  <UButtonGroup>
    <UButton
      v-for="_locale of locales"
      :key="_locale.code"
      square
      size="lg"
      :variant="_locale.code === locale ? 'solid' : 'outline'"
      class="px-4 "
      aria-label="Change language"
      @click="setLocale(_locale.code)"
    >
      <span class="uppercase">
        {{ _locale.code }}
      </span>
    </UButton>
  </UButtonGroup>
</template>
