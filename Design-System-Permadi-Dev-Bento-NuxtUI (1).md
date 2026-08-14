# Design System: permadi.dev — Bento Grid × Nuxt UI

Versi ini melengkapi draft Design System yang kamu tempel, sudah dicek-silang lewat Nuxt UI MCP (props, slot, theme resmi tiap komponen) supaya kodenya benar-benar valid dipakai, bukan sekadar "kelihatan masuk akal". Beberapa hal saya koreksi/sederhanakan karena Nuxt UI ternyata sudah punya mekanisme bawaan untuk itu.

---

## 0. Temuan Penting dari Nuxt UI MCP

Tiga hal ini mengubah pendekatan di draft awal jadi lebih simpel:

1. **`PageGrid` secara resmi mendukung pola bento.** Dokumentasi komponennya secara eksplisit bilang: *"You can also use it to display a list of cards in a bento style layout by using `col-span-*` and `row-span-*` utility classes."* Jadi pendekatan override `ui.pageGrid.base` jadi 12-kolom + pakai `col-span`/`row-span` per kartu itu **sudah sesuai rekomendasi resmi**, bukan hack.
2. **Radius global sudah ada token bawaan: `--ui-radius`.** Nggak perlu override `compoundVariants` tiap komponen (`card`, `pageCard`, dst.) cuma untuk bikin sudut lebih membulat. Cukup satu baris CSS variable, otomatis berlaku ke semua komponen (`rounded-xs` s/d `rounded-3xl` dihitung relatif dari sini).
3. **Custom color WAJIB punya 11 shade (50–950).** Dokumentasi resmi kasih warning eksplisit: kalau kurang dari itu, komponen yang butuh shade lain (misal `primary-100` buat background soft) akan pecah. Palet `mint` yang di draft awal sudah lengkap 11 shade — itu sudah benar, tinggal dipastikan konsisten dipakai.

---

## 1. Design Tokens — Versi Final (pakai palet asli kamu)

Palet yang kamu kirim sudah lengkap 11 shade di semua warna (`brand`, `gray`, `slate`, `yellow`, `blue`, `red`, `green`, `purple`) — artinya sudah memenuhi syarat resmi Nuxt UI untuk custom/override color. Saya pakai persis token itu, tinggal dipetakan ke slot semantic Nuxt UI.

### 1.1 `app/assets/css/main.css`

