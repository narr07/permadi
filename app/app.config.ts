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
      h3: {
        slots: {
          base: [
            'relative text-xl text-primary-700 dark:text-primary-300 font-bold mt-8 mb-3 scroll-mt-[calc(32px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(32px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary [&>a>code]:text-lg/6 [&>a>code]:font-bold',
            '[&>a>code]:transition-colors',
          ],
          leading: [
            'absolute -ms-8 top-0.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated hover:text-primary rounded-md hidden lg:flex text-muted',
            'transition',
          ],
          leadingIcon: 'size-4 shrink-0',
          link: 'group lg:ps-2 lg:-ms-2',
        },
      },
    },
    icons: {
      arrowDown: 'i-narr-arrow-down',
      arrowLeft: 'i-narr-arrow-left',
      arrowRight: 'i-narr-arrow-right',
      arrowUp: 'i-narr-arrow-up',
      caution: 'i-narr-caution',
      check: 'i-narr-check',
      chevronDoubleLeft: 'i-narr-chevron-double-left',
      chevronDoubleRight: 'i-narr-chevron-double-right',
      chevronDown: 'i-narr-chevron-down',
      chevronLeft: 'i-narr-chevron-left',
      chevronRight: 'i-narr-chevron-right',
      chevronUp: 'i-narr-chevron-up',
      close: 'i-narr-close',
      copy: 'i-narr-copy',
      copyCheck: 'i-narr-copy-check',
      dark: 'i-narr-dark',
      drag: 'i-narr-drag',
      ellipsis: 'i-narr-ellipsis',
      error: 'i-narr-error',
      external: 'i-narr-external',
      eye: 'i-narr-eye',
      eyeOff: 'i-narr-eye-off',
      file: 'i-narr-file',
      folder: 'i-narr-folder',
      folderOpen: 'i-narr-folder-open',
      hash: 'i-narr-hash',
      info: 'i-narr-info',
      light: 'i-narr-light',
      loading: 'i-narr-loading',
      menu: 'i-narr-menu',
      minus: 'i-narr-minus',
      panelClose: 'i-narr-panel-close',
      panelOpen: 'i-narr-panel-open',
      plus: 'i-narr-plus',
      reload: 'i-narr-reload',
      search: 'i-narr-search',
      stop: 'i-narr-stop',
      success: 'i-narr-success',
      system: 'i-narr-system',
      tip: 'i-narr-tip',
      upload: 'i-narr-upload',
      warning: 'i-narr-warning',
    },
  },
})
