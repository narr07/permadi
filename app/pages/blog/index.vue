<script setup lang="ts">
const { locale } = useI18n()
const { t } = useI18n()
const localePath = useLocalePath()

const { data: posts } = await useAsyncData('blogPage', () => {
  return queryCollection(`blog_${locale.value}`)
    .order('date', 'DESC')
    .all()
})

// for seo
// const { data: blogPage } = await useAsyncData('blog', () => {
//   return queryCollection(`blog_${locale.value}`)
//     .first()
// })
defineOgImageComponent('Page', {
  title: t('website.blog'),
  description: t('website.description'),
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
        {{ t('blog.title') }}
      </h1>
    </div>
    <div class="py-4">
      <Tags />
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
              <h2 class="text-g3 line-clamp-2    text-balance font-semibold">
                {{ post.title }}
              </h2>
              <USeparator color="primary" />
              <div class="flex items-end   justify-between h-full">
                <p class="text-base">
                  {{ new Date(post.date).toLocaleDateString() }}
                </p>
                <div>
                  <ul class=" mt-2 flex flex-wrap">
                    <li v-if="post.tags.length" class="mr-2 ">
                      <NuxtLink :to="localePath(`/blog/tags/${post.tags[0]}`)">
                        <UButton
                          variant="subtle"
                          color="primary"
                          :aria-label="post.tags[0]"
                          size="xs"
                        >
                          <p class="text-sm text-permadi-700 dark:text-permadi-300">
                            {{ post.tags[0] }}
                          </p>
                        </UButton>
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </div>
    <ScrollToTop />
  </UContainer>
</template>
