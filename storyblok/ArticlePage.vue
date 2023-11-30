<template>
  <div class="py-24">
    <h1 class="text-center mb-12">All Artcle</h1>
    <div class=" mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 my-12 place-items-start">
      <ArticleCard
        v-for="article in articles"
        :key="article.uuid"
        :article="article.content"
        :slug="article.full_slug"
      />
    </div>
  </div>
</template>
<script setup>
defineProps({ blok: Object })
const articles = ref(null)
const storyblokApi = useStoryblokApi()
const { data } = await storyblokApi.get('cdn/stories', {
  version: 'draft',
  starts_with: 'blog',
  is_startpage: false,
})
articles.value = data.stories
</script>