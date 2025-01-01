<script setup lang="ts">
const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())
</script>

<template>
  <UContainer>
    <h1>Blog</h1>
    <div
      v-for="post in posts" :key="post.id"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <NuxtLink :to="post.path">
        <UCard>
          <h2 class="text-xl md:text-3xl text-balance font-semibold">
            {{ post.title }}
          </h2>
          <template #footer>
            <p>  {{ new Date(post.date).toLocaleDateString() }}</p>
            <div>
              <ul>
                <div v-for="tag in post.tags" :key="tag">
                  <UBadge size="lg" color="primary" variant="outline">
                    {{ tag }}
                  </UBadge>
                </div>
              </ul>
            </div>
          </template>
        </UCard>
      </NuxtLink>
    </div>
  </UContainer>
</template>
