import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetWind3,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss'

export default defineConfig({
	content: {
		pipeline: {
			include: [
				/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ya?ml)($|\?)/,
				'content/**/*.yml',
				'content/**/*.yaml',
			],
		},
	},

	safelist: [
		'i-swisspost-github',
		'i-swisspost-twitterx',
		'i-swisspost-instagram',
		'i-swisspost-icondesign',
		'i-swisspost-brush',
		'i-swisspost-mail',
		'i-swisspost-locationpin',
		'i-swisspost-arrowright',
		'i-swisspost-arrowupright',
		'i-swisspost-arrowleft',
		'i-swisspost-arrowup',
		'i-swisspost-globecontinents',
		'i-swisspost-code',
		'i-swisspost-checkmark',
		'i-swisspost-link',
		'i-swisspost-userunknown',
		'i-swisspost-wifion',
		'i-swisspost-documentemail',
		'i-swisspost-search',
		'i-swisspost-reloadright',
		'i-swisspost-closex',
		'i-swisspost-desktop',
	],

	presets: [
		presetWind3({
			dark: 'class',
		}),

		presetIcons({
			scale: 1.2,
			warn: true,
			extraProperties: {
				'display': 'inline-block',
				'vertical-align': 'middle',
			},
			collections: {
				swisspost: FileSystemIconLoader(
					'./node_modules/@swisspost/design-system-icons/public/post-icons',
					svg => {
						const match24 = svg.match(/<symbol id="s24" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/)
						if (match24) {
							return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${match24[1]}" fill="currentColor">${match24[2]}</svg>`
						}
						const match16 = svg.match(/<symbol id="s16" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/)
						if (match16) {
							return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${match16[1]}" fill="currentColor">${match16[2]}</svg>`
						}
						const matchAny = svg.match(/<symbol id="s\d+" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/)
						if (matchAny) {
							return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${matchAny[1]}" fill="currentColor">${matchAny[2]}</svg>`
						}
						return svg.replace(/<svg\b([^>]*)>/, '<svg$1 fill="currentColor">')
					},
				),
			},
		}),

		presetTypography({
			cssExtend: {
				'h1,h2,h3,h4,h5,h6': {
					'font-family': '\'Permadi Heading\', sans-serif',
					'font-weight': '700',
					'letter-spacing': '-0.025em',
					'color': '#001e1c',
					'scroll-margin-top': 'calc(var(--app-header-height, 65px) + 68px)',
				},
				'h1 a, h2 a, h3 a, h4 a, h5 a, h6 a': {
					'color': '#001e1c',
					'text-decoration': 'none',
				},
				'.dark :is(h1,h2,h3,h4,h5,h6)': {
					color: '#f8fafa',
				},
				'.dark :is(h1 a, h2 a, h3 a, h4 a, h5 a, h6 a)': {
					color: '#f8fafa',
				},
				'h2': {
					'font-size': 'clamp(1.45rem, 2.8vw, 1.85rem)',
					'line-height': '1.25',
					'margin-top': '2.2em',
					'margin-bottom': '0.6em',
					'border-bottom': 'none',
				},
				'h3': {
					'font-size': 'clamp(1.2rem, 2vw, 1.375rem)',
					'line-height': '1.3',
					'margin-top': '1.75em',
					'margin-bottom': '0.5em',
					'border-bottom': 'none',
				},
				'h4': {
					'font-size': '1.1rem',
					'line-height': '1.35',
					'margin-top': '1.5em',
					'margin-bottom': '0.5em',
				},
				'p, li, blockquote': {
					'line-height': '1.65',
				},
				'a': {
					'color': '#0f7662',
					'font-weight': '600',
					'text-decoration': 'underline',
					'text-decoration-color': 'rgba(15, 118, 98, 0.4)',
					'text-decoration-thickness': '1.5px',
					'text-underline-offset': '3px',
					'transition': 'all 0.15s ease',
				},
				'.dark a': {
					'color': '#2bd4b5',
					'text-decoration-color': 'rgba(43, 212, 181, 0.4)',
				},
				'blockquote': {
					'font-style': 'normal',
					'font-weight': '400',
					'color': '#224844',
					'background': '#eff6f5',
					'border-left': '4px solid #0f7662',
					'border-radius': '0',
					'padding': '1rem 1.25rem',
					'margin': '1.75rem 0',
				},
				'.dark blockquote': {
					'color': '#deeae9',
					'background': 'rgba(0, 30, 28, 0.6)',
					'border-left-color': '#f9bc60',
				},
				'ul > li::marker': {
					color: '#0f7662',
				},
				'.dark ul > li::marker': {
					color: '#f9bc60',
				},
				'ol > li::marker': {
					'font-family': '\'Barlow\', sans-serif',
					'font-weight': '800',
					'color': '#0f7662',
				},
				'.dark ol > li::marker': {
					color: '#f9bc60',
				},
				'table': {
					'width': '100%',
					'border-collapse': 'collapse',
					'margin': '0',
				},
				'th': {
					'background': '#f8fafa',
					'color': '#000b07',
					'font-family': '\'Barlow\', sans-serif',
					'font-weight': '800',
					'padding': '0.85rem 1.25rem',
					'border-bottom': '1px solid #deeae9',
				},
				'.dark th': {
					'background': '#001411',
					'color': '#f9bc60',
					'border-bottom-color': '#134e43',
				},
				'td': {
					'padding': '0.85rem 1.25rem',
					'border-bottom': '1px solid #eff6f5',
					'color': '#000b07',
				},
				'.dark td': {
					'color': '#deeae9',
					'border-bottom-color': 'rgba(19, 78, 67, 0.4)',
				},
				'hr': {
					'border-top': '1px solid #deeae9',
					'margin': '2.5rem 0',
				},
				'.dark hr': {
					'border-top-color': '#134e43',
				},
				':not(pre) > code': {
					'font-family': '\'JetBrains Mono\', monospace',
					'font-size': '0.85em',
					'font-weight': '500',
					'color': '#0f7662',
					'background-color': '#ccfbf2',
					'border': '1px dashed #14b898',
					'border-radius': '0',
					'padding': '0.01em 0.4em',
				},
				'.dark :not(pre) > code': {
					'color': '#5eeacf',
					'background-color': 'rgba(20, 184, 152, 0.08)',
					'border-color': 'rgba(94, 234, 207, 0.35)',
				},
				'code::before, code::after': {
					content: 'none',
				},
			},
		}),
	],

	transformers: [
		transformerVariantGroup(),
		transformerDirectives(),
	],

	theme: {
		fontFamily: {
			sans: ['"Permadi Body"', 'system-ui', 'sans-serif'],
			heading: ['"Permadi Heading"', 'sans-serif'],
			mono: ['"Permadi Mono"', 'monospace'],
		},
		breakpoints: {
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
			'3xl': '1920px',
		},

		colors: {
			brand: {
				50: '#f0fdfa',
				100: '#ccfbf2',
				200: '#99f6e4',
				300: '#5eeacf',
				400: '#2bd4b5',
				500: '#14b898',
				600: '#0e7e68',
				700: '#0f7662',
				800: '#115e4f',
				900: '#134e43',
				950: '#042f27',
			},
			slate: {
				50: '#f8fafa',
				100: '#eff6f5',
				200: '#deeae9',
				300: '#c5d9d7',
				400: '#84a8a4',
				500: '#537c77',
				600: '#375c58',
				700: '#224844',
				800: '#0a2f2c',
				900: '#001e1c',
				950: '#000c0a',
			},
			accent: '#f9bc60',
		},
	},

	shortcuts: {
		// Status & Badges
		'status-dot': 'w-2 h-2 rounded-none bg-brand-500 inline-block shadow-[0_0_0_2px_#ccfbf2] dark:shadow-[0_0_0_2px_rgba(20,184,152,0.2)] animate-status-pulse',
		'section-label': 'uppercase tracking-[0.15em] text-[11px] font-bold text-brand-800 dark:text-accent font-sans',
		'eyebrow': 'section-label',
		'kicker': 'section-label',
		'shadow-xs': 'shadow-sm',

		'focus-ring': 'outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0',

		'heading-page': 'font-heading font-900 text-3xl sm:text-5xl lg:text-6xl tracking-tight text-slate-950 dark:text-slate-50 leading-[1.05] mb-3',
		'heading-page-sub': 'text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl',

		'heading-hero': 'font-heading font-900 mb-4 text-4xl sm:text-6xl leading-[0.95] tracking-tight text-slate-950 dark:text-slate-50',
		'heading-sub': 'text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl',
		'heading-card-lg': 'font-heading font-900 text-xl tracking-tight text-slate-950 dark:text-slate-50',
		'heading-card-md': 'font-heading font-900 text-lg text-slate-950 dark:text-slate-50',
		'text-body': 'font-sans text-sm text-slate-950 dark:text-slate-50',
		'text-meta': 'font-sans text-xs text-slate-700 dark:text-slate-300',

		'btn-primary': 'focus-ring inline-flex items-center justify-center gap-2 px-5 py-2.5 font-bold text-white bg-brand-900 hover:bg-brand-950 dark:bg-brand-400 dark:text-slate-950 dark:hover:bg-brand-300 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-150 cursor-pointer',
		'btn-ghost': 'focus-ring inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all duration-150 cursor-pointer',
		'icon-btn': 'focus-ring flex items-center justify-center w-9 h-9 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105 active:scale-[0.92] transition-all duration-150 cursor-pointer',
		'badge-neutral': 'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60',

		// Swiss International Style System Shortcuts
		'swiss-container': 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
		'swiss-grid-12': 'grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-auto',
		'swiss-lead-8': 'col-span-1 sm:grid-cols-6 lg:col-span-8 p-6 sm:p-8 border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27]',
		'swiss-rail-4': 'col-span-1 sm:col-span-6 lg:col-span-4 p-6 sm:p-8 border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27] flex flex-col justify-between',
		'swiss-card-flat': 'border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27] p-6',
		'swiss-card-interactive': 'border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27] p-6 hover:border-brand-500 transition-colors',
		'swiss-h1': 'font-heading font-900 text-4xl sm:text-6xl tracking-tight text-slate-900 dark:text-slate-50 leading-[0.95] text-balance',
		'swiss-h2': 'font-heading font-900 text-2xl sm:text-4xl tracking-tight text-slate-900 dark:text-slate-50 leading-tight',
		'swiss-h3': 'font-heading font-900 text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-slate-50 leading-snug',
		'swiss-body': 'font-sans text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-[60ch]',
		'swiss-meta': 'font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums',
		'swiss-hairline-b': 'border-b border-slate-200/80 dark:border-[#134e43]',
		'swiss-hairline-t': 'border-t border-slate-200/80 dark:border-[#134e43]',
		'swiss-hairline-r': 'border-r border-slate-200/80 dark:border-[#134e43]',
		'swiss-spec-row': 'flex items-baseline justify-between py-2.5 swiss-hairline-b text-xs sm:text-sm',
		'swiss-btn-primary': 'inline-flex items-center justify-center gap-2 px-5 py-2.5 font-sans font-700 text-sm text-slate-950 bg-brand-400 hover:bg-brand-300 dark:bg-brand-400 dark:text-slate-950 dark:hover:bg-brand-300 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-xs',
		'swiss-btn-outline': 'inline-flex items-center justify-center gap-2 px-5 py-2.5 font-sans font-600 text-sm text-slate-900 dark:text-slate-50 border border-slate-300 dark:border-[#134e43] hover:border-brand-500 dark:hover:border-brand-400 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-150 cursor-pointer',
		'swiss-status-dot': 'w-2 h-2 rounded-none bg-brand-500 inline-block shadow-[0_0_0_2px_#ccfbf2] dark:shadow-[0_0_0_2px_rgba(20,184,152,0.2)] animate-status-pulse',
	},

	rules: [
		['aspect-photo', { 'aspect-ratio': '3 / 2' }],
		['aspect-profile', { 'aspect-ratio': '1 / 1' }],
		['aspect-article', { 'aspect-ratio': '5 / 3' }],
		['aspect-thumbnail', { 'aspect-ratio': '4 / 3' }],
	],

	safelist: [
		'i-swisspost-home',
		'i-swisspost-bookopen',
		'i-swisspost-folder',
		'i-swisspost-picture',
		'i-swisspost-sun',
		'i-swisspost-moon',
		'i-swisspost-search',
	],
})
