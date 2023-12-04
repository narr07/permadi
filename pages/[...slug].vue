<script setup>
  const { slug } = useRoute().params;
  const { locale } = useI18n();
  const resolveRelations = ["popular-articles.articles"];
  const url = slug && slug.length > 0 ? slug.join("/") : "home";
  const story = await useAsyncStoryblok(
    url.replace(/\/$/, ""),
    {
      version: "draft",
      language: locale.value,
      resolve_relations: resolveRelations,
    },
    {
      resolveRelations,
    }
  );
  //seo
  const metadata = story.value.content.metadata;
  const defaultTitle = "Dinar";
  const defaultDescription = "Personal Website Dinar Permadi  Yusup";
  const title = metadata && metadata.title ? metadata.title : defaultTitle;
  const description =
    metadata && metadata.description
      ? metadata.description
      : defaultDescription;
  useServerSeoMeta({
    title: () => title,
    ogTitle: () => title,
    description: () => description,
    ogDescription: () => description,
    twitterTitle: () => title,
    twitterDescription: () => description,
    themeColor: "#023230",
  });
  defineOgImage({
    component: "OgPage",
    title: title,
    description: description,
  });
</script>
<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>
