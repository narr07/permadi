---
name: artikelgen
description: Generator artikel blog SEO-driven mendalam berbasis Google Trends, penerjemah bilingual ID-EN dengan proteksi sintaks MDC Nuxt Content, dan generator visual ilustrasi flat design dengan palet brand teal/emerald (#14b898). Gunakan saat membuat draf artikel blog baru, meriset tren pencarian Google Trends, mengoptimasi SEO on-page, menerjemahkan artikel (content/id <-> content/en), atau membuat prompt/gambar pendukung blog.
license: MIT
---

# ArtikelGen: SEO Content (Google Trends Driven), Translator & Visual Studio

Skill khusus untuk alur kerja penerbitan blog di ekosistem Nuxt Content (`content/id/blog` & `content/en/blog`). Mengintegrasikan 4 kapabilitas utama:

1. **Google Trends Intelligence**: Mengambil data pencarian tren Google real-time (`daily-trends`, `realtime-trends`, `autocomplete`, `related-queries`, `related-topics`) untuk memvalidasi topik, menemukan kata kunci turunan (*rising queries*), dan memberi rekomendasi sudut pandang artikel yang sedang dicari banyak orang.
2. **Article Generator (SEO-Driven & MDC)**: Menulis artikel 1.500–2.000+ kata dengan metode BLUF, tata bahasa baku, optimasi SEO on-page berbasis tren, dan komponen MDC native.
3. **Technical Translator (ID ↔ EN)**: Menerjemahkan artikel secara presisi dengan perlindungan total terhadap komponen MDC, frontmatter skema, kode, dan path internal.
4. **Brand Visual Generator**: Menghasilkan gambar ilustrasi/vektor flat 16:9 dengan palet warna brand terstandarisasi (#14b898).

---

## Modus Operasional & Kapan Digunakan

| Modus | Kebutuhan / Perintah Pengguna | Rujukan Utama |
|---|---|---|
| **📈 Riset & Tulis Artikel** | "Buat artikel tentang X dengan Google Trends", "Tulis draf blog SEO tentang Y" | [references/article-generator-seo.md](references/article-generator-seo.md) |
| **🌐 Terjemahkan** | "Terjemahkan artikel ini ke Inggris/Indonesia", "Sync blog id ke en" | [references/translator.md](references/translator.md) |
| **🎨 Gambar & Visual** | "Buat gambar/ilustrasi untuk artikel ini", "Generate featured image" | [references/image-generator.md](references/image-generator.md) |

---

## 0. Alur Kerja Riset Google Trends (Pre-Writing)

Sebelum menulis artikel, manfaatkan script Google Trends untuk menemukan sudut pandang artikel yang sedang naik daun:

```bash
# Cek saran pencarian populer
node .agents/skills/artikelgen/scripts/trends.mjs autocomplete "<kata-kunci>" --hl id

# Cek tren harian / real-time
node .agents/skills/artikelgen/scripts/trends.mjs daily-trends --geo ID
node .agents/skills/artikelgen/scripts/trends.mjs realtime-trends --geo ID --hours 24

# Cek query & topik terkait jika tersedia
node .agents/skills/artikelgen/scripts/trends.mjs related-queries "<kata-kunci>" --geo ID
node .agents/skills/artikelgen/scripts/trends.mjs related-topics "<kata-kunci>" --geo ID
```

Sajikan **Rekomendasi Berbasis Google Trends** secara singkat kepada pengguna di awal (di luar blok kode artikel), misalnya:
- *Top Trending Angle*: Topik turunan yang memiliki minat pencarian tinggi.
- *Recommended Secondary Keywords*: Query yang sedang dicari audiens target.

---

## 1. Standar Penulisan & Format Artikel (Quick Ref)

- **Bahasa Default**: Bahasa Indonesia baku (kecuali diminta English).
- **Tata Bahasa**: Kalimat lengkap (S-P-O-K), aktif ≥85%, gaya waktu kini, variasi ritme baca (Flesch 60–70).
- **Metode BLUF (Bottom Line Up Front)**: Kalimat pertama setiap section (`##`) langsung menyatakan poin/kesimpulan utama.
- **Paragraf**: 2–4 kalimat per paragraf. Hindari "tembok teks".
- **Pembuka (Hook & Value)**: Jawaban inti topik & kata kunci utama wajib muncul di 100 kata pertama.
- **Tautan**: Minimal 2–3 internal link (`/blog/slug-terkait`) dan 2–3 external link ke sumber otoritatif.
- **Komponen Penutup & FAQ**:
  - Penutup wajib menggunakan `::conclusion ... ::`.
  - FAQ di akhir artikel wajib menggunakan `::faq` + `::faq-item{question="..."}` (atau `::accordion`).
- **Penyajian Output**: SELALU sajikan hasil akhir draf artikel dalam **SATU** fenced code block `~~~~md ... ~~~~` utuh (dari frontmatter YAML hingga FAQ terakhir) agar siap disalin langsung sebagai file `.md`. Komentar ditulis di luar blok kode.

### Skema Frontmatter Baku (`content/id/blog` / `content/en/blog`)

```yaml
---
title: "Judul Artikel Menarik Mengandung Keyword: Proposisi Nilai"
category: teknologi
date: YYYY-MM-DD
description: Meta deskripsi persuasif 140-160 karakter mengandung kata kunci utama dan ajakan membaca yang jelas.
tags:
  - tag1
  - tag2
---
```

---

## 2. Komponen MDC Nuxt Blog

Gunakan komponen yang sesuai dengan semantiknya:

| Kebutuhan | Sintaks MDC | Keterangan |
|---|---|---|
| **Kesimpulan** | `::conclusion ... ::` | Rangkuman outcome & arahan pilihan pembaca |
| **FAQ Accordion** | `::faq` <br> `::faq-item{question="..."} ... ::` <br> `::` | 3–5 pertanyaan esensial di akhir artikel |
| **Catatan / Info** | `::note ... ::` | Informasi konteks tambahan |
| **Tips / Rekomendasi** | `::tip ... ::` | Praktik terbaik / saran efisiensi |
| **Peringatan Ringan** | `::warning ... ::` | Potensi masalah / hal yang perlu diwaspadai |
| **Peringatan Kritis** | `::caution ... ::` | Tindakan destruktif / kesalahan fatal |
| **Langkah Bertahap** | `::steps` <br> `### Judul Tanpa Nomor` <br> `::` | Nomor otomatis dirender, jangan tulis nomor di judul |
| **Tabs Opsi** | `::tabs` <br> `:::tabs-item{label="..."}` <br> `::` | Perbandingan alternatif / tab horizontal |
| **Galeri Gambar** | `::carousel` (YAML items) | Beberapa visual bergantian |
| **CTA Button** | `:u-button{to="..." label="..." icon="..."}` | Tombol aksi keluar atau form |
| **Inline Badge** | `:badge[teks]{color="primary"}` | Status, versi, label sorotan singkat |

---

## 3. Aturan Penerjemahan (ID ↔ EN)

Ketika menerjemahkan antar file `content/id/blog` dan `content/en/blog`:
1. **Jaga 100% Utuh (DILARANG diubah/diterjemahkan)**:
   - Seluruh fenced code block (` ``` `) dan inline code (`` `kode` ``).
   - Nama komponen MDC (`::conclusion`, `::faq`, `::steps`, dll) dan nama properti (`question="..."`, `label="..."`).
   - Frontmatter keys (`title:`, `category:`, `date:`, `description:`, `tags:`).
   - Path URL / internal linking (misal `/article/font3.webp` atau `/blog/sejarah-font`).
2. **Bagian yang Diterjemahkan**:
   - Judul (`title`), deskripsi (`description`), nilai tag jika relevan, heading teks, paragraf, narasi callout, dan pertanyaan/jawaban FAQ.
3. Pertahankan struktur heading (#, ##, ###) dan letak komponen sama persis 1-ke-1.

---

## 4. Sistem Visual & Palet Brand (#14b898)

Setiap ilustrasi / featured image artikel wajib mengikuti identitas visual berikut:
- **Gaya**: Flat vector illustration, clean lines, minimalist cartoon, modern.
- **Rasio**: 16:9 Landscape (default untuk featured banner web).
- **Larangan Mutlak**: TIDAK ADA teks/tulisan di gambar, tidak ada watermark, tidak ada gaya 3D realistis / photorealistic.
- **Palet Warna Brand**:

| Role | Hex | Deskripsi |
|---|---|---|
| **Latar Belakang** | `#f0fdfa` (50), `#ccfbf2` (100) | Mint pucat / off-white kehijauan |
| **Aksen Cerah** | `#99f6e4` (200), `#5eeacf` (300), `#2bd4b5` (400) | Teal muda cerah |
| **Warna Utama (Brand Focus)** | `#14b898` (500) | Teal / emerald cerah identitas brand |
| **Aksen Gelap (Depth/Shadow)** | `#0d947a` (600), `#0f7662` (700), `#115e4f` (800) | Teal gelap kehijauan |
| **Line Art (Outline)** | `#134e43` (900) | Hijau tua pekat |
| **Kontras Gelap** | `#042f27` (950) | Deep forest green (aksen minim) |

- **Alt Text Gambar**: Maksimal 125 karakter, deskriptif, mengandung kata kunci utama secara alami.

---

## File Rujukan Detail (Load Sesuai Kebutuhan)

- 📖 [references/article-generator-seo.md](references/article-generator-seo.md): Integrasi Google Trends, Ceklis 9 Tahap SEO, tabel kata tabu, panduan BLUF, dan format draf utuh.
- 🎨 [references/image-generator.md](references/image-generator.md): Template prompt gambar, komposisi visual, dan penamaan aset webp.
- 🌐 [references/translator.md](references/translator.md): Alur kerja penerjemahan presisi teknis ID-EN.
