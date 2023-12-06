<script setup>
defineProps({ blok: Object })
const tags = ref(null)
const storyblokApi = useStoryblokApi()
const { data } = await storyblokApi.get('cdn/stories', {
  version: 'draft',
  starts_with: 'tags',
  is_startpage: false,
})
tags.value = data.stories
</script>

<template>
  <div class="py-24">
    <h2 class="text-6xl text-[#50b0ae] font-bold text-center mb-12">
      {{ blok.headline }}
    </h2>
    <div class="container mx-auto grid md:grid-cols-3 gap-12 my-12 place-items-start">
      <TagCard
        v-for="tag in tags"
        :key="tag.uuid"
        :tag="tag.content"
        :slug="tag.full_slug"
      />
    </div>
  </div>
</template>
