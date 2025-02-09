<script setup lang="ts">
// const { t } = useI18n()
const seoMeta = computed(() => ({
  title: 'Home',
  description: 'Home page',
  keywords: 'dinar, permadi, dinar permadi, guru, developer, programmer',
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
