# Design System: permadi.dev — Bento Grid × UnoCSS

Versi ini adalah **konversi 1:1** dari Design System Nuxt UI yang sudah kita buat — token warna, golden ratio, aspect ratio, grid bento, navbar 3-island, sampai fungsi form/empty-state tetap sama. Bedanya cuma _cara_ mewujudkannya: karena UnoCSS **bukan component library** (beda dari Nuxt UI yang kasih komponen jadi), beberapa hal yang tadinya "gratis" dari prop komponen (`spotlight`, `highlight`, focus-ring otomatis, validasi form) sekarang perlu ditulis manual lewat shortcut/rule UnoCSS atau sedikit composable Vue. Saya tandai tiap bagian yang butuh kerja ekstra ini.

Referensi konfigurasi dasar dipakai dari skill UnoCSS project kamu (golden ratio + bento shortcuts + preset), lalu saya lengkapi supaya isinya **identik secara fungsi** dengan versi Nuxt UI: 8 warna penuh, `text-g6`, 5 aspect ratio, dan navbar.

---

## 0. Apa yang Berubah dari Versi Nuxt UI

| Area                                             | Di Nuxt UI (gratis dari komponen)                               | Di UnoCSS (perlu ditulis manual)                                                    |
| ------------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Struktur kartu (`PageCard`)                      | Komponen siap pakai dengan slot `title`/`description`/`leading` | Shortcut `bento-card` + markup HTML biasa (`<div>`, `<h3>`, `<p>`)                  |
| Varian kartu (`solid/outline/soft/subtle/ghost`) | Prop `variant`                                                  | 5 shortcut terpisah: `bento-card-solid`, `-outline`, `-soft`, `-subtle`, `-ghost`   |
| Efek `spotlight` (glow ikut kursor)              | Built-in, JS-nya sudah ada di dalam komponen                    | Perlu composable kecil (~15 baris) — lihat §4.3                                     |
| Efek `highlight` (ring aktif)                    | Prop `highlight`                                                | Shortcut `bento-highlight` (CSS murni, tidak butuh JS)                              |
| Focus-ring otomatis                              | Built-in di semua komponen interaktif                           | Shortcut `focus-ring` ditambahkan manual ke tiap elemen fokusable                   |
| Validasi form (`UForm` + schema)                 | Built-in, tinggal isi prop `schema`                             | Pakai `vee-validate` + `zod` manual (§7)                                            |
| Empty state (`UEmpty`)                           | Komponen siap pakai                                             | Bikin 1 komponen `EmptyState.vue` sendiri (§8) — sekali bikin, dipakai berkali-kali |
| Radius global                                    | 1 CSS variable `--ui-radius`                                    | 1 token `theme.borderRadius.bento` di `uno.config.ts`                               |
| Ukuran CSS akhir                                 | Lebih besar (semua kelas Tailwind dari komponen ikut ke-bundle) | Lebih kecil — cuma class yang benar-benar dipakai yang di-generate                  |

Poin pentingnya: **arsitektur bento (grid, warna, tipografi, rasio gambar) 100% bisa dipindah apa adanya**, karena itu semua murni CSS/token. Yang berubah cuma bagian "logic komponen" — dan itu bisa dikompensasi dengan shortcut UnoCSS + sedikit Vue murni.

---

## 1. Instalasi

```bash
bun add -d unocss @unocss/nuxt @unocss/preset-wind3 @unocss/preset-icons @unocss/preset-typography @unocss/preset-web-fonts @unocss/transformer-variant-group @unocss/transformer-directives @iconify-json/simple-icons @iconify-json/lucide
```

> `@iconify-json/simple-icons` ditambahkan khusus untuk ikon sosial media (`i-simple-icons-github`, `i-simple-icons-instagram`, `i-simple-icons-x`, `i-simple-icons-behance`) — persis pengganti `i-simple-icons-*` yang dulu dipakai lewat `UButton icon="..."` di versi Nuxt UI.

