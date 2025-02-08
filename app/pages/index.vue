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
  <div>
    <HomeHero />
    <UContainer>
      <HomeLast />
    </UContainer>
  </div>
</template>
