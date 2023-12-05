<script setup>
const props = defineProps({ blok: Object })
const { slug } = useRoute().params
// const resolvedRichText = computed(() => {
//   return renderRichText(props.blok.content, { schema: mySchema });
// });
const siteUrl = 'https://permadi.dev/'
const resolvedRichText = computed(() => renderRichText(props.blok.content))
const title = props.blok.title
const description = props.blok.description
useServerSeoMeta({
  title: () => title,
  ogTitle: () => title,
  description: () => description,
  ogDescription: () => description,
  twitterTitle: () => title,
  twitterDescription: () => description,
  ogType: () => 'article',
})
defineOgImage({
  component: 'OgPage',
  title,
  description,
})
const counter = ref(0)
function handleClick() {
  counter.value++
}
const headings = computed(() => {
  const headings = props.blok.content.content.filter(
    section => section.type === 'heading' && section.attrs.level === 2,
  )
  return headings.map((heading) => {
    return {
      id: heading.content[0].marks[0].attrs?.id,
      text: heading.content[0].text,
    }
  })
})
const categoryItem = computed(() => {
  return headings.value.map(heading => [
    {
      label: heading.text,
      to: `#${heading.id}`,
    },
  ])
})
const links = [{
  icon: 'i-ph-house-duotone',
  to: '/',
}, {
  to: '/blog',
  active: true,
  icon: 'i-ph-notebook-duotone',
  activeClass: 'text-permadi-500',
}, {
  label: props.blok.title,
}]
function scrollTop() {
  window.scrollTo(0, 0)
}
</script>

<template>
  <div class="py-16">
    <UContainer v-editable="blok" class="px-0">
      <!-- Blog Article -->
      <div class="max-w-3xl px-4 md:px-14">
        <UBreadcrumb divider="/" :links="links" />
      </div>
      <div class="max-w-3xl px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto">
        <div class="max-w-2xl">
          <div class="space-y-5 md:space-y-8">
            <UCard
              class="drop-shadow-2 dark:drop-shadow-2gelap ring-permadi-800 bg-yellow hover:drop-shadow-1 transition dark:bg-gray-900 dark:ring-gray-800 ring-1 dark:hover:bg-gray-800 dark:hover:ring-permadi-500 space-y-3"
            >
              <NuxtImg
                v-if="blok.image?.filename"
                :src="`${blok.image.filename}/m/1600x0`"
                loading="lazy"
                :alt="blok.image.alt"
                height="300"
                width="500"
                class="w-full h-[250px] lg:h-[350px] rounded ring-1 ring-permadi-800 object-cover"
              />
              <UBadge class="dark:bg-permadi-700 mt-2 dark:text-permadi-200">
                <time>
                  {{
                    new Date(blok.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }}
                </time>
              </UBadge>
              <div>
                <UBadge class="dark:bg-permadi-700 mt-2 dark:text-permadi-200">
                  TAG
                </UBadge>
              </div>
              <h1 class="text-g2 md:text-g3 border-permadi-800 my-2">
                {{ blok.title }}
              </h1>
              <p>{{ blok.description }}</p>
            </UCard>
            <UCard>
              <div
                class="prose prose-permadi prose-pre:bg-permadi-800 prose-pre:text-sm prose-blockquote:font-normal prose-headings:text-permadi-800 prose-blockquote:border-l-permadi dark:prose-blockquote:border-l-yellow max-w-3xl mx-auto dark:prose-invert prose-img:rounded prose-img:ring-1 prose-img:ring-permadi-800 prose-img:mx-auto"
                v-html="resolvedRichText"
              />
            </UCard>
          </div>
          <!-- End Content -->
        </div>
      </div>
      <!-- End Blog Article -->
      <!-- Sticky Share Group -->
      <div class="sticky bottom-2 inset-x-0 text-center">
        <UCard
          :ui="{
            body: {
              padding: 'px-2 py-1.5 sm:px-2 sm:py-1.5 ',
            },
          }" class="inline-block bg-gray-100 dark:bg-gray-900 dark:ring-gray-800 ring-1 ring-gray-800 px-0 py-0  "
        >
          <div class="flex items-center gap-x-1.5">
            <UTooltip
              :text="$i18n.locale === 'en' ? 'TOC' : 'Daftar Isi'"
              :popper="{ placement: 'left' }"
            >
              <UDropdown
                :popper="{ arrow: true, placement: 'top-start' }"
                :ui="{
                  width: 'w-80',
                }"
                class="w-full"
                :items="categoryItem"
              >
                <UButton
                  block
                  color="gray"
                  variant="solid"
                  icon="i-ph-list-bullets-duotone"
                />
              </UDropdown>
            </UTooltip>
            <UTooltip text="Share" :popper="{ placement: 'top' }">
              <UPopover
                class="flex items-center gap-x-1.5"
                :popper="{ arrow: true, placement: 'top-start' }"
              >
                <UButton
                  variant="solid"
                  color="gray"
                  square=""
                  trailing-icon="i-ph-share-fat-duotone"
                />
                <template #panel>
                  <div class="flex p-1 items-center gap-x-1.5">
                    <ShareNetwork
                      network="linkedin"
                      :url="`${siteUrl}${slug.join('/')}`"
                      :title="blok.title"
                      :description="blok.description"
                    >
                      <UButton icon="i-ph-linkedin-logo-duotone" />
                    </ShareNetwork>
                    <ShareNetwork
                      network="telegram"
                      :url="`${siteUrl}${slug.join('/')}`"
                      :title="blok.title"
                      :description="blok.description"
                    >
                      <UButton icon="i-ph-telegram-logo-duotone" />
                    </ShareNetwork>
                    <ShareNetwork
                      network="twitter"
                      :url="`${siteUrl}${slug.join('/')}`"
                      :title="blok.title"
                      :description="blok.description"
                      twitter-user="dinarpermadi07"
                      hashtags="narr07"
                    >
                      <UButton icon="i-ph-twitter-logo-duotone" />
                    </ShareNetwork>
                    <ShareNetwork
                      network="facebook"
                      :url="`${siteUrl}${slug.join('/')}`"
                      :title="blok.title"
                      :description="blok.description"
                      hashtags="narr07"
                    >
                      <UButton icon="i-ph-facebook-logo-duotone" />
                    </ShareNetwork>
                    <ShareNetwork
                      network="whatsapp"
                      :url="`${siteUrl}${slug.join('/')}`"
                      :title="blok.title"
                    >
                      <UButton square icon="i-ph-whatsapp-logo-duotone" />
                    </ShareNetwork>
                  </div>
                </template>
              </UPopover>
            </UTooltip>
            <!-- Button -->
            <UChip inset :text="counter" size="lg">
              <UButton
                variant="solid"
                color="gray"
                square=""
                icon="i-ph-heart-duotone"
                class=" "
                @click="handleClick"
              />
            </UChip>
            <!-- Button -->
          </div>
        </UCard>
      </div>
      <!-- End Sticky Share Group -->
    </UContainer>
    <div>
      <!-- Button -->
      <UTooltip
        :text="$i18n.locale === 'en' ? 'To Top o' : 'Ke Atas'"
        :popper="{ placement: 'top' }"
      >
        <UButton
          variant="solid"
          color="gray"
          square=""
          icon="i-ph-arrow-up-duotone"
          class="fixed bottom-2 right-4 z-10"
          @click="scrollTop"
        />
      </UTooltip>
    <!-- End Button -->
    <!-- Rest of the code -->
    <!-- ... -->
    </div>
  </div>
</template>
