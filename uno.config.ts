import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetWind3,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss'

export default defineConfig({
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
		}),

		presetTypography(),
	],

	transformers: [
		transformerVariantGroup(),
		transformerDirectives(),
	],

	theme: {
		fontFamily: {
			sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
			heading: ['Barlow', 'sans-serif'],
			mono: ['JetBrains Mono', 'monospace'],
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
				600: '#0d947a',
				700: '#0f7662',
				800: '#115e4f',
				900: '#134e43',
				950: '#042f27',
			},
			gray: {
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
			yellow: '#ffd803',
			blue: '#3da9fc',
			red: '#ef4565',
			green: '#2cb67d',
			purple: '#994ff3',
		},

		borderRadius: {
			'bento': '0.75rem',
			'bento-island': '9999px',
		},
	},

	shortcuts: {
		// Bento Card variants
		'bento-card-base': 'relative rounded-bento p-6 transition-all duration-100 ease-out',
		'bento-card-solid': 'bento-card-base bg-brand-500 text-white hover:bg-brand-600',
		'bento-card-outline': 'bento-card-base border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 dark:hover:border-brand-400',
		'bento-card-soft': 'bento-card-base bg-brand-50/70 dark:bg-brand-950/30 border border-brand-100/50 dark:border-brand-900/30 hover:border-brand-500/60 dark:hover:border-brand-400/60',
		'bento-card-subtle': 'bento-card-base bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 hover:border-brand-500/60 dark:hover:border-brand-400/60',
		'bento-card-ghost': 'bento-card-base bg-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800/60',

		'bento-lift': 'hover:border-brand-500 dark:hover:border-brand-400',
		'bento-highlight': 'border border-brand-500/30 dark:border-brand-400/20',
		'focus-ring': 'outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0',

		'bento-grid': 'grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-[minmax(160px,auto)]',
		'container-bento': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',

		'nav-island': 'flex items-center gap-2 rounded-bento-island bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm',

		'heading-page': 'font-heading font-700 text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#000b07] dark:text-[#f8fafa] leading-[1.05] mb-3',
		'heading-page-sub': 'text-[#000b07]/80 dark:text-[#f8fafa]/80 text-base sm:text-lg leading-relaxed max-w-xl',

		'heading-hero': 'font-heading font-700 mb-4 text-4xl sm:text-6xl leading-[0.95] tracking-tight text-[#000b07] dark:text-[#f8fafa]',
		'heading-sub': 'text-[#000b07]/80 dark:text-[#f8fafa]/80 text-base sm:text-lg leading-relaxed max-w-xl',
		'heading-card-lg': 'font-heading font-700 text-xl tracking-tight text-[#000b07] dark:text-[#f8fafa]',
		'heading-card-md': 'font-heading font-600 text-lg text-[#000b07] dark:text-[#f8fafa]',
		'text-body': 'font-sans text-sm text-[#000b07] dark:text-[#f8fafa]',
		'text-meta': 'font-sans text-xs text-[#000b07]/70 dark:text-[#f8fafa]/70',

		'btn-primary': 'focus-ring inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-bento font-semibold text-white bg-brand-900 hover:bg-brand-950 dark:bg-brand-400 dark:text-slate-950 dark:hover:bg-brand-300 active:scale-95 transition-all shadow-sm shadow-brand-900/20',
		'btn-ghost': 'focus-ring inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-bento font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all',
		'icon-btn': 'focus-ring flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors',
		'badge-neutral': 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60',
	},

	rules: [
		['aspect-photo', { 'aspect-ratio': '3 / 2' }],
		['aspect-profile', { 'aspect-ratio': '1 / 1' }],
		['aspect-article', { 'aspect-ratio': '5 / 3' }],
		['aspect-thumbnail', { 'aspect-ratio': '4 / 3' }],
	],
})
