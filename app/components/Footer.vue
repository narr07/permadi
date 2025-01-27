<script setup lang="ts">
const { socials } = useAppConfig()

const socialIcon = [
  { name: 'Twitter', url: socials.github, icon: 'fa6-brands:square-x-twitter' },
  { name: 'Github', url: socials.twitter, icon: 'fa6-brands:square-github' },
  { name: 'Linkedin', url: socials.linkedin, icon: 'fa6-brands:linkedin' },
  { name: 'Facebook', url: socials.facebook, icon: 'fa6-brands:square-facebook' },
  { name: 'Instagram', url: socials.instagram, icon: 'fa6-brands:instagram' },
  { name: 'Behance', url: socials.behance, icon: 'fa6-brands:square-behance' },
  { name: 'Whatsapp', url: socials.whatsapp, icon: 'fa6-brands:whatsapp' },
]
</script>

<template>
  <UContainer>
    <UCard class="mt-2 bg-yellow-500 ring-2 dark:ring-permadi-600 ring-permadi-900 dark:bg-permadi-700  rounded">
      <!-- Flex container untuk menyelaraskan teks dan ikon secara horizontal -->
      <div class="flex flex-col md:flex-row  justify-between items-center">
        <!-- Teks yang di kiri -->
        <div class="flex items-center mb-4 md:mb-0 justify-center text-center">
          © 2024, narr07 - All rights reserved.
        </div>
        <!-- Ikon sosial yang terletak di kanan -->
        <div class="flex flex-row space-x-4">
          <div v-for="(icon, index) in socialIcon" :key="index">
            <UButton
              :href="icon.url"
              :aria-label="icon.name"
              target="_blank"
              :icon="icon.icon"
              square
              color="primary"
            >
              <span class="sr-only">{{ icon.name }}</span>
            </UButton>
          </div>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
