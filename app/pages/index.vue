<script setup lang="ts">
// const { t } = useI18n()
const seoMeta = computed(() => ({
  // title: t("seo.home.title"),
  // description: t("seo.home.description"),
  title: 'Home',
  description: 'Home page',
}))
defineOgImageComponent('Page', {
  title: seoMeta.value.title,
  description: seoMeta.value.description,
})
useSeoMeta(seoMeta.value)
</script>

<template>
  <div class="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">
    <h1>
      OK
    </h1>
  </div>
</template>
