<script lang="ts" setup>
import type { Collections } from '@nuxt/content'
import { queryCollection, useRoute } from '#imports'
import { useScrollspy } from '@/composables/useScrollspy'
import { useWindowScroll } from '@vueuse/core'
import { withLeadingSlash } from 'ufo'
import { computed, onMounted, ref } from 'vue'

const { t } = useI18n()
const { locale } = useI18n()
const localePath = useLocalePath()
const { calculateReadingTime, formatReadingTime } = useReadingTime()

// Ambil rute sekali saat inisialisasi
const route = useRoute()
const slug = computed(() => withLeadingSlash(String(route.params.slug)))

// Ambil data artikel saat ini
const { data: pageBlog } = await useAsyncData(`page-${locale.value}-${slug.value}`, async () => {
  const collection = (`blog_${locale.value}`) as keyof Collections
  const content = await queryCollection(collection).path(slug.value).first()
  if (!content)
    throw new Error('Content not found')
  return content
}, {
  watch: [locale], // Pastikan slug juga dipantau
})

if (pageBlog.value?.ogImage) {
  defineOgImage(pageBlog.value.ogImage)
}

// Ambil artikel sebelumnya dan berikutnya
const { data: surroundingBlog } = await useAsyncData(`surround-${locale.value}-${slug.value}`, async () => {
  if (!pageBlog.value)
    return null
  return queryCollectionItemSurroundings(`blog_${locale.value}`, slug.value, {
    before: 1,
    after: 1,
  }).order('date', 'DESC')
}, {

  watch: [locale], // Pastikan slug juga dipantau
})

defineOgImageComponent('Page', {
  title: pageBlog.value?.title,
  description: pageBlog.value?.description,
})

useSeoMeta({
  title: pageBlog.value?.title || '',
  description: pageBlog.value?.description,
  keywords: pageBlog.value?.tags
    ? pageBlog.value.tags.join(', ')
    : 'dinar, permadi, dinar permadi, guru, developer, programmer',
  author: 'Dinar Permadi Yusup',
  articleAuthor: ['Dinar Permadi Yusup'],
  articleSection: () => pageBlog.value?.title,
  articleTag: () => pageBlog.value?.tags,
  ogType: 'article',
  twitterTitle: () => pageBlog.value?.title,
  twitterDescription: () => pageBlog.value?.description,
  twitterData1: 'Dinar Permadi Yusup',
  twitterLabel1: 'Author',
  twitterData2: () => formatReadingTime(calculateReadingTime(pageBlog.value?.body)),
  twitterLabel2: 'Read Time',

})

// Gunakan scrollspy untuk memantau heading
const headings = ref<Element[]>([]) // Referensi untuk elemen heading
const { activeHeadings, updateHeadings } = useScrollspy()
const { y } = useWindowScroll()

onMounted(() => {
  // Ambil semua elemen heading (misalnya <h2>, <h3>, dan <h4>) dari konten
  headings.value = Array.from(document.querySelectorAll('.prose h2, .prose h3, .prose h4'))
  updateHeadings(headings.value) // Daftarkan heading ke observer
})