### `nuxt.config.ts`

```ts
export default defineNuxtConfig({
	modules: ['@unocss/nuxt', '@nuxt/content'],
	css: ['@unocss/reset/tailwind.css', '~/assets/css/main.css'],
	features: {
		inlineStyles: true, // inline critical CSS — menghindari isu render-blocking CSS yang sempat kita bahas
	},
});
```

---

## 2. `uno.config.ts` — Design Tokens Lengkap

Ini versi lengkap: 8 warna penuh (`brand`, `gray`, `slate`, `yellow`, `blue`, `red`, `green`, `purple`), golden ratio `g0`–`g6`, 5 aspect ratio, breakpoint `3xl`, dan font TikTok Sans (body) + Barlow (heading).

```ts
// uno.config.ts
import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetWebFonts,
	presetWind3,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';

export default defineConfig({
	presets: [
		presetWind3({ dark: 'class' }),

		presetIcons({
			scale: 1.2,
			warn: true,
			extraProperties: {
				display: 'inline-block',
				'vertical-align': 'middle',
			},
			collections: {
				'simple-icons': () =>
					import('@iconify-json/simple-icons/icons.json').then(
						(i) => i.default,
					),
				lucide: () =>
					import('@iconify-json/lucide/icons.json').then((i) => i.default),
			},
		}),

		presetTypography({
			cssExtend: {
				a: {
					color: 'var(--color-brand-600)',
					'text-decoration': 'none',
					'border-bottom': '1px dashed var(--color-brand-400)',
				},
				'a:hover': { 'border-bottom-style': 'solid' },
			},
		}),

		// TikTok Sans (body) + Barlow (heading) — keduanya tersedia di Google Fonts
		presetWebFonts({
			provider: 'google',
			fonts: {
				sans: 'TikTok Sans:400,500,600,700',
				heading: 'Barlow:600,700,800',
				mono: 'JetBrains Mono:400,600',
			},
		}),
	],

	transformers: [transformerVariantGroup(), transformerDirectives()],

	theme: {
		// Breakpoint tambahan 3xl — presetWind3 pakai key "breakpoints" (bukan "screens")
		extendTheme: (theme) => ({
			...theme,
			breakpoints: {
				...theme.breakpoints,
				'3xl': '1920px',
			},
		}),

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
			// Skala tipografi golden ratio (φ ≈ 1.618) — g0 s/d g6, LENGKAP (versi skill cuma sampai g5)
			g0: [
				'clamp(0.5rem, 0.618vw, 0.618rem)',
				{ lineHeight: '1.2', letterSpacing: '-0.01em' },
			],
			g1: [
				'clamp(0.8rem, 1vw, 1rem)',
				{ lineHeight: '1.5', letterSpacing: '-0.01em' },
			],
			g2: [
				'clamp(1.2rem, 1.618vw, 1.618rem)',
				{ lineHeight: '1.4', letterSpacing: '-0.015em' },
			],
			g3: [
				'clamp(1.8rem, 2.618vw, 2.618rem)',
				{ lineHeight: '1.3', letterSpacing: '-0.02em' },
			],
			g4: [
				'clamp(2.618rem, 4.236vw, 4.236rem)',
				{ lineHeight: '1.2', letterSpacing: '-0.025em' },
			],
			g5: [
				'clamp(4.236rem, 6.854vw, 6.854rem)',
				{ lineHeight: '1.1', letterSpacing: '-0.03em' },
			],
			g6: [
				'clamp(6.854rem, 11.09vw, 11.09rem)',
				{ lineHeight: '1', letterSpacing: '-0.035em' },
			],
		},

		borderRadius: {
			bento: '0.75rem', // radius kartu konten — setara --ui-radius di versi Nuxt UI
			'bento-island': '9999px', // radius island navbar (rounded-full)
		},
	},

	shortcuts: {
		// ===== Bento Card — 5 varian, setara prop `variant` di PageCard Nuxt UI =====
		'bento-card-base': 'relative rounded-bento p-6 transition-all duration-200',
		'bento-card-solid':
			'bento-card-base bg-brand-500 text-white hover:bg-brand-600',
		'bento-card-outline':
			'bento-card-base border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50',
		'bento-card-soft':
			'bento-card-base bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-950/60',
		'bento-card-subtle':
			'bento-card-base bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60',
		'bento-card-ghost':
			'bento-card-base hover:bg-slate-100 dark:hover:bg-slate-800/50',

		// Efek "lift" saat hover — setara compoundVariants translate-y di versi Nuxt UI
		'bento-lift': 'hover:-translate-y-0.5',

		// Ring highlight — setara prop `highlight` di PageCard/NavigationMenu
		'bento-highlight': 'ring-1 ring-brand-500/40',

		// Focus ring — setara focus-visible bawaan Nuxt UI, di sini ditulis manual
		'focus-ring':
			'outline-none focus-visible:(outline-2 outline-offset-2 outline-brand-500)',

		// ===== Grid & Layout =====
		'bento-grid':
			'grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-[minmax(160px,auto)]',
		'container-bento': 'max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8',

		// ===== Navbar Island (§4) =====
		'nav-island':
			'flex items-center gap-2 rounded-bento-island bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm',

		// ===== Tipografi =====
		'heading-hero':
			'font-heading font-800 text-g4 tracking-tight text-slate-900 dark:text-white',
		'heading-card-lg':
			'font-heading font-700 text-g3 tracking-tight text-slate-900 dark:text-white',
		'heading-card-md':
			'font-heading font-600 text-g2 text-slate-900 dark:text-white',
		'text-body': 'font-sans text-g1 text-slate-600 dark:text-slate-300',
		'text-meta': 'font-sans text-g0 text-slate-400 dark:text-slate-500',

		// ===== Elemen UI =====
		'btn-primary':
			'focus-ring inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-bento font-medium text-white bg-brand-500 hover:bg-brand-600 active:scale-95 transition-all',
		'btn-ghost':
			'focus-ring inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-bento font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all',
		'icon-btn':
			'focus-ring flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors',
		'badge-neutral':
			'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-g0 font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
	},

	rules: [
		// Aspect ratio khusus (di luar `aspect-video`/`aspect-square` bawaan Wind3)
		['aspect-photo', { 'aspect-ratio': '3 / 2' }],
		['aspect-profile', { 'aspect-ratio': '1 / 1' }],
		['aspect-article', { 'aspect-ratio': '5 / 3' }],
		['aspect-thumbnail', { 'aspect-ratio': '4 / 3' }],
		// aspect-video sudah tersedia bawaan dari presetWind3 (16/9) — tidak perlu didefinisikan ulang
	],
});
```

