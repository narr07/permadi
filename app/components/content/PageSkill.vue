<script lang="ts" setup>
const icons = ref([
  { name: 'i-ph-instagram-logo-duotone', title: 'Instagram', url: 'https://instagram.com' },
  { name: 'i-ph-github-logo-duotone', title: 'GitHub', url: 'https://github.com' },
  { name: 'i-ph-twitter-logo-duotone', title: 'Twitter', url: 'https://twitter.com' },
  { name: 'i-ph-linkedin-logo-duotone', title: 'LinkedIn', url: 'https://linkedin.com' },
])
</script>

<template>
  <UContainer class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <UCard>
      <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
        <div v-for="(icon, index) in icons" :key="index" class="flex justify-center items-center">
          <UButton :to="icon.url" color="neutral" variant="soft" square class="hover:scale-110 justify-center transform transition">
            <UIcon :name="icon.name" class="size-10" />
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