```css
@import "tailwindcss";
@import "@nuxt/ui";

@theme static {
  --font-sans: 'TikTok Sans', sans-serif;
  --font-heading: 'Barlow', sans-serif;

  --breakpoint-3xl: 1920px;

  --color-brand-50: #f0fdfa;
  --color-brand-100: #ccfbf2;
  --color-brand-200: #99f6e4;
  --color-brand-300: #5eeacf;
  --color-brand-400: #2bd4b5;
  --color-brand-500: #14b898;
  --color-brand-600: #0d947a;
  --color-brand-700: #0f7662;
  --color-brand-800: #115e4f;
  --color-brand-900: #134e43;
  --color-brand-950: #042f27;

  --color-gray-50: oklch(0.985 0.002 181.171);
  --color-gray-100: oklch(0.967 0.003 182.411);
  --color-gray-200: oklch(0.928 0.006 180.489);
  --color-gray-300: oklch(0.872 0.01 178.161);
  --color-gray-400: oklch(0.707 0.022 176.394);
  --color-gray-500: oklch(0.551 0.027 173.996);
  --color-gray-600: oklch(0.446 0.03 174.144);
  --color-gray-700: oklch(0.373 0.034 174.902);
  --color-gray-800: oklch(0.278 0.033 175.919);
  --color-gray-900: oklch(0.21 0.034 177.678);
  --color-gray-950: oklch(0.13 0.028 177.019);

  --color-slate-50: #f8fafa;
  --color-slate-100: #eff6f5;
  --color-slate-200: #deeae9;
  --color-slate-300: #c5d9d7;
  --color-slate-400: #84a8a4;
  --color-slate-500: #537c77;
  --color-slate-600: #375c58;
  --color-slate-700: #224844;
  --color-slate-800: #0a2f2c;
  --color-slate-900: #001e1c;
  --color-slate-950: #000c0a;

  --color-yellow-50: #ffffff;
  --color-yellow-100: #fffefd;
  --color-yellow-200: #fdeed6;
  --color-yellow-300: #fcddaf;
  --color-yellow-400: #facd87;
  --color-yellow-500: #f9bc60;
  --color-yellow-600: #f7a52a;
  --color-yellow-700: #e08a08;
  --color-yellow-800: #aa6906;
  --color-yellow-900: #744804;
  --color-yellow-950: #593703;

  --color-blue-50: #f0f9ff;
  --color-blue-100: #e0f2fe;
  --color-blue-200: #bae6fd;
  --color-blue-300: #7dd3fc;
  --color-blue-400: #38bdf8;
  --color-blue-500: #0ea5e9;
  --color-blue-600: #0284c7;
  --color-blue-700: #0369a1;
  --color-blue-800: #075985;
  --color-blue-900: #0c4a6e;
  --color-blue-950: #082f49;

  --color-red-50: #fefbfb;
  --color-red-100: #fbeaea;
  --color-red-200: #f5c8c8;
  --color-red-300: #eea6a6;
  --color-red-400: #e88384;
  --color-red-500: #e16162;
  --color-red-600: #d83233;
  --color-red-700: #b02123;
  --color-red-800: #811919;
  --color-red-900: #521010;
  --color-red-950: #3a0b0b;

  --color-green-50: #eefbf4;
  --color-green-100: #d7f4e3;
  --color-green-200: #b1e9ca;
  --color-green-300: #7fd6ad;
  --color-green-400: #4abd8a;
  --color-green-500: #2cb67d;
  --color-green-600: #198258;
  --color-green-700: #146849;
  --color-green-800: #12533c;
  --color-green-900: #104432;
  --color-green-950: #08261d;

  --color-purple-50: #f7f5fd;
  --color-purple-100: #f0edfa;
  --color-purple-200: #e4ddf7;
  --color-purple-300: #cec2f0;
  --color-purple-400: #b69ee7;
  --color-purple-500: #a786df;
  --color-purple-600: #8c59ce;
  --color-purple-700: #7c47ba;
  --color-purple-800: #673b9c;
  --color-purple-900: #563280;
  --color-purple-950: #361f56;

  /* Skala tipografi golden ratio (φ ≈ 1.618) — lihat §1.3 */
  --text-g0: clamp(0.5rem, 0.618vw, 0.618rem);
  --text-g0--line-height: 1.2;
  --text-g0--letter-spacing: -0.01em;

  --text-g1: clamp(0.8rem, 1vw, 1rem);
  --text-g1--line-height: 1.5;
  --text-g1--letter-spacing: -0.01em;

  --text-g2: clamp(1.2rem, 1.618vw, 1.618rem);
  --text-g2--line-height: 1.4;
  --text-g2--letter-spacing: -0.015em;

  --text-g3: clamp(1.8rem, 2.618vw, 2.618rem);
  --text-g3--line-height: 1.3;
  --text-g3--letter-spacing: -0.02em;

  --text-g4: clamp(2.618rem, 4.236vw, 4.236rem);
  --text-g4--line-height: 1.2;
  --text-g4--letter-spacing: -0.025em;

  --text-g5: clamp(4.236rem, 6.854vw, 6.854rem);
  --text-g5--line-height: 1.1;
  --text-g5--letter-spacing: -0.03em;

  --text-g6: clamp(6.854rem, 11.09vw, 11.09rem);
  --text-g6--line-height: 1;
  --text-g6--letter-spacing: -0.035em;

  /* Aspect ratio untuk slot gambar di kartu bento — lihat §1.4 */
  --aspect-video: 16 / 9;
  --aspect-photo: 3 / 2;
  --aspect-profile: 1 / 1;
  --aspect-article: 5 / 3;
  --aspect-thumbnail: 4 / 3;
}

:root {
  /* Radius global — bento look butuh sudut lebih lembut dari default 0.25rem */
  --ui-radius: 0.75rem;

  /* Opsional: perbesar container kalau grid 12 kolom terasa sempit di layar besar */
  --ui-container: 84rem;
}
```

