<script setup lang="ts">
const { t } = useI18n()
const seoMeta = computed(() => ({
  title: 'Home',
  description: t('website.description'),
  keywords: 'dinar, permadi, dinar permadi, guru, developer, programmer',

}))
defineOgImageComponent('Page', {
  title: t('website.home'),
  description: t('website.description'),
})
useSeoMeta({
  title: seoMeta.value.title,
  description: seoMeta.value.description,
  keywords: seoMeta.value.keywords,
  twitterTitle: seoMeta.value.title,
  twitterDescription: seoMeta.value.description,

})
</script>

<template>
  <div>
    <HomeHero />
    <HomeSkill />
  </div>
</template>
