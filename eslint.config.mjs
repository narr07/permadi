// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
	antfu({
		type: 'app',
		vue: true,
		typescript: true,
		unocss: true,
		markdown: false, // 🛑 Lindungi file Markdown agar tidak disentuh/diformat
		ignores: [
			'content/**', // 🛑 Lindungi seluruh folder content Markdown
			'**/*.md',
			'dist/**',
			'.output/**',
			'.nuxt/**',
			'permadi-web2025/**',
			'personal-sitenextjs/**',
			'src-nuxt-ui/**',
			'scripts/convert-webp.ts',
		],
		stylistic: {
			indent: 'tab',
			quotes: 'single',
			semi: false,
		},
		formatters: false,
		rules: {
			'no-console': 'off',
			'node/prefer-global/process': 'off',
			'node/prefer-global/buffer': 'off',
			'ts/no-explicit-any': 'off',
			'unused-imports/no-unused-vars': 'warn',
			'vue/no-required-prop-with-default': 'warn',
			'vue/singleline-html-element-content-newline': 'off',
			'vue/multiline-html-element-content-newline': 'off',
			'vue/max-attributes-per-line': ['error', {
				singleline: { max: 1 },
				multiline: { max: 1 },
			}],
			'vue/block-order': ['error', {
				order: ['script', 'template', 'style'],
			}],
		},
	}),
)
