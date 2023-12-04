<template>
  <UContainer class="py-24">
    <h1
      data-aos="zoom-in"
      data-aos-duration="300"
      class="text-center text-g2 md:text-g3 headline mb-4">
      {{ blok.headline }}
    </h1>
    <div class="flex w-full justify-center pt-2">
      <UButton
      class="ring-1 ring-permadi-800 dark:ring-permadi-600"
        data-aos="zoom-in"
        data-aos-duration="300"
        aria-label="search"
        :label="$i18n.locale === 'en' ? 'Search' : 'Pencarian'"
        rel="search"
        icon="i-ph-magnifying-glass-duotone"
        @click="isOpen = true" />
      <UModal
        :ui="{
          rounded: 'rounded',
          ring: 'ring-1 ring-permadi-800',
          inner: 'inset-4',
          container: 'items-center',
          padding: 'p-2 sm:p-0',
        }"
        v-model="isOpen">
        <UCard
          class="drop-shadow-2 dark:drop-shadow-2gelap transition bg-gray-400 dark:bg-gray-900 dark:ring-gray-800 ring-1 ring-gray-800">
          <template #header>
            <UInput
              v-model="query"
              name="query"
              :placeholder="$i18n.locale === 'en' ? 'Search Content...' : 'Cari Konten...'"
              icon="i-heroicons-magnifying-glass-20-solid"
              :ui="{ icon: { trailing: { pointer: '' } } }">
              <template #trailing>
                <UButton
                  aria-label="searchResults"
                  v-show="query !== ''"
                  color="merah"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  :padded="false"
                  @click="query = ''" />
              </template>
            </UInput>
          </template>
          <ul class="w-full h-80 overflow-y-auto scroll-py-3">
            <li
              class="flex cursor-default"
              v-for="hit in searchResults"
              :key="hit.uuid">
              <!-- Pastikan untuk menyertakan '/blog/' di depan slug -->
              <NuxtLink
                rel="noopener noreferrer"
                aria-label="searchResults"
                class="w-full p-1 font-normal"
                :to="hit.slug">
                <UCard
                  class="cardHover"
                  :ui="{
                    body: {
                      padding: 'px-2 py-2 sm:px-2 sm:py-2',
                    },
                  }">
                  <div>
                    <div>
                      <h3 class="line-clamp-1 text-sm font-bold">
                        {{ hit.content.title }}
                      </h3>
                      <p class="line-clamp-2 font-light text-xs">
                        {{ hit.content.description }}
                      </p>
                    </div>
                  </div>
                </UCard>
              </NuxtLink>
            </li>
          </ul>
        </UCard>
      </UModal>
    </div>
    <div
      class="mx-auto w-full grid grid-cols-1  md:grid-cols-2 gap-4 md:gap-12 my-12 place-items-start">
      <ArticleCard
        v-for="article in paginatedArticles"
        :key="article.uuid"
        :article="article.content"
        :slug="article.full_slug" />
    </div>
    <div class="mt-16 flex justify-center">
      <UPagination
        v-model="page"
        :max="5"
        :page-count="perPage"
        :total="jumlahTotal" />
    </div>
  </UContainer>
</template>
<script setup>
  defineProps({ blok: Object });
  const isOpen = ref(false);
  const query = ref("");
  const searchResults = ref([]);
  const articles = ref(null);
  const { locale } = useI18n();
  const storyblokApi = useStoryblokApi();
  const { data } = await storyblokApi.get("cdn/stories", {
    version: "draft",
    starts_with: "blog",
    language: locale.value,
    is_startpage: false,
  });
  articles.value = data.stories;
  async function search() {
    const { data } = await storyblokApi.get("cdn/stories", {
      version: "draft",
      starts_with: "blog",
      language: locale.value,
      is_startpage: false,
      cv: Date.now(),
      search_term: query.value,
    });
    const hits = data.stories.filter((story) => {
      // Gabungkan teks dari berbagai bidang konten yang ingin Anda cari
      const combinedText = `${story.content.title} ${story.content.description}`;
      // Ubah ke huruf kecil untuk pencarian case-insensitive
      return combinedText.toLowerCase().includes(query.value.toLowerCase());
    });
    searchResults.value = hits;
  }
  watch(query, search);
  const page = ref(1);
  const jumlahTotal = articles.value.length;
  const perPage = 6;
  const paginatedArticles = computed(() => {
    const startIndex = (page.value - 1) * perPage;
    const endIndex = startIndex + perPage;
    return articles.value.slice(startIndex, endIndex);
  });
</script>
