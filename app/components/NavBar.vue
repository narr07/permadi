<script setup lang="ts">
const localePath = useLocalePath()
const nav = [
  { url: '/', title: 'home' },
  { url: '/blog', title: 'blog' },
]
</script>

<template>
  <nav>
    <div v-for="item in nav" :key="item.url">
      <NuxtLink :to="localePath(item.url)">
        {{ item.title }}
      </NuxtLink>
    </div>
  </nav>
</template>
