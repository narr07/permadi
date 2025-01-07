<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { t } = useI18n()

const { data: lastPost } = await useAsyncData(route.path, () => {
  return queryCollection(`blog_${locale.value}`).first()
})
</script>

<template>
  <UCard>
    <div
      class="flex flex-col h-full py-4 "
    >
      <div class="flex flex-col space-y-2  h-full justify-between">
        <h2> {{ t('hero.new') }}</h2>
        <NuxtLink :to="`blog${lastPost?.path}`">
          <UCard class="h-full hover:bg-yellow   duration-100 ease-in-out dark:hover:bg-permadi-700 ">
            <div class="flex flex-col not-even: h-full justify-between ">
              <h3 class="text-lg line-clamp-1    text-balance font-semibold">
                {{ lastPost?.title }}
              </h3>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </div>
  </UCard>
</template>
