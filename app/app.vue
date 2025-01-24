<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
useSchemaOrg([
  definePerson({
    name: 'Dinar Permadi Yusup',
    jobTitle: 'Teacher',
    affiliation: {
      '@type': 'Organization',
      'name': 'SDN Teja II',
    },
    worksFor: {
      '@type': 'Organization',
      'name': 'SDN Teja II',
    },
    description: 'Dinar Permadi Yusup is a teacher, programmer, and designer. With this website, I would like to share my knowledge in learning design and programming.',
    image: 'https://permadi.dev/me.jpg',
    url: 'https://permadi.dev/',
    email: 'dinarpermadi07@gmail.com',
    telephone: '+6285721340777',
    knowsAbout: [
      'Teaching',
      'Programming',
      'Design',
    ],
    address: {
      '@type': 'PostalAddress',
      'streetAddress': 'Desa Indrakila',
      'addressLocality': 'Majalengka',
      'addressRegion': 'Jawa Barat',
      'postalCode': '45472',
      'addressCountry': 'Indonesia',
    },
    socialMedia: [
      {
        '@type': 'SocialMedia',
        'platform': 'Facebook',
        'url': 'https://www.facebook.com/narr07',
      },
      {
        '@type': 'SocialMedia',
        'platform': 'Instagram',
        'url': 'https://www.instagram.com/narr07',
      },
      {
        '@type': 'SocialMedia',
        'platform': 'Twitter',
        'url': 'https://www.twitter.com/dinarpermadi07',
      },
      {
        '@type': 'SocialMedia',
        'platform': 'LinkedIn',
        'url': 'https://www.linkedin.com/in/narr07',
      },
      {
        '@type': 'SocialMedia',
        'platform': 'GitHub',
        'url': 'https://github.com/narr07',
      },
    ],
  }),
])
</script>

<template>
  <div>
    <Pattern />
    <UApp :locale="locales[locale as keyof typeof locales]">
      <NuxtLoadingIndicator color="#F9BC60" />
      <NuxtRouteAnnouncer />
      <NavBar />
      <div class="pt-[70px]">
        <NuxtPage />
      </div>

      <Footer />
    </UApp>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);

}
</style>
