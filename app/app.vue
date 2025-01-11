<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
</script>

<template>
  <div>
    <Pattern />
    <UApp :locale="locales[locale as keyof typeof locales]">
      <NuxtLoadingIndicator color="#F9BC60" />
      <NuxtRouteAnnouncer />
      <NavBar />
      <div class="pt-[70px]">
        <NuxtPage />
      </div>

      <Footer />
    </UApp>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);

}
</style>