// Fungsi untuk scroll ke heading tertentu
function scrollToHeading(id: string) {
  const heading = document.getElementById(id)
  if (heading) {
    const offset = 100
    const top = heading.getBoundingClientRect().top + y.value - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

const { countTotalWords } = useReadingTime()

const wordCount = computed(() => countTotalWords(pageBlog.value?.body || {}))

// const currentLanguage = computed(() => {
//   const lang = locales.value.find(_locale => _locale.code === locale.value)
//   return lang ? lang.name : 'Unknown' // Jika tidak ditemukan, return 'Unknown'
// })

useSchemaOrg([
  defineArticle({
    headline: pageBlog.value?.title,
    description: pageBlog.value?.description,
    title: pageBlog.value?.title,
    datePublished: pageBlog.value?.date,
    author: {
      name: 'Dinar Permadi Yusup',
      url: 'https://permadi.dev',
    },
    wordCount: wordCount.value,
    inLanguage: locale.value,
  }),
])

const formatted = computed(() => {
  return formatDate(pageBlog.value?.date?.toString() || '', locale.value)
})

const open = ref(false)

const items = ref([
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: localePath('/'),
  },
  {
    label: 'Blog',
    icon: 'i-lucide-newspaper',
    to: localePath('/blog'),
  },

])

const { copy, copied } = useClipboard()
const toast = useToast()

// const isButtonVisible = ref(false)
// const timeout = ref<number | null>(null)

// const { y: scrollY } = useScroll(window)

// watch(scrollY, () => {
//   if (timeout.value) {
//     clearTimeout(timeout.value)
//   }
//   isButtonVisible.value = true
//   timeout.value = setTimeout(() => {
//     isButtonVisible.value = false
//   }, 5000) as unknown as number
// })
</script>

<template>
  <UContainer>
    <!-- Header -->
    <UCard class="mb-2">
      <UBreadcrumb :items="items" />
    </UCard>
    <article class="md:flex-row flex-col flex gap-4">
      <div class="md:w-3/4">
        <UCard class="mb-2">
          <div v-if="pageBlog" :value="pageBlog">
            <h1 class="text-g3">
              {{ pageBlog.title }}
            </h1>
          </div>
          <p>
            {{ pageBlog?.description }}
          </p>
        </UCard>

        <UCard class="mb-2 md:hidden">
          <div>{{ formatted }}</div>
        </UCard>
        <UCard class="mb-2 md:hidden">
          <div class="flex gap-2 justify-center flex-wrap">
            <SocialShare
              v-for="network in ['facebook', 'x', 'linkedin', 'email', 'whatsapp']"
              :key="network"
              :network="network"
              :styled="true"
              :label="false"
            />

            <UButton color="neutral" :icon="copied ? 'i-ph-check-square-duotone' : 'i-ph-copy-duotone'" square size="lg" @click="copy(`http://permadi.dev${locale === 'id' ? '' : `/${locale}`}/blog${slug}`); toast.add({ title: t('blog.coppy'), icon: 'i-ph-check-fat-duotone', duration: 1500 })" />
          </div>
        </UCard>
        <UCard class="mb-2 md:hidden">
          <div>
            <div class="flex flex-wrap gap-2">
              <!-- Batasi hanya 3 tag yang ditampilkan -->
              <div v-for="tag in pageBlog?.tags.slice(0, 3)" :key="tag">
                <NuxtLink :to="localePath(`/blog/tags/${tag}`)">
                  <UButton
                    variant="subtle"
                    color="primary"
                    :aria-label="tag"
                    size="xs"
                  >
                    <p class="text-sm text-permadi-700 dark:text-permadi-300">
                      {{ tag }}
                    </p>
                  </UButton>
                </NuxtLink>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Konten -->
        <UCard>
          <div class="prose dark:prose-invert overflow-y-hidden prose-sm max-w-6xl mx-auto prose-permadi">
            <ContentRenderer v-if="pageBlog" :value="pageBlog" />
          </div>
        </UCard>
        <!-- <div v-show="isButtonVisible" class="fixed z-50 bottom-3 right-2 md:hidden"> -->
        <div class="fixed z-50 bottom-3 right-2 md:hidden">
          <UCollapsible v-model:open="open" class="flex flex-col items-end">
            <!-- Tambahkan `items-end` untuk memposisikan konten di kanan -->
            <UButton
              rel="noopener"
              square
              class="button"
              color="neutral"
              variant="subtle"
              :trailing-icon="open ? 'ph:x-square-duotone' : 'ph:list-bullets-duotone'"
            >
              <span class="sr-only"> {{ t('blog.toc') }} </span>
            </UButton>

            <template #content>
              <UCard class="py-2 m-2">
                <ul class="space-y-1">
                  <li v-for="link in pageBlog?.body?.toc?.links" :key="link.id">
                    <!-- Parent heading -->
                    <NuxtLink
                      class="line-clamp-1 rounded p-1 m-2"
                      :class="{
                        'bg-yellow-500 text-permadi-900 dark:text-permadi-900 ring ring-permadi-800': activeHeadings.includes(link.id),
                      }"
                      :to="`#${link.id}`"
                      @click.prevent="scrollToHeading(link.id)"
                    >
                      <p class="line-clamp-1 text-sm">
                        {{ link.text }}
                      </p>
                    </NuxtLink>

                    <!-- Sub-headings/children -->
                    <ul v-if="link.children?.length" class="ml-4 m-2 space-y-1">
                      <li v-for="child in link.children" :key="child.id">
                        <NuxtLink
                          class="line-clamp-1 rounded p-1"
                          :class="{
                            'bg-yellow-200 text-permadi-900 dark:text-permadi-900 ring ring-permadi-800': activeHeadings.includes(child.id),
                          }"
                          :to="`#${child.id}`"
                          @click.prevent="scrollToHeading(child.id)"
                        >
                          <p class="line-clamp-1 text-sm">
                            {{ child.text }}
                          </p>
                        </NuxtLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </UCard>
            </template>
          </UCollapsible>
        </div>
      </div>

      <!-- Bagian Sidebar -->
      <div class="w-1/4 hidden md:flex flex-col  space-y-4">
        <div class=" sticky top-[86px] ">
          <UCard class="mb-2">
            <div class="flex gap-2 justify-center flex-wrap">
              <SocialShare
                v-for="network in ['facebook', 'x', 'linkedin', 'email', 'whatsapp']"
                :key="network"
                :network="network"
                :styled="true"
                :label="false"
              />
            </div>
          </UCard>
          <UCard class="mb-2">
            <div>{{ formatted }}</div>
          </UCard>
          <!-- TOC -->
          <UCard class="mb-2">
            <UCollapsible v-model:open="open" class="flex flex-col  ">
              <UButton
                :label="t('blog.toc')"
                color="neutral"
                variant="subtle"
                :trailing-icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
                block
              />
              <template #content>
                <div class="py-4">
                  <ul class="space-y-1">
                    <li v-for="link in pageBlog?.body?.toc?.links" :key="link.id">
                      <!-- Parent heading -->
                      <NuxtLink
                        class="line-clamp-1 rounded p-1 m-2"
                        :class="{
                          'bg-yellow-500 text-permadi-900 dark:text-permadi-900 ring ring-permadi-800': activeHeadings.includes(link.id),
                        }"
                        :to="`#${link.id}`"
                        @click.prevent="scrollToHeading(link.id)"
                      >
                        <p class="line-clamp-1 text-sm">
                          {{ link.text }}
                        </p>
                      </NuxtLink>

                      <!-- Sub-headings/children -->
                      <ul v-if="link.children?.length" class="ml-4 m-2 space-y-1">
                        <li v-for="child in link.children" :key="child.id">
                          <NuxtLink
                            class="line-clamp-1 rounded p-1"
                            :class="{
                              'bg-yellow-200 text-permadi-900 dark:text-permadi-900 ring ring-permadi-800': activeHeadings.includes(child.id),
                            }"
                            :to="`#${child.id}`"
                            @click.prevent="scrollToHeading(child.id)"
                          >
                            <p class="line-clamp-1 text-sm">
                              {{ child.text }}
                            </p>
                          </NuxtLink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </template>
            </UCollapsible>
          </UCard>
          <UCard class="mb-2  ">
            <div>
              <div class="flex flex-wrap gap-2">
                <!-- Batasi hanya 3 tag yang ditampilkan -->
                <div v-for="tag in pageBlog?.tags.slice(0, 3)" :key="tag">
                  <NuxtLink :to="localePath(`/blog/tags/${tag}`)">
                    <UButton
                      variant="subtle"
                      color="primary"
                      class="  cursor-pointer"
                      size="xs"
                      aria-label="Lihat artikel dengan tag {{ tag }}"
                    >
                      <p class="text-sm text-permadi-700 dark:text-permadi-300">
                        {{ tag }}
                      </p>
                    </UButton>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </UCard>

          <UCard class="mb-2">
            <div class="flex flex-col space-y-2">
              <!-- Tombol Previous -->
              <UButton
                v-if="surroundingBlog?.[0]"
                variant="subtle"
                icon="hugeicons:circle-arrow-left-01"
                :to="localePath(`/blog${surroundingBlog[0].path}`)"
              >
                <span class="line-clamp-2 text-permadi-800 dark:text-permadi-200">
                  {{ surroundingBlog[0].title }}
                </span>
              </UButton>

              <!-- Tombol Next -->
              <UButton
                v-if="surroundingBlog?.[1]"
                variant="subtle"
                trailing-icon="hugeicons:circle-arrow-right-01"
                :to="localePath(`/blog${surroundingBlog[1].path}`)"
              >
                <span class="line-clamp-2 text-permadi-800 dark:text-permadi-200">
                  {{ surroundingBlog[1].title }}
                </span>
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </article>
    <div class="md:hidden">
      <UCard class="my-2">
        <div class="flex flex-col space-y-2">
          <UButton v-if="surroundingBlog?.[0]" variant="outline" icon="hugeicons:circle-arrow-left-01" :to="localePath(`/blog${surroundingBlog[0].path}`)">
            <span class="line-clamp-2">
              {{ surroundingBlog[0].title }}
            </span>
          </UButton>
          <UButton v-if="surroundingBlog?.[1]" variant="outline" trailing-icon="hugeicons:circle-arrow-right-01" :to="localePath(`/blog${surroundingBlog[1].path}`)">
            <span class="line-clamp-2">
              {{ surroundingBlog[1].title }}
            </span>
          </UButton>
        </div>
      </UCard>

      <ScrollToTop />
    </div>
  </UContainer>
</template>
