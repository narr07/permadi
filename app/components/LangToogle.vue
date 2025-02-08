<script setup lang="ts">
const { setLocale, locales, locale } = useI18n()
</script>

<template>
  <UButtonGroup>
    <UButton
      v-for="_locale of locales"
      :key="_locale.code"
      block
      size="md"
      square
      :class="{
        'bg-permadi-200 hover:bg-permadi-200 dark:bg-yellow-500 dark:hover:bg-yellow-500 text-black': _locale.code === locale,
        'bg-white dark:bg-permadi-900 hover:bg-permadi-400 dark:hover:bg-permadi-800 dark:text-permadi-300 text-permmadi-800 ': _locale.code !== locale,
      }"
      class="md:px-4 px-3 ring-1 dark:ring-permadi-800  rounded text-permadi-900"
      aria-label="Change language"
      @click="setLocale(_locale.code)"
    >
      <span class="uppercase">
        {{ _locale.code }}
      </span>
    </UButton>
  </UButtonGroup>
</template>
