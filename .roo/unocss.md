---
name: unocss
description: Comprehensive all-in-one UnoCSS guide for Nuxt 4/3 - configuration, presets (Wind3/Wind4, Icons, Typography, Web Fonts, Attributify), transformers, shortcuts, custom rules, golden ratio theme tokens, bento grid layout patterns, and Cloudflare Pages performance optimizations.
---

# UnoCSS Comprehensive All-in-One Guide

UnoCSS adalah instant atomic CSS engine berkecepatan tinggi, modular, dan zero-runtime yang menjadi superset dari Tailwind CSS. Panduan ini menggabungkan seluruh konfigurasi, presets, transformers, theme tokens, dan pola arsitektur Bento Grid untuk Nuxt 4 dan Cloudflare Pages dalam satu file markdown lengkap.

---

## 1. Instalasi & Integrasi Nuxt 4

### 1.1 Paket Dependensi
Gunakan package manager default (**Bun**):
```bash
bun add -d unocss @unocss/nuxt @unocss/preset-wind3 @unocss/preset-icons @unocss/preset-typography @unocss/preset-web-fonts @unocss/transformer-variant-group @unocss/transformer-directives @iconify-json/carbon @iconify-json/lucide
```

### 1.2 `nuxt.config.ts`
```ts
// nuxt.config.ts
export default defineNuxtConfig({
	modules: [
		'@unocss/nuxt',
		'@nuxt/content',
		'@nuxtjs/i18n',
	],
	css: [
		'@unocss/reset/tailwind.css', // Reset CSS standar Tailwind/Modern
		'~/assets/css/main.css',
	],
	features: {
		inlineStyles: true, // Inline critical CSS untuk skor PageSpeed 100/100
	},
})
```

---

## 2. File Konfigurasi Penuh: `uno.config.ts`

Berikut template `uno.config.ts` siap pakai yang mencakup **Golden Ratio Typography**, **Bento Grid Helpers**, **Palet Warna 11-Shade (50–950)**, dan **Pure CSS Icons**:

```ts
// uno.config.ts
import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetTypography,
	presetWebFonts,
	presetWind3,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss'

export default defineConfig({
	presets: [
		// 1. Preset Wind (Kompatibel 100% dengan class Tailwind CSS v3/v4)
		presetWind3({
			dark: 'class',
		}),

		// 2. Pure CSS Icons via Iconify (0 KB runtime JS, render via SVG Data URI)
		presetIcons({
			scale: 1.2,
			warn: true,
			extraProperties: {
				'display': 'inline-block',
				'vertical-align': 'middle',
			},
			collections: {
				carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
				lucide: () => import('@iconify-json/lucide/icons.json').then(i => i.default),
			},
		}),

		// 3. Preset Typography (Untuk styling Markdown / Nuxt Content Prose)
		presetTypography({
			cssExtend: {
				'a': {
					'color': 'var(--color-brand-600)',
					'text-decoration': 'none',
					'border-bottom': '1px dashed var(--color-brand-400)',
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

		// 4. Web Fonts Preset (Self-hosted / Google Fonts tanpa render-blocking)
		presetWebFonts({
			provider: 'google',
			fonts: {
				sans: 'TikTok Sans:400,500,600,700',
				heading: 'Barlow:600,700,800',
				mono: 'JetBrains Mono:400,600',
			},
		}),

		// 5. Attributify Preset (Opsional: <div text="sm white" bg="brand-500">)
		presetAttributify(),
	],

	transformers: [
		// Mengaktifkan grouping varian: hover:(bg-brand-600 text-white)
		transformerVariantGroup(),
		// Mengaktifkan direktif CSS: @apply, theme(), @screen
		transformerDirectives(),
	],

	// Design Tokens & Tema Kustom
	theme: {
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
		},
		fontSize: {
			// Skala Tipografi Golden Ratio (φ ≈ 1.618)
			g0: ['clamp(0.5rem, 0.618vw, 0.618rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
			g1: ['clamp(0.8rem, 1vw, 1rem)', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
			g2: ['clamp(1.2rem, 1.618vw, 1.618rem)', { lineHeight: '1.4', letterSpacing: '-0.015em' }],
			g3: ['clamp(1.8rem, 2.618vw, 2.618rem)', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
			g4: ['clamp(2.618rem, 4.236vw, 4.236rem)', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
			g5: ['clamp(4.236rem, 6.854vw, 6.854rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
		},
		borderRadius: {
			bento: '1.25rem',
		},
	},

	// Shortcuts (Kombinasi class yang sering dipakai berulang)
	shortcuts: {
		// Bento Card Primitives
		'bento-card': 'relative p-6 rounded-bento bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:(shadow-xl shadow-brand-500/5 -translate-y-1 border-brand-500/40)',
		'bento-card-glass': 'relative p-6 rounded-bento bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-slate-800/50 shadow-lg',
		'bento-grid': 'grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6',

		// Layout & Container
		'container-custom': 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
		'flex-center': 'flex items-center justify-center',
		'flex-between': 'flex items-center justify-between',

		// Typography Shortcuts
		'heading-hero': 'font-heading font-800 text-g4 md:text-g5 tracking-tight text-slate-900 dark:text-white',
		'heading-section': 'font-heading font-700 text-g3 tracking-tight text-slate-900 dark:text-white',
		'text-body': 'font-sans text-g1 text-slate-600 dark:text-slate-300',
		'text-sub': 'font-sans text-g0 text-slate-400 dark:text-slate-500',

		// UI Elements
		'btn-primary': 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-brand-500 hover:bg-brand-600 active:scale-95 transition-all shadow-md shadow-brand-500/20',
		'btn-outline': 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-500 transition-all',
		'badge-brand': 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800',
	},

	// Custom CSS Rules (Dinamis / Regex)
	rules: [
		// Dynamic Glass effect: glass-10 -> backdrop-blur-10px
		[/^glass-(\d+)$/, ([, d]) => ({
			'backdrop-filter': `blur(${d}px)`,
			'-webkit-backdrop-filter': `blur(${d}px)`,
		})],
		// Custom Golden Ratio Aspect Ratio
		['aspect-golden', { 'aspect-ratio': '1.618 / 1' }],
		['aspect-golden-portrait', { 'aspect-ratio': '1 / 1.618' }],
	],
})
```

