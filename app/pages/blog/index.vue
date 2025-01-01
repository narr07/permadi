<script setup lang="ts">
const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())
</script>

<template>
  <UContainer>
    <h1>Blog</h1>
    <div v-for="post in posts" :key="post.id">
      <NuxtLink :to="post.path">
        <UCard>
          <h2>
            {{ post.title }}
          </h2>

          <p class="line-clamp-2">
            {{ post.description }}
          </p>
          <p><strong>Author:</strong> {{ post.author }}</p>
          <p><strong>Date:</strong> {{ new Date(post.date).toLocaleDateString() }}</p>
          <div>
            <strong>Tags:</strong>
            <ul>
              <div v-for="tag in post.tags" :key="tag">
                {{ tag }}
              </div>
            </ul>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </UContainer>
</template>
