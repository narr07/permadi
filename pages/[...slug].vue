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
    ogType: () => "article",
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
  <!-- <StoryblokComponent v-if="pending === false && story" :blok="story.content" /> -->
</template>
