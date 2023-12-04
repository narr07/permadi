<script setup>
const { slug } = useRoute().params
const { locale } = useI18n()
const resolveRelations = ['popular-articles.articles']
const url = slug && slug.length > 0 ? slug.join('/') : 'home'
const story = await useAsyncStoryblok(
  url.replace(/\/$/, ''),
  {
    version: 'draft',
    language: locale.value,
    resolve_relations: resolveRelations,
  },
  {
    resolveRelations,
  },
)
// const { slug } = useRoute().params;
// const url = slug && slug.length > 0 ? slug.join("/") : "home";
// const isPreview = useRuntimeConfig().public.NODE_ENV !== "production";
// const { locale } = useI18n();
// const resolveRelations = ["popular-articles.articles"];
// const { data: story, pending } = await useAsyncData(
//   `${locale.value}-${url}`,
//   async () => {
//     const { data } = await useStoryblokApi().get(
//       `cdn/stories/${url.replace(/\/$/, "")}`,
//       {
//         version: isPreview ? "draft" : "published",
//         language: locale.value,
//         resolve_relations: resolveRelations,
//       }
//     );
//     return data?.story;
//   }
// );
// if (!isPreview) {
//   if (!story.value) {
//     showError({ statusCode: 404, statusMessage: "Page Not Found" });
//   }
// }
// onMounted(() => {
//   if (isPreview && story.value && story.value.id) {
//     useStoryblokBridge(story.value.id, (evStory) => (story.value = evStory), {
//       resolveRelations,
//     });
//   }
// });
// seo
const metadata = story.value.content.metadata
const defaultTitle = 'Dinar Permadi Yusup: Desainer Grafis, Guru, dan Programmer Profesional'
const defaultDescription = 'Dinar Permadi Yusu: Desainer Grafis, Guru, dan Programmer Profesional. Temukan hal baru di website saya'
const titleMeta = metadata && metadata.title ? metadata.title : defaultTitle
const descriptionMeta
    = metadata && metadata.description
      ? metadata.description
      : defaultDescription
useServerSeoMeta({
  title: () => titleMeta,
  ogTitle: () => titleMeta,
  description: () => descriptionMeta,
  ogDescription: () => descriptionMeta,
  twitterTitle: () => titleMeta,
  twitterDescription: () => descriptionMeta,
  ogType: () => 'article',
  themeColor: '#023230',
})
defineOgImage({
  component: 'OgPage',
  title: titleMeta,
  description: descriptionMeta,
})
useHead({
  script: [
    {
      'src': 'https://unpkg.com/@tinybirdco/flock.js',
      'defer': true,
      'data-host': 'https://api.tinybird.co',
      'data-token': 'p.eyJ1IjogIjY5OWM3Y2E3LThmN2ItNDViNi05NDlmLTY2ZWMxOWI3MTQzNCIsICJpZCI6ICI2YThlMzQ4Ny1kMWQ2LTQwZmItOTNiZi1lZDZkNTZlNDk4MTgiLCAiaG9zdCI6ICJldV9zaGFyZWQifQ.Bfq9bp_LXUBLIK4U1R_s--_pUYNCFl628l-2yYB-PEs',
    },
  ],
})
</script>

<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
  <!-- <StoryblokComponent v-if="pending === false && story" :blok="story.content" /> -->
</template>
