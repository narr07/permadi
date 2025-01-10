<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { t } = useI18n()

const { data: lastPost } = await useAsyncData(route.path, () => {
  return queryCollection(`blog_${locale.value}`).first()
})
</script>

<template>
  <div>
    <h2>{{ t('hero.new') }}</h2>
    <NuxtLink :to="`/blog${lastPost?.path}`">
      <UCard class="h-full hover:bg-yellow duration-100 ease-in-out dark:hover:bg-permadi-700">
        <div class="flex flex-col h-full justify-between">
          <h3 class="text-lg line-clamp-1 text-balance font-semibold">
            {{ lastPost?.title }}
          </h3>
        </div>
      </UCard>
    </NuxtLink>
  </div>
</template>
