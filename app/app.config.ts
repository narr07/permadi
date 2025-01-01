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
        root: 'bg-permadi-300 dark:bg-permadi-800 duration-100 ring-2 ring-permadi-900 hover:ring-permadi-400 dark:hover:ring-permadi-600 divide-y divide-[var(--ui-border)] rounded shadow-sm',
        header: 'p-2 sm:px-4',
        body: 'p-2 sm:p-4 ',
        footer: 'p-2 sm:px-4',
      },
    },

  },
})
