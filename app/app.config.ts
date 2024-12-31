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

    card: {
      slots: {
        root: 'bg-yellow-500 dark:bg-permadi-800 dark:hover:bg-permadi-600 hover:bg-permadi-300 ease-in-out duration-200 ring-2 dark:ring-permadi-700 ring-permadi-900  divide-y divide-[var(--ui-border)] rounded-[calc(var(--ui-radius)*2)] shadow-sm',
        header: 'p-2 sm:px-4',
        body: 'p-2 sm:p-4 ',
        footer: 'p-2 sm:px-4',
      },
    },

  },
})