> Catatan: `--ui-radius` ini otomatis dipakai oleh **semua** komponen Nuxt UI (Card, PageCard, Button, Input, dll.) lewat utility `rounded-*` — jadi satu variable ini menggantikan seluruh rencana override `compoundVariants` radius di draft sebelumnya.
>
> Semua warna kamu sudah lengkap 11 shade — memenuhi syarat resmi Nuxt UI. Perhatikan: token di atas **override nama warna default Tailwind** (`gray`, `slate`, `yellow`, `blue`, `red`, `green`, `purple`), jadi begitu di-import, seluruh utility Tailwind bawaan (`bg-blue-500`, dsb.) otomatis ikut memakai palet kamu — bukan cuma komponen yang pakai prop `color` Nuxt UI.

### 1.2 `app/app.config.ts` — pemetaan warna semantic

Nuxt UI butuh warna semantic (`primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral`) dipetakan ke salah satu nama warna di `@theme`. Berdasarkan palet kamu:

```ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',    // aksen utama #5eeacf ada di brand-300
      secondary: 'purple', // aksen sekunder untuk elemen komplementer
      success: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      neutral: 'slate'     // teks, border, background netral
    },
    // Hover "lift" tipis khas bento — ini yang TIDAK disediakan otomatis oleh --ui-radius,
    // jadi tetap perlu compoundVariant, tapi hanya untuk transform, bukan radius/shadow
    pageCard: {
      compoundVariants: [
        {
          to: true,
          class: {
            root: 'transition-transform duration-200 hover:-translate-y-0.5'
          }
        }
      ]
    }
  }
})
```

> Catatan penting soal `brand`: nilai aksen asli situs (`#5eeacf`) ada di step **`brand-300`**, bukan di `brand-400`/`500` seperti asumsi draft sebelumnya. Karena Nuxt UI menghitung `--ui-primary` dari `primary-500` (light mode) dan `primary-400` (dark mode) secara default, warna aksen "utama" yang tampil di tombol/link itu sebenarnya `brand-500` (`#14b898`) di light mode — lebih gelap/jenuh dari `#5eeacf` yang kamu kenal sebagai aksen. Kalau kamu mau `#5eeacf` persis yang jadi warna `primary` yang tampil, override manual (lihat catatan di bawah).

Kalau ingin warna aksen yang benar-benar tampil (`--ui-primary`) itu `#5eeacf` persis, bukan hasil hitungan shade 500/400, override langsung di CSS (didukung resmi lewat mekanisme `--ui-*` di §CSS Variables):

```css
/* app/assets/css/main.css, di luar @theme */
:root {
  --ui-primary: var(--color-brand-300); /* #5eeacf persis */
}
.dark {
  --ui-primary: var(--color-brand-300);
}
```

Warna bawaan hover-background per varian (`hover:bg-elevated/50`, `hover:bg-inverted/90`, dst.) **sudah ada di theme resmi `PageCard`** — tidak perlu ditulis ulang. Yang kita tambahkan cuma efek "lift" (translate-y) supaya kartu bento terasa mengambang saat di-hover, sesuai poin interaksi di PRD §9.

### 1.3 Skala Tipografi — Golden Ratio (φ ≈ 1.618)

Token `--text-g0` s/d `--text-g6` yang kamu definisikan otomatis jadi utility class `text-g0`…`text-g6` (konvensi Tailwind v4 untuk key `--text-*`). Ini pemetaan yang disarankan ke hierarki kartu bento, supaya rasio golden ratio-nya benar-benar kelihatan bedanya antar ukuran kartu (bukan cuma kebetulan beda ukuran):

