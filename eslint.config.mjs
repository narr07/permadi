// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: {
      css: true,
      html: true,
      markdown: false,
    },
    vue: true,
  }),

)
