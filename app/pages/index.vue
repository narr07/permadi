<script setup lang="ts">
const { t } = useI18n()
const hydrate = useBoosterHydrate()

const PageHero = hydrate(
  () => import('~/components/content/PageHero.vue'),
)
const PageSkill = hydrate(
  () => import('~/components/content/PageSkill.vue'),
)

const seoMeta = computed(() => ({
  title: 'Home',
  description: t('website.description'),
}))

useSeoMeta(seoMeta.value)

defineOgImageComponent('Page', {
  title: 'Home',
  description: t('website.description'),
})
</script>

<template>
  <div>
    <PageHero />
    <PageSkill />
  </div>
</template>