| Token | Ukuran (clamp) | Dipakai di |
|---|---|---|
| `text-g0` | ~0.5–0.62rem | Label/meta kecil: tag kategori, timestamp, caption galeri |
| `text-g1` | ~0.8–1rem | Body text default: description kartu 1×1/2×1, isi `UPageList` |
| `text-g2` | ~1.2–1.62rem | Title kartu ukuran sedang (1×2, 2×1) — mis. "Tulisan Terbaru", "Newsletter" |
| `text-g3` | ~1.8–2.62rem | Title kartu besar (2×2) — mis. judul "Proyek Unggulan" |
| `text-g4` | ~2.62–4.24rem | Nama/headline utama di Hero Card |
| `text-g5`–`text-g6` | ~4.24–11rem | Dipakai di luar grid bento — mis. halaman 404, section judul besar di halaman Tentang |

Cara pakai: karena `PageCard`/`Card` tidak punya prop ukuran font langsung, override lewat slot `ui`:

```vue
<UPageCard
  class="lg:col-span-6 lg:row-span-2"
  :ui="{ title: 'text-g4', description: 'text-g1' }"
  variant="subtle"
  orientation="horizontal"
>
  ...
</UPageCard>
```

### 1.4 Aspect Ratio — Slot Gambar per Jenis Kartu

Token `--aspect-*` kamu otomatis jadi utility `aspect-video`, `aspect-photo`, `aspect-profile`, `aspect-article`, `aspect-thumbnail`. Pemetaan ke kartu bento (melengkapi PRD §7 soal galeri yang butuh variasi rasio):

| Token | Rasio | Dipakai di |
|---|---|---|
| `aspect-profile` | 1:1 | Avatar Hero (`UAvatar`), thumbnail proyek kecil |
| `aspect-video` | 16:9 | Cover "Proyek Unggulan" (2×2), video embed |
| `aspect-article` | 5:3 | Cover kartu "Featured Post" di listing Blog |
| `aspect-thumbnail` | 4:3 | Thumbnail proyek reguler di grid `/projek` |
| `aspect-photo` | 3:2 | Foto landscape di Galeri |

Kombinasi `aspect-profile` (portrait-ish/persegi) dan `aspect-photo`/`aspect-thumbnail` (landscape) di grid Galeri inilah yang menghasilkan efek "dinamis" khas bento yang disebut di PRD §5 prinsip #7 — jangan semua gambar dipaksa 1 rasio yang sama.

---

## 2. Grid System — Bento (dikonfirmasi resmi via `PageGrid`)

```ts
// app.config.ts — tambahan pada ui.pageGrid
export default defineAppConfig({
  ui: {
    pageGrid: {
      base: 'relative grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-[minmax(160px,auto)]'
    }
  }
})
```

Tabel ukuran kartu (sama seperti draft, sudah dikonfirmasi ini pola yang didukung `PageGrid`):

| Ukuran | Class | Kapan dipakai |
|---|---|---|
| 1×1 | `lg:col-span-3 lg:row-span-1` | Tech Stack, Sosial, Statistik |
| 2×1 | `lg:col-span-6 lg:row-span-1` | Tentang Singkat, Newsletter |
| 1×2 | `lg:col-span-3 lg:row-span-2` | Cuplikan Galeri, Tulisan Terbaru |
| 2×2 | `lg:col-span-6 lg:row-span-2` | Hero/Profil, Proyek Unggulan |

---

## 3. Navbar — Gaya Bento ("Islands")

Konsisten dengan grid di bawahnya, navbar-nya bukan satu bar polos memanjang, tapi **beberapa "pulau" (island) terpisah** — masing-masing punya radius & shadow sendiri seperti kartu bento mini, mengambang dengan jarak (gap) di antaranya. Ini pola yang sekarang umum dipakai di portfolio bergaya bento (mirip macOS Dock/segmented nav).

### 3.1 Struktur 3 Island

```
[ Logo ]     [  Home   Blog   Projek   Galeri  ]     [ ☀/🌙  Kontak ]
  island 1              island 2 (pill nav)              island 3
```