---

## 3. Fitur Utama UnoCSS & Cara Penggunaan

### 3.1 Pure CSS Icons (Tanpa JS Runtime)
Cukup gunakan class berawalan `i-[collection]-[icon-name]`. Icon akan di-render sebagai CSS mask SVG (0 KB JavaScript):
```vue
<template>
  <div class="flex items-center gap-2">
    <!-- Icon Carbon -->
    <span class="i-carbon-sun text-xl text-yellow-500" />
    <!-- Icon Lucide -->
    <span class="i-lucide-arrow-up-right text-lg text-brand-500 group-hover:translate-x-1 transition-transform" />
    <span class="i-lucide-search text-slate-400" />
  </div>
</template>
```

### 3.2 Variant Grouping
Gabungkan pseudo-class (`hover:`, `dark:`, `md:`, `focus:`) agar kode ringkas dan mudah dibaca:
```html
<!-- Sebelum: -->
<div class="hover:bg-brand-600 hover:text-white hover:shadow-lg dark:bg-slate-800 dark:text-slate-200">

<!-- Dengan Variant Grouping: -->
<div class="hover:(bg-brand-600 text-white shadow-lg) dark:(bg-slate-800 text-slate-200)">
```

### 3.3 Dynamic CSS Arbitrary Values
UnoCSS mendukung nilai arbitrary dengan sintaks mirip Tailwind:
```html
<div class="p-[1.618rem] grid-cols-[1fr_1.618fr] text-[#14b898] bg-opacity-80">
```

### 3.4 Direktif `@apply` di File CSS / SFC `<style>`
```css
/* assets/css/main.css atau SFC <style> */
.custom-header {
  @apply font-heading font-bold text-g3 text-slate-900 dark:text-white mb-4;
}
```

---

## 4. Pola Implementasi Bento Grid (12-Kolom)

Dengan UnoCSS, Anda membuat Bento Grid menggunakan kombinasi `bento-grid` (shortcut) + `col-span-*` dan `row-span-*`:

