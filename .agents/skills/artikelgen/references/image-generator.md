# Panduan Generator Gambar & Visual Blog (Brand Color System)

Panduan teknis perancangan ilustrasi visual pendukung artikel blog yang konsisten dengan gaya **Modern Flat Vector Illustration** dan sistem warna resmi brand berbasis teal/emerald (**#14b898**).

---

## 1. Gaya Visual Baku (Visual Guidelines)

- **Gaya Desain**: Modern Flat Vector Illustration, Clean Line Art, Minimalist Cartoon.
- **Karakter & Objek**: Garis outline tajam dan konsisten (bukan sketsa kasar), proporsi rapi, pewarnaan flat halus tanpa tekstur berlebihan.
- **Fokus Komposisi**: 1 pesan visual utama per gambar, komposisi bersih dan lapang (*uncluttered*).
- **Rasio Aspek**: **16:9 Landscape** (proporsi standar untuk *featured banner* dan ilustrasi artikel).
- **Larangan Mutlak**:
  - ❌ **TIDAK ADA teks, huruf, kata, atau angka apa pun di dalam gambar**.
  - ❌ TIDAK ADA watermark, logo pihak ketiga, atau brand lain berhak cipta.
  - ❌ BUKAN gaya 3D render, fotorealistik, atau tekstur foto nyata.
  - ❌ Tidak menampilkan wajah orang nyata yang dapat diidentifikasi secara spesifik.

---

## 2. Sistem Warna Resmi Brand (Wajib Diterapkan)

Setiap ilustrasi wajib didominasi oleh palet warna brand berikut:

| Role Warna | Kode Hex | Shade | Karakteristik / Penerapan |
|---|---|---|---|
| **Latar Belakang (Light Canvas)** | `#f0fdfa` | 50 | Putih kehijauan / mint sangat pucat (latar solid default) |
| **Latar Belakang (Alt)** | `#ccfbf2` | 100 | Mint muda transisi |
| **Aksen Cerah 1** | `#99f6e4` | 200 | Teal muda cerah |
| **Aksen Cerah 2** | `#5eeacf` | 300 | Teal terang |
| **Aksen Menengah** | `#2bd4b5` | 400 | Emerald muda |
| **Warna Utama (Brand Core)** | `#14b898` | 500 | **Warna fokus objek/karakter utama** |
| **Aksen Gelap (Depth/Shadow)** | `#0d947a` | 600 | Teal gelap kehijauan (bayangan) |
| **Bayangan Menengah** | `#0f7662` | 700 | Deep teal |
| **Bayangan Dalam** | `#115e4f` | 800 | Dark forest teal |
| **Line Art (Outline)** | `#134e43` | 900 | Hijau tua pekat (garis line art, pengganti hitam pekat) |
| **Kontras Tergelap** | `#042f27` | 950 | Deep forest green (aksen kontras minor) |

### Aturan Pemakaian Warna:
1. **Latar Belakang**: Didominasi oleh warna `#f0fdfa` atau `#ccfbf2`. Jika memerlukan scene/ruangan, tetap gunakan palet turunan teal di atas.
2. **Objek & Karakter Utama**: Gunakan `#14b898` sebagai warna dominan dengan aksen bayangan `#0d947a` dan garis outline `#134e43`.
3. **Warna Alami / Tambahan**: Warna di luar palet (seperti warna kulit, api, langit) hanya diperkenankan sebagai elemen fungsional minor dan harus tetap selaras dengan warna utama.

---

## 3. Template Pembuatan Prompt Gambar AI

Saat menghasilkan gambar dengan tool AI (seperti Imagen, DALL-E 3, Midjourney, generate_image, dll.):

### Prompt Baku Ilustrasi Featured Blog:
```text
A modern flat vector illustration of [DESKRIPSI OBJEK & AKSI UTAMA], minimalist cartoon style with clean sharp outlines in dark forest green #134e43 and smooth flat color fills. Color palette strictly dominated by teal and emerald green accents: background in pale mint #f0fdfa, primary subject highlighted with vivid teal #14b898 and dark emerald accents #0d947a, balanced bright highlights #99f6e4. Simple and elegant composition, uncluttered, professional graphic design, 16:9 aspect ratio, no text, no letters, no words, no watermark, no 3D elements, no realistic photo details.
```

---

## 4. Standar Penempatan Aset & Tag Markdown

1. **Format File**: Format WebP (`.webp`) berukuran ringan (< 150 KB) untuk performa web cepat.
2. **Lokasi Penyimpanan**: Disimpan di folder `/public/article/` atau `/public/assets/blog/`.
3. **Alt Text SEO**: Maksimal 125 karakter, deskriptif, dan memuat primary keyword secara alami.

```md
![Ilustrasi flat vector perbandingan format font TTF dan OTF di layar komputer](/article/nama-gambar.webp)
```
