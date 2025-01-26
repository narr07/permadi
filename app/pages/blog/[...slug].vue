<script lang="ts" setup>
import type { Collections } from '@nuxt/content'
import { queryCollection, useRoute } from '#imports'
import { useScrollspy } from '@/composables/useScrollspy'
import { useDateFormat, useWindowScroll } from '@vueuse/core'
import { withLeadingSlash } from 'ufo'

const { t } = useI18n()
const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

const slug = computed(() => withLeadingSlash(String(route.params.slug)))

const { data: page } = await useAsyncData(`page-${slug.value}`, async () => {
  const collection = (`blog_${locale.value}`) as keyof Collections
  const content = await queryCollection(collection).path(slug.value).first()
  return content
}, {
  watch: [locale],
})

const { data: surroundingBlog } = await useAsyncData('surround', () => {
  return queryCollectionItemSurroundings(`blog_${locale.value}`, slug.value)
})

// Gunakan scrollspy untuk memantau heading

const headings = ref<Element[]>([]) // Referensi untuk elemen heading
const { activeHeadings, updateHeadings } = useScrollspy()
const { y } = useWindowScroll()

onMounted(() => {
  // Ambil semua elemen heading (misalnya <h2> dan <h3>) dari konten
  headings.value = Array.from(document.querySelectorAll('.prose h2, .prose h3, .prose h4'))
  updateHeadings(headings.value) // Daftarkan heading ke observer
})

