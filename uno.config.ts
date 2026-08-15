import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetWebFonts,
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

		presetTypography({
			cssExtend: {
				'h1, h2, h3, h4, h5, h6': {
					'font-family': 'Barlow, sans-serif',
					'letter-spacing': '-0.02em',
				},
				'a': {
					'color': 'var(--color-brand-600, #0d947a)',
					'text-decoration': 'none',
					'border-bottom': '1px dashed var(--color-brand-400, #2bd4b5)',
				},
				'a:hover': {
					'border-bottom-style': 'solid',
				},
				'pre': {
					'border-radius': '0.75rem',
					'padding': '1.25rem',
				},
				'code::before': { content: '""' },
				'code::after': { content: '""' },
			},
		}),

		presetWebFonts({
			provider: 'google',
			fonts: {
				sans: 'Plus Jakarta Sans:400,500,600,700',
				heading: 'Barlow:400,500,600,700,800,900',
				mono: 'JetBrains Mono:400,600',
			},
		}),
	],

	transformers: [
		transformerVariantGroup(),
		transformerDirectives(),
	],

	theme: {
		fontFamily: {
			sans: ['TikTok Sans', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
			heading: ['Barlow', 'sans-serif'],
			mono: ['JetBrains Mono', 'monospace'],
		},
		breakpoints: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
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
				50: 'oklch(0.985 0.002 181.171)',
				100: 'oklch(0.967 0.003 182.411)',
				200: 'oklch(0.928 0.006 180.489)',
				300: 'oklch(0.872 0.01 178.161)',
				400: 'oklch(0.707 0.022 176.394)',
				500: 'oklch(0.551 0.027 173.996)',
				600: 'oklch(0.446 0.03 174.144)',
				700: 'oklch(0.373 0.034 174.902)',
				800: 'oklch(0.278 0.033 175.919)',
				900: 'oklch(0.21 0.034 177.678)',
				950: 'oklch(0.13 0.028 177.019)',
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
			yellow: {
				50: '#ffffff',
				100: '#fffefd',
				200: '#fdeed6',
				300: '#fcddaf',
				400: '#facd87',
				500: '#f9bc60',
				600: '#f7a52a',
				700: '#e08a08',
				800: '#aa6906',
				900: '#744804',
				950: '#593703',
			},
			blue: {
				50: '#f0f9ff',
				100: '#e0f2fe',
				200: '#bae6fd',
				300: '#7dd3fc',
				400: '#38bdf8',
				500: '#0ea5e9',
				600: '#0284c7',
				700: '#0369a1',
				800: '#075985',
				900: '#0c4a6e',
				950: '#082f49',
			},
			red: {
				50: '#fefbfb',
				100: '#fbeaea',
				200: '#f5c8c8',
				300: '#eea6a6',
				400: '#e88384',
				500: '#e16162',
				600: '#d83233',
				700: '#b02123',
				800: '#811919',
				900: '#521010',
				950: '#3a0b0b',
			},
			green: {
				50: '#eefbf4',
				100: '#d7f4e3',
				200: '#b1e9ca',
				300: '#7fd6ad',
				400: '#4abd8a',
				500: '#2cb67d',
				600: '#198258',
				700: '#146849',
				800: '#12533c',
				900: '#104432',
				950: '#08261d',
			},
			purple: {
				50: '#f7f5fd',
				100: '#f0edfa',
				200: '#e4ddf7',
				300: '#cec2f0',
				400: '#b69ee7',
				500: '#a786df',
				600: '#8c59ce',
				700: '#7c47ba',
				800: '#673b9c',
				900: '#563280',
				950: '#361f56',
			},
		},

		fontSize: {
			g0: ['clamp(0.5rem, 0.618vw, 0.618rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
			g1: ['clamp(0.8rem, 1vw, 1rem)', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
			g2: ['clamp(1.2rem, 1.618vw, 1.618rem)', { lineHeight: '1.4', letterSpacing: '-0.015em' }],
			g3: ['clamp(1.8rem, 2.618vw, 2.618rem)', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
			g4: ['clamp(2.618rem, 4.236vw, 4.236rem)', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
			g5: ['clamp(4.236rem, 6.854vw, 6.854rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
			g6: ['clamp(6.854rem, 11.09vw, 11.09rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],
		},

		borderRadius: {
			'bento': '0.75rem',
			'bento-island': '9999px',
		},
	},

	shortcuts: {
		// Bento Card variants
		'bento-card-base': 'relative rounded-bento p-6 transition-all duration-200',
		'bento-card-solid': 'bento-card-base bg-brand-500 text-white hover:bg-brand-600',
		'bento-card-outline': 'bento-card-base border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50',
		'bento-card-soft': 'bento-card-base bg-brand-50/70 dark:bg-brand-950/30 border border-brand-100/50 dark:border-brand-900/30 hover:bg-brand-100/80 dark:hover:bg-brand-950/50',
		'bento-card-subtle': 'bento-card-base bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60',
		'bento-card-ghost': 'bento-card-base bg-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800/60',

		'bento-lift': 'hover:-translate-y-0.5',
		'bento-highlight': 'border border-brand-500/30 dark:border-brand-400/20',
		'focus-ring': 'outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0',

		'bento-spotlight': 'relative overflow-hidden before:(content-empty absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none) before:bg-[radial-gradient(400px_circle_at_var(--x,_50%)_var(--y,_50%),rgba(43,212,181,0.15),transparent_70%)]',

		'bento-grid': 'grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-[minmax(160px,auto)]',
		'container-bento': 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',

		'nav-island': 'flex items-center gap-2 rounded-bento-island bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm',

		'heading-hero': 'font-heading font-800 text-g4 tracking-tight text-slate-900 dark:text-white',
		'heading-card-lg': 'font-heading font-700 text-g3 tracking-tight text-slate-900 dark:text-white',
		'heading-card-md': 'font-heading font-600 text-g2 text-slate-900 dark:text-white',
		'text-body': 'font-sans text-g1 text-slate-600 dark:text-slate-300',
		'text-meta': 'font-sans text-g0 text-slate-400 dark:text-slate-500',

		'btn-primary': 'focus-ring inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-bento font-medium text-white bg-brand-500 hover:bg-brand-600 active:scale-95 transition-all shadow-sm shadow-brand-500/20',
		'btn-ghost': 'focus-ring inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-bento font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all',
		'icon-btn': 'focus-ring flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors',
		'badge-neutral': 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-g0 font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60',
	},

	rules: [
		['aspect-photo', { 'aspect-ratio': '3 / 2' }],
		['aspect-profile', { 'aspect-ratio': '1 / 1' }],
		['aspect-article', { 'aspect-ratio': '5 / 3' }],
		['aspect-thumbnail', { 'aspect-ratio': '4 / 3' }],
	],
})
