export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      neutral: 'gray',
    },
    card: {
      slots: {
        root: 'rounded-lg overflow-hidden border dark:border-primary-700 border-primary-900 ',
        header: 'p-4 sm:px-6',
        body: 'p-4 sm:p-6',
        footer: 'p-4 sm:px-6',
      },
      variants: {
        variant: {
          solid: {
            root: 'bg-inverted text-inverted',
          },
          outline: {
            root: 'bg-default ring bg-(--ui-bg)/60 backdrop-blur-sm ring-default divide-y divide-default',
          },
          soft: {
            root: 'bg-elevated/50 divide-y divide-default',
          },
          subtle: {
            root: 'bg-elevated/50 ring ring-default divide-y divide-default',
          },
        },
      },
      defaultVariants: {
        variant: 'outline',
      },
    },
    prose: {
      a: {
        base: [
          'text-blue-500 border-b border-dashed  border-blue-500 hover:border-blue-600 hover:text-blue-600 font-medium focus-visible:outline-primary focus-visible:has-[>code]:outline-0 [&>code]:border-dashed hover:[&>code]:border-primary hover:[&>code]:text-primary focus-visible:[&>code]:border-primary focus-visible:[&>code]:text-primary',
          'transition-colors [&>code]:transition-colors',
        ],
      },
    },
  },
})
