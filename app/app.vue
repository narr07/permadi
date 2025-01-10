<script setup lang="ts">
const { locale, locales } = useI18n()
</script>

<template>
  <div>
    <UApp :locale="locales[locale]">
      <NuxtLoadingIndicator color="primary" />
      <NuxtRouteAnnouncer />
      <NavBar />
      <div class="py-[70px]">
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
