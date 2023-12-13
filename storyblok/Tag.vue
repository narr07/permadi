<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-console -->
<script setup>
defineProps({ blok: Object })
const articleTags = ref([])
const localePath = useLocalePath()
const storyblokApi = useStoryblokApi()
const resolveRelations = ['article.tag']
const tagId = 'Pendidikan'

const { data } = await storyblokApi.get('cdn/stories', {
  version: 'draft',
  starts_with: 'blog',
  is_startpage: false,
  resolve_relations: resolveRelations,
  filter_query: {

    tag: { any_in_array: '248f4463-8c33-415b-904a-25bd2cf76835' },

  },
})
articleTags.value = data.stories
console.log(articleTags.value)
</script>

<template>
  <UContainer class="py-24">
    <h2 v-if="blok && blok.label">
      INI tag {{ blok.label }}
    </h2>

    <div class="space-y-4 flex flex-col w-full">
      <div v-for="articleTag in articleTags" :key="articleTag.uuid">
        <NuxtLink :to="localePath(`/${articleTag.full_slug}`)">
          <UCard>
            <h2 class="font-body">
              {{ articleTag.content.title }}
            </h2>
          <!-- <ul>
            <li v-for="(tag, index) in articleTag.content.tag" :key="index">
              {{ tag.name }}
            </li>
          </ul> -->
          </UCard>
        </Nuxtlink>
      </div>
    </div>
  </UContainer>
</template>