- **Island kiri** — logo/brand, kartu kecil rounded-full.
- **Island tengah** — `UNavigationMenu` varian `pill` (dikonfirmasi resmi: prop `variant` cuma nerima `"pill" | "link"` — `pill` inilah yang bikin item aktif punya background rounded, pas untuk look bento).
- **Island kanan** — aksi: `ColorModeButton` + CTA "Kontak".

Ketiganya dibungkus `UHeader` lewat slot `left` / `default` (tengah) / `right` — struktur slot ini juga dikonfirmasi resmi dari komponen `Header` (bukan cuma satu slot `default` polos).

### 3.2 Implementasi

```vue
<!-- app/components/AppHeader.vue -->
<template>
  <UHeader
    :ui="{
      root: 'sticky top-4 z-50 bg-transparent border-none',
      container: 'flex items-center justify-between gap-2 sm:gap-4'
    }"
  >
    <!-- Island 1: Logo -->
    <template #left>
      <ULink
        to="/"
        class="flex items-center gap-2 rounded-full bg-default/80 backdrop-blur-md border border-default px-3 py-1.5 shadow-sm"
      >
        <UAvatar src="/logo.png" size="xs" />
        <span class="text-g1 font-semibold hidden sm:inline">permadi.dev</span>
      </ULink>
    </template>

    <!-- Island 2: Nav utama (pill nav, bento core) -->
    <UNavigationMenu
      :items="navItems"
      variant="pill"
      color="neutral"
      highlight
      highlight-color="primary"
      class="rounded-full bg-default/80 backdrop-blur-md border border-default px-1.5 py-1 shadow-sm"
    />

    <!-- Island 3: Aksi -->
    <template #right>
      <div class="flex items-center gap-2 rounded-full bg-default/80 backdrop-blur-md border border-default px-2 py-1.5 shadow-sm">
        <UColorModeButton />
        <UButton to="/kontak" label="Kontak" color="primary" size="sm" class="rounded-full" />
      </div>
    </template>

    <!-- Menu mobile: dipakai otomatis lewat slot #content bawaan UHeader -->
    <template #content>
      <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'Projek', to: '/projek' },
  { label: 'Galeri', to: '/galeri' }
]
</script>
```

### 3.3 Kenapa `sticky top-4` + `bg-transparent` di root

`UHeader` secara default nempel penuh di tepi atas (`sticky top-0`) selebar layar dengan background solid — itu gaya navbar konvensional. Supaya jadi "mengambang" (floating) khas bento:

- `root` di-override jadi `bg-transparent border-none` + `sticky top-4` — bar utamanya sendiri jadi invisible, yang kelihatan cuma 3 island di dalamnya (masing-masing punya background/border/shadow sendiri lewat class manual di atas).
- `backdrop-blur-md` + `bg-default/80` di tiap island bikin efek glass yang tetap kebaca saat konten di-scroll di baliknya.
- Radius island pakai `rounded-full` (bukan `--ui-radius` global) karena secara visual island navbar biasanya lebih membulat dari kartu konten — ini pengecualian yang disengaja, bukan inkonsistensi.

### 3.4 Highlight Item Aktif

Prop `highlight` + `highlight-color="primary"` pada `UNavigationMenu` (dikonfirmasi resmi tersedia, sama seperti di `PageCard`) otomatis kasih garis/indikator warna `primary` (brand) di item yang sedang aktif sesuai route — tidak perlu logic manual `route.path === item.to`.

### 3.5 Mobile

`UHeader` sudah bawa mekanisme `toggle` + slot `#content` bawaan untuk menu mobile (dikonfirmasi resmi ada prop `toggle`, `toggleSide`, `mode`) — jadi cukup isi `#content` dengan `UNavigationMenu orientation="vertical"` seperti contoh di atas, tidak perlu bikin drawer/modal sendiri dari nol.

---

## 4. `PageCard` — Props Terverifikasi

