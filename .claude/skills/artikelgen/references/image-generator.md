# Panduan Generator Gambar & Visual Blog (2D Flat Vector Brand Style)

Panduan teknis perancangan ilustrasi visual pendukung artikel blog yang konsisten dengan gaya **100% 2D Modern Flat Vector Illustration & Minimalist Cartoon** menggunakan sistem warna resmi brand teal/emerald (**#14b898**).

---

## 1. Gaya Visual Baku (100% 2D Flat Vector Guidelines)

- **Gaya Desain**: 2D Modern Flat Vector Illustration, Clean Sharp Line Art, Minimalist Cartoon.
- **Karakteristik Visual**:
  - **Pewarnaan Datar (Flat Color Fills)**: Warna solid dengan bayangan 2D minimalis, tanpa gradien volumetrik 3D.
  - **Garis Kontur Tegas (Sharp Outline)**: Garis line art rapi dan konsisten berwarna hijau tua pekat (`#134e43`).
  - **Fokus Komposisi**: 1–2 metafora visual utama per gambar, tersusun lapang dan rapi (*uncluttered*).
- **Rasio Aspek**: **16:9 Landscape** (proporsi standar untuk *featured banner* artikel blog).
- **Larangan Mutlak (Strict Prohibitions)**:
  - ❌ **DILARANG gaya 3D render, claymorphism, atau efek timbul 3D apa pun**.
  - ❌ **TIDAK ADA teks, huruf, angka, atau kata apa pun di dalam gambar**.
  - ❌ TIDAK ADA watermark, logo pihak ketiga, atau karakter berhak cipta.
  - ❌ BUKAN gaya fotorealistik atau foto orang nyata.

---

## 2. Sistem Warna Resmi Brand (Wajib Diterapkan)

Setiap ilustrasi 2D wajib didominasi oleh palet warna brand berikut:

| Role Warna | Kode Hex | Shade | Karakteristik / Penerapan |
|---|---|---|---|
| **Latar Belakang (Canvas Solid)** | `#f0fdfa` | 50 | Putih kehijauan / mint sangat pucat (latar flat default) |
| **Latar Belakang (Alt)** | `#ccfbf2` | 100 | Mint muda datar untuk kontras latar |
| **Aksen Cerah** | `#99f6e4` | 200 | Teal muda cerah untuk highlight 2D |
| **Aksen Menengah** | `#2bd4b5` | 400 | Emerald muda |
| **Warna Utama (Brand Core)** | **`#14b898`** | 500 | **Warna fokus utama pada objek / karakter** |
| **Aksen Gelap (Bayangan Flat 2D)** | `#0d947a` | 600 | Teal gelap kehijauan untuk bayangan flat |
| **Garis Outline (Line Art Utama)** | `#134e43` | 900 | Hijau tua pekat (garis kontur kartun/vektor) |
| **Kontras Tergelap (Aksen Minor)** | `#042f27` | 950 | Deep forest green (detail kecil) |

---

## 3. Template Pembuatan Prompt Gambar AI (2D Flat Vector)

Gunakan formula prompt baku ini saat menginstruksikan generator AI (Imagen, DALL-E, dsb.):

```text
"A modern 2D flat vector illustration of [DESKRIPSI OBJEK/TOPIK], minimalist cartoon style with clean sharp outlines in dark forest green #134e43 and smooth solid flat color fills. Color palette strictly dominated by teal and emerald tones: clean flat background in pale mint #f0fdfa, primary subject highlighted with vibrant teal #14b898, accented with bright mint highlights #99f6e4 and dark teal flat shadows #0d947a. Simple, elegant, uncluttered graphic design composition, 16:9 landscape aspect ratio, no 3D elements, no clay, no gradients, no photorealism, no text, no typography, no letters, no watermark."
```

---

## 4. Standar Penyimpanan Aset Gambar di Proyek
- Format gambar: **WebP** (`.webp`).
- Lokasi penyimpanan: `public/article/<nama-slug-artikel>.webp`.
- Selalu cantumkan **Alt Text deskriptif** (maks. 125 karakter) yang memuat kata kunci utama artikel secara alami.
