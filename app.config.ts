export default defineAppConfig({
  ui: {
    primary: "permadi",
    gray: "permadi",
    container: {
      padding: "px-2 md:px-14",
      constrained: "max-w-7xl",
    },
    button: {
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
  },
});
