<script setup lang="ts">
const { socials } = useAppConfig()

const socialIcon = [
  { name: 'Twitter', url: socials.github, icon: 'fa6-brands:square-x-twitter' },
  { name: 'Github', url: socials.twitter, icon: 'fa6-brands:square-github' },
  { name: 'Linkedin', url: socials.linkedin, icon: 'fa6-brands:linkedin' },
  { name: 'Facebook', url: socials.facebook, icon: 'fa6-brands:square-facebook' },
  { name: 'Instagram', url: socials.instagram, icon: 'fa6-brands:instagram' },
  { name: 'Whatsapp', url: socials.whatsapp, icon: 'fa6-brands:whatsapp' },
  { name: 'Behance', url: socials.behance, icon: 'fa6-brands:square-behance' },
]
</script>

<template>
  <UContainer>
    <UCard>
      <div class="flex flex-row space-y-4 justify-between items-center">
        <div class="flex items-center">
          coppy right Dinar Permadi
        </div>
        <div class="flex flex-row space-x-2">
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