function scrollToHeading(id: string) {
  const heading = document.getElementById(id)
  if (heading) {
    const offset = 100
    const top = heading.getBoundingClientRect().top + y.value - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

if (page?.value?.seo) {
  useSeoMeta(page.value.seo)
}

useSchemaOrg([
  defineArticle({
    // computed getter
    title: () => page?.value?.title,
    description: () => page?.value?.description,
  }),
])

useSeoMeta({
  keywords: page.value?.tags ? page.value.tags.join(', ') : 'dinar, permadi, dinar permadi, guru, developer, programmer',
})

const open = ref(false)

defineOgImageComponent('Page', {
  title: page?.value?.title,
  description: page?.value?.description,
})

const formatted = useDateFormat(page.value?.date, 'dddd, D MMMM YYYY', { locales: locale.value === 'en' ? 'en-US' : 'id-ID' })

const networks = [
  { network: 'email', icon: 'i-ph-envelope-duotone' },
  { network: 'facebook', icon: 'i-ph-facebook-logo-duotone' },
  { network: 'linkedin', icon: 'i-ph-linkedin-logo-duotone' },
  { network: 'twitter', icon: 'i-ph-twitter-logo-duotone' },
  { network: 'whatsapp', icon: 'i-ph-whatsapp-logo-duotone' },
]
const hashtags = computed(() => {
  return page.value?.tags ? page.value.tags.join(', ') : ''
})
</script>

<template>
  <UContainer class=" ">
    <!-- Header -->
    <div class="md:flex-row flex-col flex gap-4">
      <div class="md:w-3/4">
        <UCard class="mb-2">
          <div v-if="page" :value="page">
            <h1 class="text-g3">
              {{ page.title }}
            </h1>
          </div>
        </UCard>

        <!-- <div class="fixed z-50 bottom-5 right-5">
          <UChip :text="likes" size="3xl">
            <UButton
              size="lg"
              icon="i-lucide-thumbs-up"
              color="neutral"
              variant="subtle"
              @click="handleLike"
            />
          </UChip>
        </div> -->

        <UCard class="mb-2 md:hidden">
          <div>{{ formatted }}</div>
        </UCard>
        <UCard class="mb-2 md:hidden">
          <div>
            <div class="flex flex-wrap gap-2">
              <!-- Batasi hanya 3 tag yang ditampilkan -->

              <div v-for="tag in page?.tags.slice(0, 3)" :key="tag">
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
          <div class="prose dark:prose-invert prose-sm max-w-6xl mx-auto prose-permadi">
            <ContentRenderer v-if="page" :value="page" />
          </div>
        </UCard>
        <div class="sticky bottom-2  md:hidden pt-2">
          <UCard class="mb-2 md:hidden">
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
                    <li v-for="link in page?.body?.toc?.links" :key="link.id">
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
        </div>
      </div>
      <div class="md:hidden">
        <UCard class="mb-2">
          <div class="flex flex-col space-y-2">
            <UButton v-if="surroundingBlog?.[0]" variant="subtle" icon="hugeicons:circle-arrow-left-01" :to="localePath(`/blog${surroundingBlog[0].path}`)">
              <span class="line-clamp-2 text-permadi-900 dark:text-permadi-300">
                {{ surroundingBlog[0].title }}
              </span>
            </UButton>
            <UButton v-if="surroundingBlog?.[1]" variant="subtle" icon="hugeicons:circle-arrow-right-01" :to="localePath(`/blog${surroundingBlog[1].path}`)">
              <span class="line-clamp-2 text-permadi-900 dark:text-permadi-300">
                {{ surroundingBlog[1].title }}
              </span>
            </UButton>
          </div>
        </UCard>

        <UCard>
          <div class="flex flex-wrap gap-2">
            <ClientOnly>
              <ShareNetwork
                v-for="network in networks"
                :key="network.network"
                :network="network.network"
                :url="`https://permadi.dev/blog${page?.path}/`"
                :title="page?.title"
                :description="page?.description"
                :hashtags="hashtags"
                twitter-user="dinarpermadi07"
                tag="a"
              >
                <UButton
                  variant="subtle"
                  :icon="network.icon"
                  :aria-label="network.network"
                >
                  <span class="sr-only">Link {{ network.network }} Permadi</span>
                </UButton>
              </ShareNetwork>
            </ClientOnly>
          </div>
        </UCard>
      </div>
      <!-- toc -->
      <div class="w-1/4 hidden md:flex flex-col  space-y-4">
        <div class=" sticky top-[86px] ">
          <UCard class="mb-2">
            <div>{{ formatted }}</div>
          </UCard>
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
                    <li v-for="link in page?.body?.toc?.links" :key="link.id">
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
          <UCard class="mb-2">
            <div>
              <div class="flex flex-wrap gap-2">
                <div v-for="tag in page?.tags.slice(0, 3)" :key="tag">
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
          <UCard class="mb-2">
            <div class="flex flex-col  space-y-2">
              <UButton
                v-if="surroundingBlog?.[0]" variant="subtle"
                color="primary" icon="hugeicons:circle-arrow-left-01" :to="localePath(`/blog${surroundingBlog[0].path}`)"
              >
                <span class="line-clamp-2 text-permadi-900 dark:text-permadi-300">
                  {{ surroundingBlog[0].title }}
                </span>
              </UButton>
              <UButton
                v-if="surroundingBlog?.[1]" variant="subtle"
                color="primary" icon="hugeicons:circle-arrow-right-01" :to="localePath(`/blog${surroundingBlog[1].path}`)"
              >
                <span class="line-clamp-2 text-permadi-900 dark:text-permadi-300">
                  {{ surroundingBlog[1].title }}
                </span>
              </UButton>
            </div>
          </UCard>
          <UCard>
            <div class="flex flex-wrap gap-2">
              <ClientOnly>
                <ShareNetwork
                  v-for="network in networks"
                  :key="network.network"
                  :network="network.network"
                  :url="page?.path ? `https://permadi.dev${localePath(page.path)}` : ''"
                  :title="page?.title"
                  :description="page?.description"
                  :hashtags="hashtags"
                  twitter-user="dinarpermadi07"
                  tag="a"
                >
                  <UButton
                    variant="subtle"
                    :icon="network.icon"
                    :aria-label="network.network"
                  />
                </ShareNetwork>
              </ClientOnly>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <ScrollToTop />
  </UContainer>
</template>
