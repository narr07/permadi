<script setup>
defineProps({ blok: Object })
</script>

<template>
  <UContainer class="py-14">
    <div class="mb-6 w-full mx-auto text-center">
      <h2
        data-aos="zoom-in"
        data-aos-duration="300"
        class="text-g2 md:text-g3"
      >
        {{ blok.headline }}
      </h2>
    </div>
    <div class="container mx-auto grid md:grid-cols-3 gap-4 my-12 place-items-start">
      <ArticlePopularCard
        v-for="article in blok.articles"
        :key="article.uuid"
        :article="article.content"
        :slug="article.full_slug"
      />
    </div>
  </UContainer>
</template>