> Catatan warna `brand`: sama seperti di versi Nuxt UI, nilai aksen asli `#5eeacf` ada di `brand-300`, bukan `brand-500`. Karena di UnoCSS kamu yang menulis langsung shortcut (`bg-brand-500` di `btn-primary`), kamu **bebas pilih step mana yang mau dipakai** — tidak ada penghitungan otomatis seperti `--ui-primary` di Nuxt UI. Kalau mau tombol persis `#5eeacf`, ganti `bg-brand-500` → `bg-brand-300` di shortcut `btn-primary` (perhatikan kontras teks putih di atasnya mungkin perlu diganti jadi teks gelap).

---

## 3. Grid System — Bento (sama seperti versi Nuxt UI)

```html
<div class="bento-grid">
	<!-- isi kartu -->
</div>
```

Tabel ukuran kartu — **identik** dengan versi Nuxt UI, cuma tanpa prefix `U`:

| Ukuran | Class                         | Kapan dipakai                    |
| ------ | ----------------------------- | -------------------------------- |
| 1×1    | `lg:col-span-3 lg:row-span-1` | Tech Stack, Sosial, Statistik    |
| 2×1    | `lg:col-span-6 lg:row-span-1` | Tentang Singkat, Newsletter      |
| 1×2    | `lg:col-span-3 lg:row-span-2` | Cuplikan Galeri, Tulisan Terbaru |
| 2×2    | `lg:col-span-6 lg:row-span-2` | Hero/Profil, Proyek Unggulan     |