```vue
<!-- components/HomeBentoGrid.vue -->
<template>
  <section class="container-custom py-12">
    <div class="bento-grid">
      <!-- 1. Hero Card (8 Kolom, 2 Baris) -->
      <div class="col-span-12 md:col-span-8 md:row-span-2 bento-card flex flex-col justify-between overflow-hidden">
        <div>
          <span class="badge-brand mb-4">
            <span class="i-lucide-sparkles" /> Available for Hire
          </span>
          <h1 class="heading-hero mb-4">
            Crafting High-Performance Digital Experiences.
          </h1>
          <p class="text-body max-w-xl">
            Software Craftsman focusing on Nuxt, TypeScript, and modern web architecture.
          </p>
        </div>
        <div class="mt-8 flex gap-3">
          <NuxtLink to="/projects" class="btn-primary">
            View Projects <span class="i-lucide-arrow-right" />
          </NuxtLink>
          <NuxtLink to="/contact" class="btn-outline">
            Get in Touch
          </NuxtLink>
        </div>
      </div>

      <!-- 2. Tech Stack Bento (4 Kolom, 1 Baris) -->
      <div class="col-span-12 md:col-span-4 bento-card">
        <h3 class="font-heading font-700 text-g2 mb-2">Core Stack</h3>
        <p class="text-sub mb-4">Technologies I use daily</p>
        <div class="flex flex-wrap gap-2 text-2xl text-slate-600 dark:text-slate-300">
          <span class="i-carbon-logo-vue text-emerald-500" title="Vue.js" />
          <span class="i-lucide-layers text-brand-500" title="Nuxt" />
          <span class="i-carbon-cloud text-amber-500" title="Cloudflare" />
          <span class="i-lucide-database text-blue-500" title="SQLite / D1" />
        </div>
      </div>

      <!-- 3. Latest Article Bento (4 Kolom, 1 Baris) -->
      <div class="col-span-12 md:col-span-4 bento-card group cursor-pointer">
        <div class="flex-between mb-2">
          <span class="text-sub">Latest Post</span>
          <span class="i-lucide-arrow-up-right text-slate-400 group-hover:(text-brand-500 translate-x-0.5 -translate-y-0.5) transition-transform" />
        </div>
        <h4 class="font-heading font-600 text-g1 group-hover:text-brand-500 transition-colors">
          Optimizing Nuxt with Cloudflare D1
        </h4>
        <p class="text-sub mt-2">5 min read · 2026</p>
      </div>

      <!-- 4. Metric / Stat Bento (4 Kolom) -->
      <div class="col-span-12 sm:col-span-6 md:col-span-4 bento-card flex-center flex-col text-center">
        <span class="font-heading font-800 text-g4 text-brand-500">100%</span>
        <span class="text-sub mt-1">PageSpeed & Core Web Vitals</span>
      </div>

      <!-- 5. Location / Timezone Bento (4 Kolom) -->
      <div class="col-span-12 sm:col-span-6 md:col-span-4 bento-card flex-center flex-col text-center">
        <span class="i-carbon-location text-2xl text-brand-500 mb-1" />
        <span class="font-600 text-g1">Jakarta, Indonesia</span>
        <span class="text-sub">UTC+7 (WIB)</span>
      </div>

      <!-- 6. Status Bento (4 Kolom) -->
      <div class="col-span-12 md:col-span-4 bento-card flex items-center gap-4">
        <div class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </div>
        <div>
          <h5 class="font-600 text-sm">Open to New Projects</h5>
          <p class="text-sub text-xs">Consulting & Fullstack Dev</p>
        </div>
      </div>
    </div>
  </section>
</template>
```

---

## 5. Styling Nuxt Content (Markdown / Prose) dengan `@unocss/preset-typography`

Pada halaman blog/projek yang merender markdown (`<ContentRenderer :value="data" />`), bungkus dengan class `prose`:

```vue
<!-- pages/blog/[slug].vue -->
<template>
  <article class="container-custom py-12">
    <!-- Header Artikel -->
    <header class="mb-10 text-center max-w-2xl mx-auto">
      <h1 class="heading-hero mb-4">{{ article.title }}</h1>
      <p class="text-sub">{{ article.readingTime }} min read · {{ article.date }}</p>
    </header>

    <!-- Konten Markdown Typography -->
    <div class="prose prose-slate dark:prose-invert max-w-3xl mx-auto font-sans leading-relaxed">
      <ContentRenderer :value="article" />
    </div>
  </article>
</template>
```

---

## 6. Tips Performa & PageSpeed 100/100 di Cloudflare Pages

1. **Inline CSS:** Nuxt secara otomatis menyisipkan CSS atomic UnoCSS yang dihasilkan ke dalam tag `<style>` di `<head>` dokumen HTML hasil SSG. Ini mengeliminasi *Render-Blocking CSS requests*.
2. **Zero JS Icons:** Menggunakan `@unocss/preset-icons` menggantikan kebutuhan library ikon berbasis komponen Vue seperti Lucide-Vue / FontAwesome, memangkas ukuran JavaScript bundle hingga 20–40 KB.
3. **Optimasi Font:** Gunakan `display: 'swap'` pada konfigurasi web fonts untuk mencegah *Flash of Invisible Text (FOIT)*.
4. **Purge / Tree-shaking:** UnoCSS hanya mengekstrak class yang benar-benar ada di file `.vue`, `.ts`, dan `.md`, memastikan output CSS bersih tanpa class tak terpakai (*Zero Bloat*).
