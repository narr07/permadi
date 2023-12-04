<script setup>
  const storyblokApi = useStoryblokApi();
  const { data } = await storyblokApi.get("cdn/stories/global", {
    version: "draft",
    resolve_links: "url",
  });
  const footerTitle = ref(null);
  footerTitle.value = data.story.content.footer_title;
  const sosmedMenu = ref(null)
  sosmedMenu.value = data.story.content.sosmed;
</script>
<template>
  <footer class="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
    <!-- Grid -->
    <UContainer class="text-center">
      <UDivider>
        <NuxtLink rel="noopener noreferrer" aria-label="Logo" to="/">
          <Logo />
        </NuxtLink>
      </UDivider>
      <!-- End Col -->
      <div class="mt-3">
        <p class="text-gray-500">
          {{ footerTitle }}
        </p>
      </div>
      <!-- Social Brands -->
      <div
        class="mt-3 justify-center flex flex-wrap mx-auto w-full"
        v-if="sosmedMenu">
        <div class="flex flex-row" v-for="blok in sosmedMenu" :key="blok._uid">
          <UTooltip :text="blok.title">
            <UButton
              :aria-label="blok.title"
              :to="blok.link"
              target="_blank"
              rel="noopener noreferrer"
              square
              variant="soft">
              <Icon :name="blok.icon.icon" size="24" />
            </UButton>
          </UTooltip>
        </div>
        <ul class="flex space-x-8">
          <li></li>
        </ul>
      </div>
      <!-- End Social Brands -->
    </UContainer>
    <!-- End Grid -->
  </footer>
</template>
