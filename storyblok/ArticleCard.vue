<script setup>
defineProps({ article: Object, slug: String })
const localePath = useLocalePath()
</script>

<template>
  <div class="w-full h-full" data-aos="zoom-in" data-aos-duration="200">
    <UCard class="cardHover p-1 h-full md:p-0">
      <div v-editable="article">
        <!-- Gambar Artikel -->
        <NuxtImg
          :src="`${article.image.filename}/m/600x0`"
          height="200"
          loading="lazy"
          width="500"
          :alt="article.image.alt"
          class="w-full h-48 ring-1 ring-permadi-800 rounded object-cover pointer-events-none"
        />
        <!-- Badge Tanggal -->
        <div class="flex justify-between items-center h-full">
          <div>
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
          </div>
          <!-- <div>
            <UBadge class="dark:bg-permadi-700 mt-2 dark:text-permadi-200">
              <span v-for="tag in article.tag" :key="tag">
                {{ tag.tag }} </span>
            </UBadge>
          </div> -->
        </div>
        <div class="mt-4">
          <!-- Judul Artikel -->
          <NuxtLink :to="localePath(`/${slug}`)">
            <h2 class="text-xl mb-2 line-clamp-2">
              {{ article.title }}
            </h2>
            <!-- Deskripsi Artikel -->
            <p class="line-clamp-3 text-sm">
              {{ article.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </UCard>
  </div>
</template>
