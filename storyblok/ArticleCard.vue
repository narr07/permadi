<template>
  <div data-aos="zoom-in" data-aos-duration="200">
    <UCard class="cardHover p-1 md:p-0">
      <div v-editable="article">
        <NuxtImg
          :src="article.image.filename + '/m/600x0'"
          height="200"
          width="500"
          :alt="article.image.alt"
          class="w-full h-48 rounded object-cover pointer-events-none" />
        <UBadge class="dark:bg-permadi-700 mt-2 dark:text-permadi-200">
          <time>
            {{
              new Date(article.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            }}
          </time>
        </UBadge>
        <div class="mt-2">
          <NuxtLink :to="'/' + slug">
            <h2 class="text-xl mb-2 line-clamp-2">
              {{ article.title }}
            </h2>
            <p class="line-clamp-3 text-sm">
              {{ article.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </UCard>
  </div>
</template>
<script setup>
  defineProps({ article: Object, slug: String });
</script>