Ini daftar prop asli `PageCard` (bukan tebakan) beserta cara pakainya untuk bento:

| Prop | Nilai valid | Catatan pemakaian |
|---|---|---|
| `variant` | `solid \| outline \| soft \| subtle \| ghost \| naked` | default resmi = `outline`. Draft sebelumnya oke, tapi pastikan tidak menulis `variant="outline"` sebagai "default berbeda" — memang defaultnya `outline`, bukan `subtle` |
| `orientation` | `vertical \| horizontal` | pakai `horizontal` untuk kartu Hero 2×2 supaya avatar & teks sejajar di layar lebar |
| `spotlight` + `spotlightColor` | boolean + warna semantic | efek cursor-glow, cocok untuk 1 kartu paling penting (mis. Proyek Unggulan) — **jangan dipakai di banyak kartu sekaligus**, sesuai prinsip "emphasis lewat kontras, bukan semua kartu ramai" di PRD §5 |
| `highlight` + `highlightColor` | boolean + warna semantic | alternatif lebih halus dari spotlight — cuma nambah ring warna di sekeliling kartu. Bisa dipakai bareng `variant="subtle"` untuk kartu Hero |
| `reverse` | boolean | membalik urutan slot default — berguna kalau mau gambar di kiri, teks di kanan pada kartu Proyek |
| `to` | string / route object | otomatis dapat hover-state & focus-ring bawaan begitu diisi (lihat §6 Aksesibilitas) |

Slot yang tersedia: `header`, `leading`, `title`, `description`, `body`, `footer`, `default`.

---

## 5. Implementasi Home (revisi kecil dari draft)

```vue
<!-- pages/index.vue -->
<template>
  <UContainer>
    <UPageGrid>
      <!-- Hero / Profil - 2x2, horizontal supaya avatar+teks sejajar -->
      <UPageCard
        class="lg:col-span-6 lg:row-span-2"
        variant="subtle"
        orientation="horizontal"
        highlight
        highlight-color="primary"
      >
        <template #leading>
          <UAvatar src="/avatar.jpg" size="3xl" />
        </template>
        <template #title>Dinar Permadi Yusup</template>
        <template #description>
          Frontend Developer & Digital Craftsman. Membangun antarmuka yang rapi, cepat, dan enak dipakai.
        </template>
        <div class="flex gap-2 mt-4">
          <UButton to="/projek" label="Lihat Proyek" color="primary" />
          <UButton to="/blog" label="Baca Tulisan" variant="ghost" />
        </div>
      </UPageCard>

      <!-- Tentang Singkat - 2x1 -->
      <UPageCard
        class="lg:col-span-6"
        variant="soft"
        title="Tentang Singkat"
        description="Fokus di ekosistem Vue/Nuxt, suka desain sistem yang konsisten dan performa web."
        to="/tentang"
      />

      <!-- Proyek Unggulan - 2x2, satu-satunya kartu dengan spotlight -->
      <UPageCard
        class="lg:col-span-6 lg:row-span-2"
        variant="outline"
        spotlight
        spotlight-color="primary"
        title="Proyek Unggulan"
        description="Studi kasus terbaru: redesign sistem bento untuk portfolio pribadi."
        to="/projek/featured"
      >
        <img src="/projects/featured.jpg" class="w-full rounded-lg aspect-video object-cover" alt="">
      </UPageCard>

      <!-- Tulisan Terbaru - 1x2 -->
      <UPageCard class="lg:col-span-3 lg:row-span-2" variant="soft" title="Tulisan Terbaru">
        <UPageList divide>
          <ULink v-for="post in latestPosts" :key="post.path" :to="post.path" class="block py-2">
            {{ post.title }}
          </ULink>
        </UPageList>
      </UPageCard>

      <!-- Cuplikan Galeri - 1x2 -->
      <UPageCard class="lg:col-span-3 lg:row-span-2" variant="ghost" title="Galeri" to="/galeri">
        <div class="grid grid-cols-2 gap-2 mt-2">
          <img v-for="img in galleryPreview" :key="img" :src="img" class="rounded-md aspect-square object-cover" alt="">
        </div>
      </UPageCard>

      <!-- Tech Stack - 1x1 -->
      <UPageCard class="lg:col-span-3" variant="soft" title="Tech Stack">
        <div class="flex flex-wrap gap-2 mt-2">
          <UBadge v-for="tech in techStack" :key="tech" :label="tech" variant="subtle" color="neutral" />
        </div>
      </UPageCard>

      <!-- Sosial Media - 1x1 -->
      <UPageCard class="lg:col-span-3" variant="ghost" title="Terhubung">
        <div class="flex gap-2 mt-2">
          <UButton icon="i-simple-icons-github" variant="ghost" color="neutral" to="https://github.com/narr07" target="_blank" aria-label="GitHub" />
          <UButton icon="i-simple-icons-instagram" variant="ghost" color="neutral" to="https://www.instagram.com/narr07/" target="_blank" aria-label="Instagram" />
          <UButton icon="i-simple-icons-x" variant="ghost" color="neutral" to="https://x.com/dinarpermadi07" target="_blank" aria-label="X" />
          <UButton icon="i-simple-icons-behance" variant="ghost" color="neutral" to="https://www.behance.net/narr07" target="_blank" aria-label="Behance" />
          <UButton icon="i-lucide-mail" variant="ghost" color="neutral" to="mailto:hi@permadi.dev" aria-label="Email" />
        </div>
      </UPageCard>

      <!-- Newsletter - 2x1 -->
      <UPageCard class="lg:col-span-6" variant="subtle" title="Newsletter">
        <UForm :state="newsletterState" :schema="newsletterSchema" class="flex gap-2 mt-2" @submit="subscribe">
          <UFormField name="email" class="flex-1">
            <UInput v-model="newsletterState.email" placeholder="email@kamu.com" class="w-full" />
          </UFormField>
          <UButton type="submit" label="Subscribe" color="primary" />
        </UForm>
      </UPageCard>
    </UPageGrid>
  </UContainer>
</template>
```

