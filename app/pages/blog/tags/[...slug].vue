<script setup lang="ts">
const route = useRoute()
const { slug } = route.params
const localePath = useLocalePath()

// Mengubah slug menjadi array jika itu adalah string yang dipisahkan koma
const filter = Array.isArray(slug) ? slug : slug?.split(',')

const { locale } = useI18n()

// Mengambil data berdasarkan tag
const { data: tags } = await useAsyncData('tags', () => {
  return queryCollection(`blog_${locale.value}`)
    .where('tags', 'LIKE', `%${filter?.join('%')}%`) // Filter dengan LIKE
    .all()
})
</script>

<template>
  <UContainer class="py-8">
    <header class="page-heading">
      <div class="wrapper">
        <h1 class="text-5xl font-extrabold">
          All tags with {{ filter?.join(', ') }}
        </h1>
        <p class="font-medium text-lg">
          Here's a list of all my great tags
        </p>
      </div>
    </header>

    <section class="page-section">
      <!-- Komponen Tags jika ada -->
      <Tags />

      <ul class="mt-6">
        <li v-if="!tags?.length">
          No articles found for the selected tags.
        </li>

        <li v-for="article in tags" :key="article.path" class="flex flex-col mb-4">
          <NuxtLink :to="localePath(`/blog${article.path}`)">
            <UCard class=" hover:bg-yellow   duration-100 ease-in-out dark:hover:bg-permadi-700 ">
              <header>
                <h1 class="text-2xl font-semibold">
                  {{ article.title }}
                </h1>
                <p class="line-clamp-2">
                  {{ article.description }}
                </p>
                <ul class="mt-4 flex flex-wrap">
                  <li v-for="(tag, n) in article.tags" :key="n" class="mr-2 mb-2">
                    <NuxtLink :to="localePath(`/blog/tags/${tag}`)">
                      <UBadge>
                        {{ tag }}
                      </UBadge>
                    </NuxtLink>
                  </li>
                </ul>
              </header>
            </UCard>
          </NuxtLink>
        </li>
      </ul>

      <p v-if="!tags?.length">
        No tags found.
      </p>
    </section>
  </UContainer>
</template>