---

## 4. Navbar — Gaya Bento ("Islands"), Versi UnoCSS

Struktur 3-island-nya sama persis dengan versi Nuxt UI. Bedanya: karena tidak ada `UHeader`, island kiri/tengah/kanan dan mekanisme mobile-menu ditulis manual dengan `<nav>` + sedikit state Vue.

### 4.1 Implementasi

```vue
<!-- app/components/AppHeader.vue -->
<template>
	<header class="sticky top-4 z-50">
		<div
			class="container-bento flex items-center justify-between gap-2 sm:gap-4"
		>
			<!-- Island 1: Logo -->
			<NuxtLink
				to="/"
				class="nav-island px-3 py-1.5"
			>
				<img
					src="/logo.png"
					class="w-6 h-6 rounded-full"
					alt="Logo permadi.dev"
				/>
				<span class="text-g1 font-heading font-semibold hidden sm:inline"
					>permadi.dev</span
				>
			</NuxtLink>

			<!-- Island 2: Nav utama (pill nav, bento core) -->
			<nav class="nav-island px-1.5 py-1 hidden md:flex">
				<NuxtLink
					v-for="item in navItems"
					:key="item.to"
					:to="item.to"
					class="focus-ring px-3 py-1.5 rounded-bento-island text-g1 text-slate-600 dark:text-slate-300 transition-colors hover:text-brand-600"
					active-class="bg-brand-50 dark:bg-brand-950/50 text-brand-600! bento-highlight"
				>
					{{ item.label }}
				</NuxtLink>
			</nav>

			<!-- Island 3: Aksi -->
			<div class="nav-island px-2 py-1.5">
				<button
					class="icon-btn"
					aria-label="Ganti mode gelap/terang"
					@click="toggleColorMode"
				>
					<span class="i-lucide-sun dark:hidden" />
					<span class="i-lucide-moon hidden dark:inline" />
				</button>
				<NuxtLink
					to="/kontak"
					class="btn-primary !px-4 !py-1.5 text-g0"
					>Kontak</NuxtLink
				>
				<button
					class="icon-btn md:hidden"
					aria-label="Buka menu"
					@click="mobileOpen = !mobileOpen"
				>
					<span class="i-lucide-menu" />
				</button>
			</div>
		</div>

		<!-- Menu mobile: manual, karena tidak ada slot #content bawaan seperti UHeader -->
		<nav
			v-if="mobileOpen"
			class="container-bento mt-2 md:hidden nav-island flex-col items-stretch p-2"
		>
			<NuxtLink
				v-for="item in navItems"
				:key="item.to"
				:to="item.to"
				class="focus-ring block px-3 py-2 rounded-bento text-g1"
				active-class="bg-brand-50 dark:bg-brand-950/50 text-brand-600!"
				@click="mobileOpen = false"
			>
				{{ item.label }}
			</NuxtLink>
		</nav>
	</header>
</template>

<script setup lang="ts">
	const mobileOpen = ref(false);
	const navItems = [
		{ label: 'Home', to: '/' },
		{ label: 'Blog', to: '/blog' },
		{ label: 'Projek', to: '/projek' },
		{ label: 'Galeri', to: '/galeri' },
	];

	const colorMode = useColorMode(); // dari @nuxtjs/color-mode, tidak dibundel UnoCSS — install terpisah
	function toggleColorMode() {
		colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
	}
</script>
```

### 4.2 Yang Berbeda dari Versi Nuxt UI

