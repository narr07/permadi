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

		presetTypography({
			cssExtend: {
				'h1,h2,h3,h4,h5,h6': {
					'font-family': '\'Barlow\', \'Plus Jakarta Sans\', sans-serif',
					'font-weight': '800',
					'letter-spacing': '-0.03em',
					'color': '#001e1c',
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
					'color': '#2cb67d',
					'text-decoration-color': 'rgba(44, 182, 125, 0.4)',
				},
				'blockquote': {
					'font-style': 'normal',
					'font-weight': '400',
					'color': '#224844',
					'background': '#eff6f5',
					'border-left': '4px solid #0f7662',
					'border-radius': '0 16px 16px 0',
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
					'border-radius': '6px',
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
			gray: '#90b4ce',
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
		// Status & Badges
		'status-dot': 'w-2 h-2 rounded-full bg-brand-500 inline-block shadow-[0_0_0_4px_#ccfbf2] dark:shadow-[0_0_0_4px_rgba(20,184,152,0.2)]',
		'section-label': 'uppercase tracking-[0.15em] text-[11px] font-bold text-brand-700 dark:text-accent font-sans',
		'eyebrow': 'section-label',
		'kicker': 'section-label',

		// Bento Card variants
		'bento-card-base': 'relative rounded-bento p-6 transition-all duration-100 ease-out',
		'bento-card-solid': 'bento-card-base bg-brand-500 text-white hover:bg-brand-600',
		'bento-card-outline': 'bento-card-base border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 dark:hover:border-brand-400',
		'bento-card-soft': 'bento-card-base bg-brand-50/70 dark:bg-brand-950/30 border border-brand-100/50 dark:border-brand-900/30 hover:border-brand-500/60 dark:hover:border-brand-400/60',
		'bento-card-subtle': 'bento-card-base bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 hover:border-brand-500/60 dark:hover:border-brand-400/60',
		'bento-card-ghost': 'bento-card-base bg-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800/60',

		// Clean Bento Cards (Maximized with UnoCSS)
		'bento-card-clean': 'relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27] shadow-xs transition-all duration-200 hover:(border-brand-500/50 dark:border-brand-400/40 shadow-md)',
		'hero-card-clean': 'relative rounded-2xl overflow-hidden border border-[#134e43] bg-[#002b27] text-[#f8fafa] shadow-xs transition-all duration-200',
		'sand-card-clean': 'relative rounded-2xl overflow-hidden border border-[#facd87] bg-[#facd87] text-[#000b07] shadow-xs transition-all duration-200',
		'sky-card-clean': 'relative rounded-2xl overflow-hidden border border-[#7dd3fc] bg-[#7dd3fc] text-[#000b07] shadow-xs transition-all duration-200',

		'bento-lift': 'hover:border-brand-500 dark:hover:border-brand-400',
		'bento-highlight': 'border border-brand-500/30 dark:border-brand-400/20',
		'focus-ring': 'outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0',

		'bento-grid': 'grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-[minmax(160px,auto)]',
		'container-bento': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',

		'nav-island': 'flex items-center gap-2 rounded-bento-island bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm',

		'heading-page': 'font-heading font-800 text-3xl sm:text-5xl lg:text-6xl tracking-tight text-slate-950 dark:text-slate-50 leading-[1.05] mb-3',
		'heading-page-sub': 'text-slate-950/80 dark:text-slate-50/80 text-base sm:text-lg leading-relaxed max-w-xl',

		'heading-hero': 'font-heading font-800 mb-4 text-4xl sm:text-6xl leading-[0.95] tracking-tight text-slate-950 dark:text-slate-50',
		'heading-sub': 'text-slate-950/80 dark:text-slate-50/80 text-base sm:text-lg leading-relaxed max-w-xl',
		'heading-card-lg': 'font-heading font-800 text-xl tracking-tight text-slate-950 dark:text-slate-50',
		'heading-card-md': 'font-heading font-800 text-lg text-slate-950 dark:text-slate-50',
		'text-body': 'font-sans text-sm text-slate-950 dark:text-slate-50',
		'text-meta': 'font-sans text-xs text-slate-950/70 dark:text-slate-50/70',

		'btn-primary': 'focus-ring inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-bento font-700 text-white bg-brand-900 hover:bg-brand-950 dark:bg-brand-400 dark:text-slate-950 dark:hover:bg-brand-300 active:scale-95 transition-all shadow-sm shadow-brand-900/20',
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
