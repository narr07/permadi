<template>
  <UContainer>
    <UCard class="cardHover p-1 md:p-0">
      <div
        v-editable="article">
        <NuxtImg
          :src="article.image.filename + '/m/600x0'"
          height="200"
          width="500"
          :alt="article.image.alt"
          class="w-full h-48  rounded object-cover pointer-events-none" />
        <UBadge class="dark:bg-permadi-700 dark:text-permadi-200">
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
        <div class="mt-4">
          <NuxtLink   :to="'/' + slug">
            <h2 class="text-xl mb-3 line-clamp-2">
              {{ article.title }}
            </h2>
            <div class="line-clamp-3">
              {{ article.description }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
<script setup>
  defineProps({ article: Object, slug: String });
</script>
