<template>
  <!-- Hero -->
  <div class="relative overflow-hidden">
    <div class="px-4 md:px-16 py-16 flex flex-col space-y-6">
      <div>
        <UButton  class="drop-shadow-1 ring-1 dark:ring-primary-500 dark:drop-shadow-1gelap ring-permadi-800 hover:bg-yellow">
          Button
        </UButton>
      </div>
      <UContainer class=" w-full"> INI COntainer </UContainer>
      <UCard> INI CARD </UCard>
      <UAccordion color="primary" variant="solid" :items="items" />
    </div>
  </div>
  <!-- End Hero -->
</template>
<script setup>
  const items = [
    {
      label: "Getting Started",
      icon: "i-heroicons-information-circle",
      activeClass: "bg-yellow",
      defaultOpen: true,
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.",
    },
    {
      label: "Installation",
      icon: "i-heroicons-arrow-down-tray",
      disabled: true,
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.",
    },
    {
      label: "Theming",
      icon: "i-heroicons-eye-dropper",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.",
    },
    {
      label: "Layouts",
      icon: "i-heroicons-rectangle-group",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.",
    },
    {
      label: "Components",
      icon: "i-heroicons-square-3-stack-3d",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.",
    },
    {
      label: "Utilities",
      icon: "i-heroicons-wrench-screwdriver",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.",
    },
  ];
</script>
