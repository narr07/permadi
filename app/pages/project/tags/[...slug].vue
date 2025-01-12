<!-- eslint-disable no-console -->
<script setup lang="ts">
const route = useRoute()
const { slug } = route.params
const localePath = useLocalePath()
const { t } = useI18n()

const filter = Array.isArray(slug) ? slug : slug?.split(',')
console.log({ filter })

const { locale } = useI18n()

// Mengambil data berdasarkan tag
const { data: tags } = await useAsyncData(route.path, () => {
  return queryCollection(`blog_${locale.value}`)
    .where('tags', 'IN', filter)
    .all()
})
defineOgImageComponent('Page', {
  title: `${t('website.tag')} ${filter?.join(', ')}`,
  description: t('website.description'),
})
</script>

<template>
  <UContainer class="py-8">
    <header class="page-heading">
      <div class="wrapper">
        <h1 class="text-5xl font-extrabold">
          All tags with {{ filter?.join(', ') }}
        </h1>
        <p class="font-medium text-lg">
          Here's a list of all my great tags
        </p>
      </div>
    </header>
    <section class="page-section">
      <Tags />
      <ul class="article-list">
        <li v-for="article in tags" :key="article.path" class="article-item">
          <NuxtLink :to="localePath(`/blog${article.path}`)">
            <div class="wrapper">
              <header>
                <h1 class="text-2xl font-semibold">
                  {{ article.title }}
                </h1>
                <p>{{ article.description }}</p>
                <ul class="article-tags">
                  <li v-for="(tag, n) in article.tags" :key="n" class="tag">
                    <NuxtLink :to="localePath(`/blog/tags/${tag}`)" class="underline">
                      {{ tag }}
                    </NuxtLink>
                  </li>
                </ul>
              </header>
            </div>
          </NuxtLink>
        </li>
      </ul>
      <p v-if="!tags?.length">
        No tags found.
      </p>
    </section>
  </UContainer>
</template>
