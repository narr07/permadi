export default defineAppConfig({
  ui: {
    primary: "permadi",
    gray:"permadi",
    card: {
      base: 'overflow-hidden drop-shadow-2  ',
      background: 'bg-permadi-100 dark:bg-gray-900',
      divide: 'divide-y divide-gray-200 dark:divide-gray-800',
      ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
      rounded: 'rounded',
      shadow: 'shadow',
      body: {
        base: '',
        background: '',
        padding: 'px-2 py-3 sm:p-4'
      },
      header: {
        base: '',
        background: '',
        padding: 'px-4 py-5 sm:px-4'
      },
      footer: {
        base: '',
        background: '',
        padding: 'px-4 py-4 sm:px-4'
      }
    },
  }
})