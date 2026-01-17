export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      neutral: 'gray'
    },
    prose: {
      a: {
        base: [
          'text-blue-500 border-b border-dashed  border-blue-500 hover:border-blue-600 hover:text-blue-600 font-medium focus-visible:outline-primary focus-visible:has-[>code]:outline-0 [&>code]:border-dashed hover:[&>code]:border-primary hover:[&>code]:text-primary focus-visible:[&>code]:border-primary focus-visible:[&>code]:text-primary',
          'transition-colors [&>code]:transition-colors'
        ]
      }
    }
  }
})