- **Item aktif** dulu otomatis lewat prop `highlight` di `UNavigationMenu`; sekarang pakai `active-class` bawaan `NuxtLink` (fitur Nuxt sendiri, bukan UnoCSS) dikombinasikan dengan shortcut `bento-highlight` — hasilnya sama: item aktif dapat background + ring warna brand.
- **Dark mode toggle** dulu `UColorModeButton` (auto-wired ke `@nuxtjs/color-mode`); sekarang tombol manual yang toggle `colorMode.preference`, dengan dua ikon (`i-lucide-sun`/`i-lucide-moon`) yang disembunyikan bergantian pakai `dark:hidden` / `dark:inline` — modul `@nuxtjs/color-mode` **tetap perlu diinstal terpisah**, UnoCSS cuma urus stylingnya.
- **Menu mobile** dulu bawaan lewat slot `#content` + prop `toggle` milik `UHeader`; sekarang manual dengan 1 `ref(false)` (`mobileOpen`) — total tambahan cuma ~10 baris.

### 4.3 Spotlight Effect (untuk kartu Proyek Unggulan)

Ini satu-satunya efek yang di Nuxt UI benar-benar built-in JS (`spotlight` prop pada `PageCard` men-tracking posisi kursor). Di UnoCSS versi CSS-murni-nya:

```vue
<!-- composables/useSpotlight.ts -->
<script setup lang="ts">
	function useSpotlight() {
		const el = useTemplateRef<HTMLElement>('spotlightEl');
		function onMove(e: MouseEvent) {
			const rect = el.value?.getBoundingClientRect();
			if (!rect) return;
			el.value!.style.setProperty('--x', `${e.clientX - rect.left}px`);
			el.value!.style.setProperty('--y', `${e.clientY - rect.top}px`);
		}
		return { el, onMove };
	}
</script>
```

```html
<!-- shortcut tambahan di uno.config.ts -->
'bento-spotlight': 'relative overflow-hidden before:(content-empty absolute
inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300
pointer-events-none)
before:bg-[radial-gradient(400px_circle_at_var(--x)_var(--y),theme(colors.brand.400/15%),transparent_70%)]'
```

```vue
<div
	ref="spotlightEl"
	class="bento-card-outline bento-spotlight lg:col-span-6 lg:row-span-2"
	@mousemove="onMove"
>
  ...
</div>
```

Sama seperti prinsip di versi Nuxt UI: **pakai efek ini cuma di 1 kartu paling penting** (Proyek Unggulan), bukan di semua kartu.

---

## 5. Implementasi Home

