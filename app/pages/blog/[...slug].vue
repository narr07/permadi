<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

const open = ref(true)

defineShortcuts({
  o: () => open.value = !open.value,
})
</script>

<template>
  <UContainer>
    <UCard class="mb-2">
      <div v-if="page" :value="page">
        <h1 class="text-g3">
          {{ page.title }}
        </h1>
      </div>
    </UCard>
    <UCard
      class="sticky my-2
     top-16"
    >
      <UCollapsible class="  sticky top-16      ">
        <UButton

          color="neutral"
          variant="subtle"
          trailing-icon="i-lucide-chevron-down"
          block
        />
        <template #content>
          <div>
            <ul>
              <li v-for="link in page?.body?.toc?.links" :key="link.id">
                <NuxtLink :to="`#${link.id}`">
                  {{ link.text }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </template>
      </UCollapsible>
    </UCard>
    <UCard>
      <div class="prose dark:prose-invert prose-sm  drop max-w-6xl mx-auto prose-permadi">
        <ContentRenderer v-if="page" :value="page" />
      </div>
    </UCard>
  </UContainer>
</template>
