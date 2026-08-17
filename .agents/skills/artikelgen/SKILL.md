---
name: artikelgen
description: Generator artikel blog SEO-driven mendalam berbasis Google Trends, penerjemah bilingual ID-EN dengan proteksi sintaks MDC Nuxt Content, dan generator visual ilustrasi flat design dengan palet brand teal/emerald (#14b898). Otomatis menghasilkan 2 file .md siap copas (versi Bahasa Indonesia & Bahasa Inggris) lengkap dengan saran path file dan frontmatter. Kompatibel penuh dengan Gemini Spark dan IDE.
license: MIT
---

# ArtikelGen: Bilingual SEO Content Studio (ID & EN Ready-to-Copy)

Skill khusus untuk alur kerja penerbitan blog di ekosistem Nuxt Content (`content/id/blog` & `content/en/blog`).

---

## 🚨 ATURAN WAJIB OUTPUT (MANDATORY DUAL OUTPUT)

Setiap kali pengguna meminta artikel tentang suatu topik, Anda **WAJIB OTOMATIS MENGHASILKAN 2 FILE `.md` LENGKAP** (Bahasa Indonesia & Bahasa Inggris) dalam satu jawaban, tanpa pengguna perlu memintanya secara terpisah.

Setiap artikel harus disajikan dalam blok kode markdown mandiri bertipe `~~~~md ... ~~~~` yang **siap disalin langsung (*copy-paste ready*)** ke file proyek, diawali dengan rekomendasi nama file dan path:

1. **Bagian 1: Versi Bahasa Indonesia (`content/id/blog/<nomor>.<slug-id>.md`)**
2. **Bagian 2: Versi Bahasa Inggris (`content/en/blog/<nomor>.<slug-en>.md`)**
3. **Bagian 3: Prompt Gambar Ilustrasi Brand (#14b898)** (Rasio 16:9 flat vector)

---

## 1. Alur Riset Google Trends (Pre-Writing)

Sebelum blok artikel ditampilkan, sajikan ringkasan singkat (1–2 baris):
- *Trending Angles*: 2–3 poin fokus penelusuran terkini dari Google Trends.
- *Target Keywords*: Kata kunci utama dan turunan (*rising queries*).

---

## 2. Format & Struktur Setiap File `.md`

Setiap file `.md` (baik ID maupun EN) **WAJIB** memiliki komponen berikut secara urut:

### A. Frontmatter YAML Baku
```yaml
---
title: "Judul Artikel Menarik Mengandung Keyword: Proposisi Nilai"
category: teknologi
date: YYYY-MM-DD
description: Meta deskripsi 140-160 karakter memikat mengandung kata kunci utama dan ajakan membaca.
tags:
  - tag1
  - tag2
---
```

### B. Struktur Isi Konten & MDC Native
1. **Pembuka**: Hook & kata kunci utama wajib muncul di 100 kata pertama.
2. **Gambar Featured**: `![Alt text deskriptif](/article/nama-gambar.webp)`
3. **Isi Artikel**: Subtopik `##` dan `###` dengan metode BLUF (poin utama di awal paragraf), paragraf 2–4 kalimat, minimal 2–3 tautan internal & eksternal.
4. **Komponen MDC Pendukung**:
   - `::steps` (jika ada tutorial bertahap, tanpa nomor di judul `###`).
   - `::tip` atau `::note` untuk informasi/rekomendasi penting.
5. **Kesimpulan (`::conclusion`)**: Rangkuman outcome dan panduan pilihan pembaca.
6. **FAQ Accordion (`::faq`)**: 3–5 butir pertanyaan & jawaban menggunakan `::faq-item{question="..."}`.

---

## 3. Contoh Format Jawaban Baku yang Wajib Diberikan

Contoh format jawaban yang harus selalu disajikan ke pengguna:

````markdown
### 📈 Rekomendasi Tren Google Trends:
- **Top Search Angle**: [Sudut pandang tren penelusuran terkini]
- **Primary & Secondary Keywords**: [Kata kunci utama & turunan]

---

### 🇮🇩 1. File Bahasa Indonesia
📁 **Path & Nama File:** `content/id/blog/7.panduan-nuxt-js-pemula.md`

~~~~md
---
title: "Judul Artikel Bahasa Indonesia"
category: teknologi
date: YYYY-MM-DD
description: Deskripsi SEO 140-160 karakter.
tags:
  - nuxt
  - vue
---

## Kalimat Pembuka Langsung Menjawab Inti Topik

Paragraf pembuka mengandung kata kunci utama dalam 100 kata pertama...

![Deskripsi gambar alt text](/article/nama-file.webp)

## Poin Pembahasan Utama

Penjelasan mendalam dengan metode BLUF...

::steps
### Persiapan Lingkungan
Penjelasan langkah tanpa nomor di judul...
::

::tip
Tips praktis untuk optimasi performa...
::

::conclusion
Kesimpulan hasil nyata dan panduan keputusan pembaca...
::

::faq
::faq-item{question="Pertanyaan pertama yang sering dicari?"}
Jawaban lugas 2-4 kalimat...
::
::
~~~~

---

### 🇬🇧 2. File Bahasa Inggris (English Version)
📁 **Path & Nama File:** `content/en/blog/7.nuxt-js-beginners-guide.md`

~~~~md
---
title: "English Article Title with Primary Keyword"
category: technology
date: YYYY-MM-DD
description: English SEO meta description 140-160 characters.
tags:
  - nuxt
  - vue
---

## Opening Headline Directly Addressing the Core Solution

Opening paragraph embedding the target keyword within the first 100 words...

![Descriptive image alt text](/article/nama-file.webp)

## Core Technical Exploration

In-depth explanation with BLUF methodology...

::steps
### Environment Setup
Step explanation without hardcoded numbers in heading...
::

::tip
Practical optimization tips...
::

::conclusion
Outcome-driven conclusion and decision guide...
::

::faq
::faq-item{question="Most searched question in English?"}
Concise 2-4 sentence answer...
::
::
~~~~

---

### 🎨 3. Prompt Gambar Ilustrasi Brand (#14b898)
> "A modern flat vector illustration of [DESKRIPSI OBJEK], minimalist cartoon style with clean sharp outlines in dark forest green #134e43 and smooth flat color fills. Color palette strictly dominated by teal and emerald green accents: background in pale mint #f0fdfa, primary subject highlighted with vivid teal #14b898 and dark emerald accents #0d947a, balanced bright highlights #99f6e4. Simple and elegant composition, uncluttered, professional graphic design, 16:9 aspect ratio, no text, no letters, no words, no watermark, no 3D elements, no realistic photo details."
````