```vue
<!-- pages/index.vue -->
<template>
	<div class="container-bento py-8">
		<div class="bento-grid">
			<!-- Hero / Profil - 2x2 -->
			<NuxtLink
				to="/tentang"
				class="bento-card-subtle bento-lift bento-highlight lg:col-span-6 lg:row-span-2 flex items-center gap-4"
			>
				<img
					src="/avatar.jpg"
					class="w-20 h-20 rounded-full aspect-profile object-cover"
					alt="Foto Dinar Permadi Yusup"
				/>
				<div>
					<h1 class="heading-hero">Dinar Permadi Yusup</h1>
					<p class="text-body mt-2">
						Frontend Developer & Digital Craftsman. Membangun antarmuka yang
						rapi, cepat, dan enak dipakai.
					</p>
					<div class="flex gap-2 mt-4">
						<NuxtLink
							to="/projek"
							class="btn-primary"
							>Lihat Proyek</NuxtLink
						>
						<NuxtLink
							to="/blog"
							class="btn-ghost"
							>Baca Tulisan</NuxtLink
						>
					</div>
				</div>
			</NuxtLink>

			<!-- Tentang Singkat - 2x1 -->
			<NuxtLink
				to="/tentang"
				class="bento-card-soft bento-lift lg:col-span-6"
			>
				<h3 class="heading-card-md">Tentang Singkat</h3>
				<p class="text-body mt-1">
					Fokus di ekosistem Vue/Nuxt, suka desain sistem yang konsisten dan
					performa web.
				</p>
			</NuxtLink>

			<!-- Proyek Unggulan - 2x2, satu-satunya kartu dengan spotlight -->
			<NuxtLink
				ref="spotlightEl"
				to="/projek/featured"
				class="bento-card-outline bento-spotlight bento-lift lg:col-span-6 lg:row-span-2"
				@mousemove="onMove"
			>
				<h3 class="heading-card-lg">Proyek Unggulan</h3>
				<p class="text-body mt-1">
					Studi kasus terbaru: redesign sistem bento untuk portfolio pribadi.
				</p>
				<img
					src="/projects/featured.jpg"
					class="w-full aspect-video object-cover rounded-bento mt-4"
					alt=""
				/>
			</NuxtLink>

			<!-- Tulisan Terbaru - 1x2 -->
			<div class="bento-card-soft lg:col-span-3 lg:row-span-2">
				<h3 class="heading-card-md">Tulisan Terbaru</h3>
				<ul class="mt-2 divide-y divide-slate-200 dark:divide-slate-800">
					<li
						v-for="post in latestPosts"
						:key="post.path"
					>
						<NuxtLink
							:to="post.path"
							class="focus-ring block py-2 text-body hover:text-brand-600"
						>
							{{ post.title }}
						</NuxtLink>
					</li>
				</ul>
			</div>

			<!-- Cuplikan Galeri - 1x2 -->
			<NuxtLink
				to="/galeri"
				class="bento-card-ghost bento-lift lg:col-span-3 lg:row-span-2"
			>
				<h3 class="heading-card-md">Galeri</h3>
				<div class="grid grid-cols-2 gap-2 mt-2">
					<img
						v-for="(img, i) in galleryPreview"
						:key="img"
						:src="img"
						:class="i % 2 === 0 ? 'aspect-profile' : 'aspect-photo'"
						class="rounded-bento object-cover w-full"
						alt=""
					/>
				</div>
			</NuxtLink>

			<!-- Tech Stack - 1x1 -->
			<div class="bento-card-soft lg:col-span-3">
				<h3 class="heading-card-md">Tech Stack</h3>
				<div class="flex flex-wrap gap-2 mt-2">
					<span
						v-for="tech in techStack"
						:key="tech"
						class="badge-neutral"
						>{{ tech }}</span
					>
				</div>
			</div>

			<!-- Sosial Media - 1x1 -->
			<div class="bento-card-ghost lg:col-span-3">
				<h3 class="heading-card-md">Terhubung</h3>
				<div class="flex gap-2 mt-2">
					<a
						href="https://github.com/narr07"
						target="_blank"
						rel="noopener"
						class="icon-btn"
						aria-label="GitHub"
					>
						<span class="i-simple-icons-github" />
					</a>
					<a
						href="https://www.instagram.com/narr07/"
						target="_blank"
						rel="noopener"
						class="icon-btn"
						aria-label="Instagram"
					>
						<span class="i-simple-icons-instagram" />
					</a>
					<a
						href="https://x.com/dinarpermadi07"
						target="_blank"
						rel="noopener"
						class="icon-btn"
						aria-label="X"
					>
						<span class="i-simple-icons-x" />
					</a>
					<a
						href="https://www.behance.net/narr07"
						target="_blank"
						rel="noopener"
						class="icon-btn"
						aria-label="Behance"
					>
						<span class="i-simple-icons-behance" />
					</a>
					<a
						href="mailto:dinar@permadi.dev"
						class="icon-btn"
						aria-label="Email"
					>
						<span class="i-lucide-mail" />
					</a>
				</div>
			</div>

			<!-- Newsletter - 2x1 -->
			<div class="bento-card-subtle lg:col-span-6">
				<h3 class="heading-card-md">Newsletter</h3>
				<NewsletterForm />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { el: spotlightEl, onMove } = useSpotlight();
	// latestPosts, galleryPreview, techStack: sama seperti versi Nuxt UI, dari useAsyncData/queryContent
</script>
```

Perubahan konsep dari versi Nuxt UI:

