export default defineAppConfig({
  ui: {
    primary: "permadi",
    gray: "permadi",
    container: {
      padding: "px-2 md:px-14",
      constrained: "max-w-7xl",
    },
    button: {
      rounded: "rounded",
      default: {
        size: "sm",
        variant: "solid",
        color: "primary",
        loadingIcon: "i-heroicons-arrow-path-20-solid",
      },
    },
    card: {
      base: "overflow-hidden drop-shadow-2 dark:drop-shadow-2gelap hover:bg-yellow hover:drop-shadow-1 transition",
      background: "bg-gray-100 dark:bg-gray-900",
      divide: "divide-y divide-gray-200 dark:divide-gray-800",
      ring: "ring-1 ring-gray-800 ",
      rounded: "rounded",
      shadow: "shadow",
      body: {
        base: "",
        background: "",
        padding: "px-2 py-3 sm:p-4",
      },
      header: {
        base: "",
        background: "",
        padding: "px-4 py-5 sm:px-4",
      },
      footer: {
        base: "",
        background: "",
        padding: "px-4 py-4 sm:px-4",
      },
    },
    accordion: {
      wrapper: "w-full flex flex-col ",
      item: {
        base: "",
        size: "text-sm",
        color: "text-gray-700 dark:text-gray-500",
        padding: "pt-1.5 pb-3 px-2",
        icon: "ms-auto transform transition-transform duration-200",
      },
      transition: {
        enterActiveClass:
          "overflow-hidden transition-[height] duration-200 ease-out",
        leaveActiveClass:
          "overflow-hidden transition-[height] duration-200 ease-out",
      },
      default: {
        openIcon: "i-ph-caret-down-duotone",
        closeIcon: "",
        class:
          "mb-2 text-permadi-800 w-full transition  hover:bg-yellow dark:text-gray-500 dark:hover:bg-gray-800 bg-permadi-100 dark:bg-gray-900 rounded  ring-1 ring-permadi-800   drop-shadow-1 dark:drop-shadow-1gelap",
        variant: "soft",
      },
    },
    badge: {
      base: "inline-flex items-center ring-1 ring-permadi-800",
      rounded: "rounded",
      font: "font-medium",
      size: {
        xs: "text-xs px-1.5 py-0.5",
        sm: "text-xs px-2 py-1 ",
        md: "text-sm px-2 py-1",
        lg: "text-sm px-2.5 py-1.5",
      },
      default: {
        size: "sm",
        variant: "solid",
        color: "primary",
      },
    },
    dropdown: {
      wrapper: "relative inline-flex text-left rtl:text-right",
      container: "z-20 group",
      width: "w-48",
      height: "",
      background: "bg-gray-200 dark:bg-gray-800",
      shadow: "shadow-lg",
      rounded: "rounded",
      ring: "ring-1 ring-gray-800 dark:ring-gray-700",
      base: "relative focus:outline-none overflow-y-auto scroll-py-1 drop-shadow-2 dark:drop-shadow-2gelap",
      divide: "divide-y divide-gray-200 dark:divide-gray-700",
      padding: "p-1",
      item: {
        base: "group flex items-center gap-2 w-full",
        rounded: "rounded",
        padding: "px-2 py-1.5",
        size: "text-sm",
        active:
          "bg-yellow ring-1 ring-permadi-800 dark:bg-yellow text-gray-900 dark:text-permadi-800 dark:ring-permadi-800 ",
        inactive: "text-gray-700 dark:text-gray-200",
        disabled: "cursor-not-allowed opacity-50",
        icon: {
          base: "flex-shrink-0 h-4 w-4",
          active: "text-gray-800 dark:text-permadi-800",
          inactive: "text-gray-700 dark:text-gray-500",
        },
      },
    },
  },
});
