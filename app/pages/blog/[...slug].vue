<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})
</script>

<template>
  <UContainer>
    <UCard>
      <ContentRenderer v-if="page" :value="page" />
    </UCard>
  </UContainer>
</template>
