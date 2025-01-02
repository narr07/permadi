export default defineAppConfig({
  socials: {
    twitter: '',
    github: '',
    mastodon: '',
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
        root: 'bg-permadi-50 ring-2 ring-permadi-900 dark:ring-permadi-700 dark:bg-permadi-800 divide-y divide-permadi-700 rounded-[calc(var(--ui-radius)*2)] shadow-sm',
        header: 'p-2 sm:px-4',
        body: 'p-2 sm:p-4 ',
        footer: 'p-2 sm:px-4',
      },
    },

  },
})
