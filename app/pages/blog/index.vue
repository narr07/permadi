<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Post {
  id: string
  title: string
  date: string
  tags: string[]
  path: string
}
// Ambil locale dan fungsi terjemahan
const { locale, t } = useI18n()
const localePath = useLocalePath()

const currentPage = ref(1) // Halaman saat ini
const itemsPerPage = 10 // Jumlah artikel per halaman

// Artikel dan total artikel
const posts = ref<Post[]>([])

const totalPosts = ref(0)

// Fungsi untuk mengambil data artikel berdasarkan bahasa
async function fetchPosts() {
  // Tidak perlu destructure { data }
  const data = await queryCollection(`blog_${locale.value}`)
    .order('date', 'DESC')
    .skip((currentPage.value - 1) * itemsPerPage)
    .limit(itemsPerPage)
    .all()

  const total = await queryCollection(`blog_${locale.value}`).count()

  return { posts: data, total }
}

// Fungsi untuk memuat ulang data
async function loadPosts() {
  const { posts: fetchedPosts, total } = await fetchPosts()
  posts.value = fetchedPosts || []
  totalPosts.value = total || 0
}

// Hitung jumlah halaman

// Fungsi untuk mengganti halaman
function changePage(page: number) {
  currentPage.value = page
  loadPosts() // Refresh data saat halaman berubah
}

// Muat data saat halaman atau bahasa berubah
watch([currentPage, locale], () => {
  loadPosts()
})

// Reset halaman ke 1 saat bahasa berubah
watch(locale, () => {
  currentPage.value = 1
})

// Muat data saat komponen di-mount
loadPosts()

defineOgImageComponent('Page', {
  title: t('website.blog'),
  description: t('website.description'),
})
</script>

<template>
  <UContainer>
    <!-- Judul -->
    <div class="py-8">
      <h1 class="font-bold text-g4">
        {{ t('blog.title') }}
      </h1>
    </div>

    <!-- Tags -->
    <div class="py-4">
      <Tags />
    </div>

    <!-- Daftar Artikel -->
    <div class="grid grid-cols-1 gap-4">
      <div v-for="post in posts" :key="post.id">
        <NuxtLink
          aria-label="`${t('article.read', { title: post.title })}`"
          :title="`${t('article.read', { title: post.title })}`"
          :to="`blog${post.path}`"
        >
          <UCard class="h-full hover:bg-yellow duration-100 ease-in-out dark:hover:bg-permadi-700">
            <div class="flex flex-col p-2 h-full justify-between">
              <h2 class="text-g3 line-clamp-2 text-balance font-semibold">
                {{ post.title }}
              </h2>
              <USeparator color="primary" />
              <div class="flex items-end justify-between h-full">
                <p class="text-base">
                  {{ new Date(post.date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                </p>
                <div class="mt-2 flex">
                  <!-- Hanya tampilkan tag pertama -->
                  <div v-if="post.tags.length > 0" class="mr-2">
                    <UButton
                      :to="localePath(`/blog/tags/${post.tags[0]}`)"
                      variant="subtle"
                      color="primary"
                      :aria-label="`Lihat artikel dengan tag ${post.tags[0]}`"
                      size="xs"
                    >
                      <p class="text-sm text-permadi-700 dark:text-permadi-300">
                        {{ post.tags[0] }}
                      </p>
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </div>
    <!-- Pagination -->
    <div class="flex justify-center mt-8">
      <UPagination
        v-model:page="currentPage"
        :total="totalPosts"
        :items-per-page="itemsPerPage"
        :sibling-count="1"
        show-edges
        @update:page="changePage"
      />
    </div>
    <ScrollToTop />
  </UContainer>
</template>
