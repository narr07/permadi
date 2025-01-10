export default defineAppConfig({
  profile: {
    name: 'Dinar Permadi Yusup',
    job: 'Teacher, Programmer and Designer',
    email: 'dinarpermadi07@gmail.com',
    phone: '+6285721340777',
    picture: 'https://avatars.githubusercontent.com/u/71938701?v=4',
  },
  socials: {
    github: 'https://github.com/narr07',
    twitter: 'https://twitter.com/narr_permadi',
    linkedin: 'https://linkedin.com/in/narr07',
    instagram: 'https://instagram.com/narr07',
    facebook: 'https://facebook.com/narr07',
    behance: 'https://behance.net/narr07',
    whatsapp: 'https://wa.me/6285721340777',
  },
  // https://ui3.nuxt.dev/getting-started/theme#design-system
  ui: {
    colors: {
      primary: 'permadi' as any,
      neutral: 'permadi' as any,
    },
    container: {
      base: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-4',
    },
    card: {
      slots: {
        root: 'bg-permadi-100 ring-2 ring-permadi-900 dark:ring-permadi-700 dark:bg-permadi-800 divide-y divide-permadi-700 rounded-[calc(var(--ui-radius)*2)] shadow-sm',
        header: 'p-2 sm:px-4',
        body: 'p-2 sm:p-4 ',
        footer: 'p-2 sm:px-4',
      },
    },

  },
})
