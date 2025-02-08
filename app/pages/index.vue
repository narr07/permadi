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

const HomeHero = defineAsyncComponent(() => import('../components/Home/Hero.vue'))
const HomeSkill = defineAsyncComponent(() => import('../components/Home/Skill.vue'))
</script>

<template>
  <div>
    <HomeHero />

    <HomeSkill />
  </div>
</template>