- Kartu yang tadinya `<UPageCard to="...">` sekarang jadi `<NuxtLink class="bento-card-*">` langsung — fungsinya sama (seluruh kartu bisa diklik), cuma tanpa layer komponen di tengahnya.
- `heading-hero`/`heading-card-lg`/`heading-card-md` sudah otomatis pakai `font-heading` (Barlow) sesuai instruksi kamu; `text-body`/`text-meta` pakai `font-sans` (TikTok Sans).
- `aspect-profile` dipakai untuk avatar & sebagian galeri, `aspect-photo`/`aspect-video` untuk sisanya — variasi ini yang bikin galeri kelihatan dinamis, sama seperti prinsip di versi Nuxt UI §1.4.

---

## 6. Aksesibilitas — Apa yang Sekarang Jadi Tanggung Jawab Manual

Tidak seperti Nuxt UI yang otomatis kasih focus-ring & hover-state, di UnoCSS **semuanya eksplisit lewat shortcut**:

- Shortcut `focus-ring` **wajib ditambahkan manual** ke setiap elemen interaktif custom (link, button, item nav) — beda dari Nuxt UI yang otomatis. Kalau lupa pasang shortcut ini, elemen jadi tidak kelihatan fokusnya saat navigasi keyboard.
- Icon-only button (`icon-btn`) tetap wajib `aria-label`, sama seperti versi Nuxt UI.
- Urutan DOM kartu tetap harus ikut prioritas konten (bukan urutan visual) — ini aturan universal, tidak berubah walau ganti stack.
- Kontras teks di atas gambar tetap perlu overlay gradient manual, sama seperti sebelumnya.

---

## 7. Form Newsletter — Validasi (tanpa `UForm`)

Karena tidak ada `UForm`/`UFormField` bawaan, validasi + pesan error ditulis sendiri pakai `vee-validate` + `zod` (instal terpisah: `bun add vee-validate zod @vee-validate/zod`):

```vue
<!-- components/NewsletterForm.vue -->
<template>
	<form
		class="flex gap-2 mt-2"
		@submit="onSubmit"
	>
		<div class="flex-1">
			<input
				v-model="email"
				type="email"
				placeholder="email@kamu.com"
				class="focus-ring w-full px-3 py-2 rounded-bento border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-g1"
				:class="{ 'border-red-500!': errors.email }"
			/>
			<p
				v-if="errors.email"
				class="text-meta text-red-600 mt-1"
			>
				{{ errors.email }}
			</p>
		</div>
		<button
			type="submit"
			class="btn-primary"
		>
			Subscribe
		</button>
	</form>
</template>

<script setup lang="ts">
	import { toTypedSchema } from '@vee-validate/zod';
	import { useForm } from 'vee-validate';
	import { z } from 'zod';

	const { defineField, errors, handleSubmit } = useForm({
		validationSchema: toTypedSchema(
			z.object({ email: z.string().email('Email tidak valid') }),
		),
	});
	const [email] = defineField('email');

	const onSubmit = handleSubmit(async (values) => {
		// values.email sudah tervalidasi
	});
</script>
```

Ini menggantikan `UForm :schema` — fungsinya sama (validasi Zod + pesan error otomatis muncul di bawah input), cuma butuh 1 dependency tambahan (`vee-validate`) karena UnoCSS tidak membawa logic form sama sekali.

---

## 8. Empty State — Komponen Manual (pengganti `UEmpty`)

```vue
<!-- components/EmptyState.vue -->
<template>
	<div class="flex flex-col items-center text-center py-12 px-4">
		<span
			:class="icon"
			class="text-4xl text-slate-300 dark:text-slate-700 mb-4"
		/>
		<h3 class="heading-card-md">{{ title }}</h3>
		<p class="text-body mt-1 max-w-sm">{{ description }}</p>
		<div
			v-if="actions?.length"
			class="flex gap-2 mt-4"
		>
			<NuxtLink
				v-for="a in actions"
				:key="a.to"
				:to="a.to"
				class="btn-primary"
				>{{ a.label }}</NuxtLink
			>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		icon: string;
		title: string;
		description: string;
		actions?: { label: string; to: string }[];
	}>();
</script>
```

