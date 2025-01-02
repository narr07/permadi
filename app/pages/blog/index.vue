<script setup lang="ts">
const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())
</script>

<template>
  <UContainer>
    <div class="grid grid-cols-1  gap-4">
      <div
        v-for="post in posts" :key="post.id"
      >
        <NuxtLink :to="post.path">
          <UCard class="h-full hover:bg-yellow hover:drop-shadow-2 dark:hover:drop-shadow-2gelap   duration-100 ease-in-out dark:hover:bg-permadi-700 ">
            <div class="flex flex-col p-2 h-full justify-between ">
              <h2 class="text-xl   md:text-2xl text-balance font-semibold">
                {{ post.title }}
              </h2>
              <USeparator color="primary" class="py-4" />
              <div class="flex items-end   justify-between h-full">
                <p class="text-base">
                  {{ new Date(post.date).toLocaleDateString() }}
                </p>
                <div>
                  <ul>
                    <div v-for="tag in post.tags" :key="tag">
                      <UBadge size="lg" color="neutral" variant="outline">
                        {{ tag }}
                      </UBadge>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </div>
  </UContainer>
</template>
