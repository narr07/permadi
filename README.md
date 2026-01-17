# Permadi Website

Proyek ini adalah website personal yang dibangun menggunakan [Nuxt 4](https://nuxt.com/docs/getting-started/introduction) dan [Nuxt UI v4](https://ui3.nuxt.com/) (menggunakan Tailwind CSS v4).

## 🚀 Setup Proyek dari Awal

Berikut adalah langkah-langkah yang dilakukan untuk menginstal dan mengonfigurasi proyek ini dari nol:

### 1. Inisialisasi Proyek
Proyek ini diinisialisasi menggunakan Bun dengan template starter Nuxt Content:
```bash
bun create nuxt ./
```

### 2. Instalasi Dependensi
Dependensi utama yang digunakan dalam proyek ini meliputi:
- **Framework:** Nuxt 4 (Layered structure di `/app`)
- **UI & Styling:** `@nuxt/ui` (v4), `@nuxt/image`, `@vueuse/nuxt`
- **Content:** `@nuxt/content` (untuk file Markdown)
- **Linter & Code Style:** `@nuxt/eslint`, `@antfu/eslint-config`

Instal semua dependensi menggunakan Bun:
```bash
bun install
```

### 3. Konfigurasi Nuxt (`nuxt.config.ts`)
Konfigurasi penting yang diterapkan:
- Struktur Nuxt 4 (menggunakan folder `app/` untuk aset, komponen, dan halaman).
- Integrasi Nuxt UI v4 dengan Tailwind CSS v4.
- Penonaktifan mode `standalone` pada ESLint agar bisa menggunakan konfigurasi eksternal.

### 4. Konfigurasi ESLint & Styling (`eslint.config.mjs`)
Untuk menjaga kualitas kode, proyek ini menggunakan konfigurasi dari **Antfu** (`@antfu/eslint-config`) yang mendukung otomatisasi format untuk Vue, CSS, dan Markdown.

### 5. Pengaturan VS Code (`.vscode/settings.json`)
Penting untuk menerapkan pengaturan berikut agar format otomatis berjalan lancar (menggunakan ESLint sebagai formatter utama):
- Mematikan Prettier global.
- Menghidupkan `source.fixAll.eslint` saat save.
- Menonaktifkan format otomatis khusus untuk file Markdown (jika ingin edit manual tanpa intervensi linter).

### 6. Struktur Direktori
- `app/`: Berisi logika aplikasi (pages, components, assets).
- `content/`: Berisi file Markdown untuk dikelola oleh Nuxt Content.
- `public/`: Aset statis.

---

## 🛠️ Pengembangan (Development)

Jalankan server pengembangan:
```bash
bun run dev
```

Akses aplikasi di `http://localhost:3000`.

### Perintah Lainnya:
- **Linting:** `bun run lint`
- **Fix Linting:** `bun run lint:fix`
- **Build Produksi:** `bun run build`
- **Preview Produksi:** `bun run preview`

---

## 🎨 Theme & UI
Konfigurasi warna dan font kustom dapat ditemukan di:
- `app/app.config.ts`: Untuk pengaturan warna primary dan neutral Nuxt UI.
- `app/assets/css/main.css`: Untuk kustomisasi Tailwind CSS v4 (menggunakan `@theme static`).

---

Dibuat dengan ❤️ oleh Antigravity untuk Permadi.
