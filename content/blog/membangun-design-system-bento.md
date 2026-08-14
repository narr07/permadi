---
title: "Membangun Design System Bento Grid dengan Nuxt UI & Tailwind v4"
description: "Panduan arsitektur layout Bento 12-kolom, integrasi token warna 11-shade, dan teknik floating island navbar."
date: "2026-08-10"
tags: ["Design System", "Nuxt UI", "Tailwind CSS", "Bento Grid"]
cover: "/blog/bento-system.jpg"
aspectRatio: "aspect-article"
readTime: "6 min read"
featured: true
---

# Membangun Design System Bento Grid dengan Nuxt UI & Tailwind v4

Layout **Bento Grid** telah menjadi tren dominan dalam desain produk digital modern. Terinspirasi dari kotak makan bento khas Jepang yang membagi ruang secara proporsional dan terorganisir, antarmuka bento memberikan fleksibilitas luar biasa untuk menampilkan berbagai jenis informasi dalam satu kanvas terpadu.

## Mengapa Memilih Bento Grid?

1. **Fleksibilitas Hirarki**: Modul kartu dapat berukuran 1×1 (Tech Stack / Sosial), 2×1 (Tentang / Newsletter), 1×2 (Tulisan Terbaru / Galeri), hingga 2×2 (Hero & Proyek Unggulan).
2. **Scannability yang Tinggi**: Pengunjung dapat menyerap esensi portofolio dalam hitungan detik tanpa harus melakukan scroll panjang yang membosankan.
3. **Harmoni Visual**: Seluruh kartu berbagi radius sudut (`--ui-radius: 0.75rem`) dan spasi yang konsisten.

## Mengatur Sistem Grid 12-Kolom

Dalam Tailwind CSS v4, kita dapat memanfaatkan grid bawaan dengan pembagian kolom responsif:
- Mobile: 1 Kolom
- Tablet (`sm`): 6 Kolom
- Desktop (`lg`): 12 Kolom

```html
<div class="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-6">
  <!-- Bento Cards -->
</div>
```

Dengan landasan token warna 11-shade yang lengkap, tampilan tetap kontras dan nyaman baik di tema terang maupun gelap.
