<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

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
      'streetAddress': 'Desa Teja',
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

useHead({
  meta: [
    { name: 'theme-color', content: '#004643', media: '(prefers-color-scheme: dark)' },
    { name: 'theme-color', content: '#abd1c6', media: '(prefers-color-scheme: light)' },
    { name: 'msapplication-TileColor', content: '#004643' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  ],
})
useSeoMeta({
  author: 'Dinar Permadi Yusup',
  fbAppId: '1161711028356295',
})
const { finalizePendingLocaleChange } = useI18n()

// eslint-disable-next-line antfu/top-level-function
const onBeforeEnter = async () => {
  await finalizePendingLocaleChange()
}

const { locale } = useI18n()
</script>

<template>
  <div>
    <UApp :locale="locales[locale]">
      <Pattern />
      <NuxtRouteAnnouncer />
      <NuxtLoadingIndicator color="#f9bc60" />

      <NavBar />
      <div class="pt-20">
        <NuxtPage
          :transition="{
            name: 'page',
            mode: 'out-in',
            onBeforeEnter,
          }"
        />
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