Perubahan dari draft:
- `spotlight` cuma dipasang di kartu **Proyek Unggulan** saja (bukan lagi ambigu di banyak tempat) — menjaga prinsip "1 kartu paling menonjol per grid".
- Hero pakai `highlight` (ring halus) bukan `spotlight`, supaya spotlight tetap eksklusif untuk 1 kartu.
- Semua tombol ikon sosial dikasih `aria-label` — `UButton` tanpa `label` (icon-only) butuh ini untuk screen reader.
- `UForm` sekarang pakai `:schema` (disarankan pakai Zod/Valibot) — form tanpa schema tetap jalan tapi tidak tervalidasi otomatis. Contoh setup di §7.

---

## 6. Aksesibilitas — Apa yang Sudah Otomatis dari Nuxt UI

Dari dokumentasi resmi CSS Variables, Nuxt UI **sudah built-in**:

- Setiap elemen interaktif dapat outline `focus-visible` otomatis, warnanya mengikuti prop `color` komponen (mis. `outline-primary/25` saat `color="primary"`).
- `PageCard` dengan prop `to` otomatis dapat `outline-primary/25` + `has-[>a:focus-visible]:outline-3` dari theme resminya — **tidak perlu ditambahkan manual**.

Yang tetap jadi tanggung jawab kita (sesuai PRD §10):
- Icon-only `UButton` (tombol sosial) wajib `aria-label`.
- Urutan DOM kartu mengikuti prioritas konten, bukan urutan visual grid — atur lewat urutan penulisan di template, karena `col-span`/`row-span` cuma memengaruhi tampilan, bukan urutan tab.
- Kontras teks di atas gambar (kartu Proyek/Galeri) tetap perlu overlay gradient manual kalau gambar terang.

---

## 7. Form Newsletter — Validasi

`UForm` butuh minimal prop `state` (reactive object). Untuk validasi otomatis pakai `schema` (Standard Schema — Zod/Valibot/dst., tidak dibundel default, harus diinstal sendiri):