```html
<EmptyState
	icon="i-lucide-inbox"
	title="Belum ada tulisan"
	description="Tulisan baru akan muncul di sini begitu dipublikasikan."
	:actions="[{ label: 'Kembali ke Home', to: '/' }]"
/>
```

Sekali dibuat, komponen ini dipakai ulang di Blog/Projek/Galeri — persis seperti `UEmpty`, cuma sekarang miliknya sendiri (bisa dikustom bebas tanpa terikat theme Nuxt UI).

---

## 9. Listing Pages & Loading Skeleton

```html
<!-- pengganti USkeleton -->
<div
	class="lg:col-span-6 lg:row-span-2 rounded-bento bg-slate-200 dark:bg-slate-800 animate-pulse"
/>
```

Sama seperti sebelumnya: karena listing grid Blog/Projek/Galeri butuh ukuran kartu bervariasi (bukan grid seragam), susun manual dengan `bento-grid` + class `col-span`/`row-span` per item, 1 kartu "featured" dapat ukuran besar (`lg:col-span-6 lg:row-span-2`), sisanya reguler (`lg:col-span-3`).

---

## 10. Ringkasan: Apa yang Sama, Apa yang Beda

| Area                                           | Sama persis dengan versi Nuxt UI                       | Berubah                                                                                                                |
| ---------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Warna (8 palet, 11 shade)                      | ✅ Token identik                                       | —                                                                                                                      |
| Golden ratio typography (`g0`–`g6`)            | ✅ Identik                                             | Cara pakai: dulu lewat prop `:ui`, sekarang langsung `class="text-g4"`                                                 |
| Aspect ratio (5 token)                         | ✅ Identik                                             | `aspect-video` bawaan Wind3, 4 lainnya custom `rules`                                                                  |
| Font (TikTok Sans body, Barlow heading)        | ✅ Identik, sama-sama dari Google Fonts                | Cara load: `presetWebFonts` (bukan `--font-*` manual)                                                                  |
| Grid bento (12 kolom, 4 ukuran kartu)          | ✅ Identik                                             | Shortcut `bento-grid` (bukan `UPageGrid`)                                                                              |
| Navbar 3-island                                | ✅ Struktur & visual identik                           | Item aktif via `NuxtLink active-class` (bukan prop `highlight`), mobile menu manual                                    |
| Varian kartu (solid/outline/soft/subtle/ghost) | ✅ 5 varian sama                                       | 5 shortcut terpisah, bukan 1 prop `variant`                                                                            |
| Spotlight                                      | ✅ Efek visual sama                                    | Butuh composable ~15 baris (dulu built-in)                                                                             |
| Validasi form                                  | ✅ Zod, pesan error sama                               | Butuh `vee-validate` (dulu built-in di `UForm`)                                                                        |
| Empty state                                    | ✅ Props sama (`icon`/`title`/`description`/`actions`) | 1 komponen custom, dibuat sekali                                                                                       |
| Ukuran CSS akhir                               | —                                                      | **Lebih kecil** — cuma shortcut & class yang dipakai yang ke-generate, tidak ada "bawaan komponen" yang ikut ke-bundle |

Kesimpulan: fungsinya **sama persis**, effort tambahannya cuma di beberapa titik yang tadinya "gratis" dari komponen Nuxt UI (spotlight, validasi form, empty state) — dan semuanya sudah dikasih contoh lengkap di atas, jadi tinggal pakai.

---

### Referensi

- Skill UnoCSS project kamu (`golden ratio + bento shortcuts` sudah jadi basis konfigurasi ini)
- Dokumentasi resmi UnoCSS: `theme.breakpoints` (presetWind3), `presetIcons`, `presetWebFonts`, `transformerDirectives`
