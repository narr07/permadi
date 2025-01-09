<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { t } = useI18n()

const { data: posts } = await useAsyncData(route.path, () => {
  return queryCollection(`blog_${locale.value}`)
    .order('date', 'DESC')
    .all()
})
</script>

<template>
  <UContainer>
    <div class="py-8">
      <h1
        v-motion
        :initial="{
          opacity: 0,
          y: 50,
        }"
        :visible="{
          opacity: 1,
          y: 0,
        }"
        class=" font-bold text-g4"
      >
        {{ t('project.title') }}
      </h1>
    </div>

    <div class="grid grid-cols-1  gap-4">
      <div
        v-for="post in posts"
        :key="post.id"
        v-motion
        :initial="{
          opacity: 0,
          y: 50,
        }"
        :visible="{
          opacity: 1,
          y: 0,
        }"
      >
        <NuxtLink :to="`blog${post.path}`">
          <UCard class="h-full hover:bg-yellow   duration-100 ease-in-out dark:hover:bg-permadi-700 ">
            <div class="flex flex-col p-2 h-full justify-between ">
              <h2 class="text-g2 line-clamp-2    text-balance font-semibold">
                {{ post.title }}
              </h2>
            </div>
            <template #header>
              INI FOT
            </template>
          </UCard>
        </NuxtLink>
      </div>
    </div>
    <ScrollToTop />
  </UContainer>
</template>
