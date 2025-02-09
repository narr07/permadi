<script setup lang="ts">
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

useHead({
  meta: [
    { name: 'theme-color', content: '#004643', media: '(prefers-color-scheme: dark)' },
    { name: 'theme-color', content: '#abd1c6', media: '(prefers-color-scheme: light)' },
    { name: 'msapplication-TileColor', content: '#004643' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },

  ],
  // link: [
  //   {
  //     rel: 'icon',
  //     type: 'image/x-icon',
  //     href: '/favicon.ico',
  //   },
  //   {
  //     rel: 'apple-touch-icon',
  //     sizes: '180x180',
  //     href: '/apple-touch-icon.png',
  //   },
  //   {
  //     rel: 'icon',
  //     type: 'image/png',
  //     sizes: '192x192',
  //     href: '/icon-192x192.png',
  //   },
  //   {
  //     rel: 'icon',
  //     type: 'image/png',
  //     sizes: '512x512',
  //     href: '/icon-512x512.png',
  //   },
  // ],
})
</script>

<template>
  <div>
    <UApp>
      <Pattern />
      <NuxtRouteAnnouncer />
      <NuxtLoadingIndicator color="#f9bc60" />

      <NavBar />
      <div class="pt-20">
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
