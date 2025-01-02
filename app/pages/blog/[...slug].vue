<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})
</script>

<template>
  <UContainer>
    <UCard class="mb-2">
      <div v-if="page" :value="page">
        <h1>
          {{ page.title }}
        </h1>
      </div>
    </UCard>
    <UCard>
      <div class="prose dark:prose-dark">
        <ContentRenderer v-if="page" :value="page" />
      </div>
    </UCard>
  </UContainer>
</template>
