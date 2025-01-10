<script lang="ts" setup>
import type { Collections } from '@nuxt/content'
import { useScrollspy } from '@/composables/useScrollspy'
import { useWindowScroll } from '@vueuse/core'
import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale } = useI18n()

const slug = computed(() => withLeadingSlash(String(route.params.slug)))

const { data: projectPage } = await useAsyncData(`page-${slug.value}`, async () => {
  const collection = (`project_${locale.value}`) as keyof Collections
  const content = await queryCollection(collection).path(slug.value).first()
  return content
}, {
  watch: [locale],
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

if (projectPage?.value?.seo) {
  useSeoMeta(projectPage.value.seo)
}
const open = ref(true)
</script>

<template>
  <UContainer class=" ">
    <!-- Header -->
    <div class="md:flex-row flex-col flex gap-2">
      <div class="md:w-3/4">
        <UCard class="mb-2">
          <div v-if="projectPage" :value="projectPage">
            <h1 class="text-g3">
              {{ projectPage.title }}
            </h1>
          </div>
        </UCard>
        <UCard class="mb-2 md:hidden">
          <UCollapsible v-model:open="open" class="flex flex-col  ">
            <UButton
              label="DAFTAR ISI"
              color="neutral"
              variant="subtle"
              :trailing-icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
              block
            />

            <template #content>
              <div class="py-4">
                <ul class="space-y-2">
                  <li v-for="link in projectPage?.body?.toc?.links" :key="link.id">
                    <!-- Parent heading -->
                    <NuxtLink
                      class="line-clamp-1 block transition-colors"
                      :class="{
                        'text-permadi-950': activeHeadings.includes(link.id),
                      }"
                      :to="`#${link.id}`"
                      @click.prevent="scrollToHeading(link.id)"
                    >
                      {{ link.text }}
                    </NuxtLink>

                    <!-- Sub-headings/children -->
                    <ul v-if="link.children?.length" class="ml-4 mt-1 space-y-1">
                      <li v-for="child in link.children" :key="child.id">
                        <NuxtLink
                          class="line-clamp-1 block text-sm transition-colors"
                          :class="{
                            'text-permadi-900': activeHeadings.includes(child.id),
                          }"
                          :to="`#${child.id}`"
                          @click.prevent="scrollToHeading(child.id)"
                        >
                          {{ child.text }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </template>
          </UCollapsible>
        </UCard>
        <!-- Konten -->
        <UCard>
          <div class="prose dark:prose-invert prose-sm drop max-w-6xl mx-auto prose-permadi">
            <ContentRenderer v-if="projectPage" :value="projectPage" />
          </div>
        </UCard>
      </div>

      <!-- toc -->
      <div class="w-1/4 hidden md:flex flex-col  space-y-4">
        <div class=" sticky top-[86px] ">
          <UCard class="mb-2">
            Tanggal
          </UCard>
          <UCard class="">
            <UCollapsible v-model:open="open" class="flex flex-col  ">
              <UButton
                label="DAFTAR ISI"
                color="neutral"
                variant="subtle"
                :trailing-icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
                block
              />

              <template #content>
                <div class="py-4">
                  <ul class="space-y-2">
                    <li v-for="link in projectPage?.body?.toc?.links" :key="link.id">
                      <!-- Parent heading -->
                      <NuxtLink
                        class="line-clamp-1 block transition-colors"
                        :class="{
                          'text-permadi-950': activeHeadings.includes(link.id),
                        }"
                        :to="`#${link.id}`"
                        @click.prevent="scrollToHeading(link.id)"
                      >
                        {{ link.text }}
                      </NuxtLink>

                      <!-- Sub-headings/children -->
                      <ul v-if="link.children?.length" class="ml-4 mt-1 space-y-1">
                        <li v-for="child in link.children" :key="child.id">
                          <NuxtLink
                            class="line-clamp-1 block text-sm transition-colors"
                            :class="{
                              'text-permadi-900': activeHeadings.includes(child.id),
                            }"
                            :to="`#${child.id}`"
                            @click.prevent="scrollToHeading(child.id)"
                          >
                            {{ child.text }}
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
    </div>

    <ScrollToTop />
  </UContainer>
</template>
