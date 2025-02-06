<script setup lang="ts">
const { setLocale, locales, locale } = useI18n()
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <UButtonGroup>
      <UButton
        v-for="_locale of locales"
        :key="_locale.code"
        :label="`${_locale.name} (${_locale.code})`"
        color="neutral"
        :variant="_locale.code === locale ? 'solid' : 'outline'"
        class="px-4"
        @click="setLocale(_locale.code)"
      />
    </UButtonGroup>
    <NavBar />
    <UApp>
      <NuxtPage />
    </UApp>
  </div>
</template>