```ts
import { z } from 'zod'
import { reactive } from 'vue'

const newsletterSchema = z.object({
  email: z.string().email('Email tidak valid')
})

const newsletterState = reactive({ email: '' })

async function subscribe(event) {
  // event.data sudah tervalidasi sesuai schema
}
```

`FormField` otomatis menampilkan pesan error berdasarkan `name` yang cocok dengan key di schema — tidak perlu bikin komponen error sendiri.

---

## 8. Empty State — Props Resmi `UEmpty`

Berguna untuk Blog/Projek/Galeri saat kontennya masih kosong (poin risiko §12 PRD):

```vue
<UEmpty
  icon="i-lucide-inbox"
  title="Belum ada tulisan"
  description="Tulisan baru akan muncul di sini begitu dipublikasikan."
  :actions="[{ label: 'Kembali ke Home', to: '/', color: 'primary' }]"
/>
```

Props resmi yang tersedia: `icon`, `avatar`, `loading`, `title`, `description`, `actions` (array `ButtonProps`, jadi bisa langsung kasih beberapa tombol CTA sekaligus tanpa markup tambahan).

---

## 9. Listing Pages (Blog/Projek/Galeri)

Sama seperti draft: karena `BlogPosts` bawaan grid-nya seragam, susun manual pakai `PageGrid` + `PageCard` seperti Home. Untuk state kosong pakai `UEmpty` di atas, untuk loading pakai `USkeleton` per slot kartu:

```vue
<USkeleton class="lg:col-span-6 lg:row-span-2 rounded-[var(--ui-radius)]" />
```

---

## 10. Ringkasan Perubahan vs Draft Sebelumnya

| Area | Draft awal | Versi terverifikasi |
|---|---|---|
| Radius kartu | Override `compoundVariants` di `card` & `pageCard` | Satu baris `--ui-radius` di CSS, otomatis global |
| Hover background | Ditulis manual per varian | Sudah bawaan theme resmi `PageCard`, tidak perlu ditulis ulang |
| Hover "lift" | Belum ada | Ditambahkan lewat `compoundVariants` khusus transform (bagian yang memang belum disediakan default) |
| Spotlight | Dipakai tanpa aturan jelas | Dibatasi ke 1 kartu paling penting saja |
| Form newsletter | `UForm` tanpa schema | Ditambahkan `schema` (Zod) untuk validasi email |
| Empty state | Disebut sekilas | Dirinci lengkap dengan props resmi `UEmpty` |
| Icon button sosial | Tanpa label | Ditambahkan `aria-label` wajib |
| Palet warna | Placeholder `mint` 1 warna | Palet asli kamu (`brand`, `gray`, `slate`, `yellow`, `blue`, `red`, `green`, `purple`), dipetakan ke 7 slot semantic Nuxt UI |
| Tipografi | Belum ada skala | Skala golden ratio `text-g0`–`text-g6` dipetakan ke hierarki ukuran kartu bento |
| Rasio gambar | `aspect-video`/`aspect-square` generik | 5 token `aspect-*` khusus dipetakan per jenis kartu (Hero, Proyek, Blog, Galeri) |
| Navbar | Belum dibahas | Ditambahkan pola 3-island (`UHeader` slot `left`/default/`right` + `UNavigationMenu variant="pill"`) supaya navbar ikut gaya bento, bukan bar polos |

### Catatan Font

`--font-sans: 'TikTok Sans', sans-serif`
`--font-heading: 'Barlow', sans-serif`

semuaha heading gunakan font heading, hanya body yang megnguakn font-sans

---

### Referensi (Nuxt UI resmi, via MCP)
- Komponen: `PageGrid`, `PageCard`, `Card`, `Button`, `Badge`, `Form`, `Empty`, `Header`, `NavigationMenu`
- Halaman panduan: *Design System* (`/docs/getting-started/theme/design-system`), *CSS Variables* (`/docs/getting-started/theme/css-variables`)