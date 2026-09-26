# Panduan Generator Gambar & Visual Blog: Swiss Design & Golden Ratio (#14b898)

Panduan teknis perancangan ilustrasi visual artikel blog dengan prinsip **Swiss Design (International Typographic Style)**, komposisi matematis **Golden Ratio (Rasio Emas 1 : 1.618)**, dan konsistensi mutlak terhadap palet warna brand teal/emerald (**#14b898**).

---

## 1. Filosofi dan Karakter Visual (Swiss Design Aesthetics)

- **Karakter Utama**: Objektif, rasional, bersih, terstruktur pada grid matematis, dan bebas dari ornamen dekoratif tanpa fungsi (*zero useless ornament*).
- **Karakteristik Visual**:
  - **2D Flat Vector & Solid Planes**: Bidang warna datar murni. Bebas dari gradien acak, efek 3D render, glossy, claymorphism, atau bayangan blur (*drop shadows*) yang mengambang.
  - **Bentuk Geometris Presisi**: Penggunaan bentuk dasar yang terukur (lingkaran, bujur sangkar, persegi panjang modular, busur kurva bersih, dan garis diagonal terarah).
  - **Garis Outline dan Hairline Kontras**: Garis pemisah atau kontur tegas menggunakan hijau tua pekat (`#134e43`) dengan ketebalan yang proporsional dan konsisten.
  - **Ruang Negatif Aktif**: Bidang kosong (*negative space*) berfungsi sebagai elemen struktural yang memberi ruang bernafas dan memandu fokus mata, bukan sekadar ruang sisa.
  - **Metafora Konseptual Tunggal**: Fokus pada 1 ide visual terpadu yang merepresentasikan esensi artikel secara intelek dan tidak klise.

### Larangan Mutlak (Negative Constraints):
- ❌ **DILARANG membuat teks, huruf, angka, atau tipografi apa pun di dalam gambar** (gambar harus 100% murni visual tanpa distorsi teks AI).
- ❌ **DILARANG gaya 3D render, CGI, glossy, atau claymorphism**.
- ❌ **DILARANG gaya fotorealistik atau foto manusia asli**.
- ❌ **DILARANG ornamen pemanis acak** (bintang-bintang kecil, sparkle, coretan doodle bebas, atau partikel mengambang).
- ❌ **DILARANG watermark, tanda tangan, frame luar, atau logo pihak ketiga**.

---

## 2. Formula Komposisi Golden Ratio (Rasio Emas 1 : 1.618)

Setiap tata letak visual harus menerapkan kaidah matematika Rasio Emas (phi ≈ 1.618) pada kanvas landscape 16:9:

1. **Pembagian Bidang 61.8% vs 38.2% (The Golden Cut)**:
   - Bagi kanvas 16:9 secara asimetris: 61.8% lebar kanvas dialokasikan untuk zona fokus objek geometris utama, dan 38.2% dialokasikan untuk zona ruang negatif lapang atau elemen pendukung skala kecil.
2. **Penempatan Titik Fokus (Golden Mean Intersection / Spiral Focus)**:
   - Elemen terpenting diletakkan tepat pada perpotongan garis Golden Section (sekitar sepertiga bidang dari sisi kiri atau kanan), bukan tepat di tengah kanvas (hindari komposisi tengah yang statis).
3. **Hierarki Skala Fibonacci (Proportional Scaling)**:
   - Skala ukuran bentuk geometris mengikuti deret proporsional:
     - **Bentuk Utama (Hero)**: Bobot visual terbesar (~61.8% skala visual).
     - **Bentuk Sekunder (Anchor)**: Sekitar 38.2% ukuran bentuk utama.
     - **Bentuk Penyeimbang (Detail)**: Sekitar 23.6% ukuran bentuk utama.
4. **Asimetri Dinamis yang Seimbang (Balanced Asymmetry)**:
   - Komposisi terasa tenang, kokoh, dan berirama melalui perimbangan bobot visual yang presisi antar-elemen.

---

## 3. Sistem Warna Brand Resmi (#14b898)

Gunakan pembagian proporsi warna: 60% kanvas dasar terang, 30% warna identitas teal/emerald, dan 10% aksen kontras garis pekat.

| Peran Warna | Kode Hex | Shade | Deskripsi Penggunaan |
| :--- | :--- | :--- | :--- |
| **Kanvas Utama (Background)** | `#f0fdfa` | 50 | Mint pucat solid atau putih kehijauan lembut sebagai latar belakang datar |
| **Latar Belakang Alternatif** | `#ccfbf2` | 100 | Mint muda datar untuk variasi kontras bidang |
| **Identitas Inti Brand (Core Subject)** | **`#14b898`** | 500 | **Warna fokal utama untuk bentuk geometris paling penting** |
| **Aksen Terang & Highlight** | `#99f6e4` / `#2bd4b5` | 200/400 | Teal muda cerah untuk bidang geometris tingkat dua |
| **Kedalaman Bidang Geometris** | `#0d947a` / `#0f7662` | 600/700 | Emerald gelap untuk bentuk geometris latar atau irisan bidang |
| **Garis Outline & Struktur Grid** | `#134e43` | 900 | Hijau hutan pekat untuk garis kontur presisi dan garis grid arsitektural |
| **Kontras Tertinggi (Detail Minor)** | `#042f27` | 950 | Deep forest green untuk titik fokus minor atau aksen penegas |

---

## 4. Template Pembuatan Prompt Gambar AI (Master Prompt Template)

Gunakan formula prompt bahasa Inggris baku berikut saat menginstruksikan generator AI (Imagen, Midjourney, Flux, DALL-E, atau tool pembuat gambar):

```text
A refined Swiss graphic design editorial illustration representing [METAFORA_TOPIK_ARTIKEL]. Strict 2D flat vector aesthetic, International Typographic Style, hard-edged pure geometric shapes, circular segments, clean intersecting vector planes, and fine structural lines in deep forest green #134e43. Strict Golden Ratio composition (phi 1:1.618 balance), dynamic asymmetric layout with 61.8% primary visual mass and 38.2% spacious breathable negative space. Brand color palette: pale mint flat background #f0fdfa, primary focal elements in vivid teal #14b898, secondary geometric accents in bright cyan-mint #99f6e4 and rich emerald #0d947a, precise deep outlines #134e43. Mathematical harmony, rational, modernist poster aesthetic, Josef Müller-Brockmann inspired layout discipline, 16:9 aspect ratio, clean solid fills, zero gradients, zero shadows, no 3D elements, no realism, 100% text-free, no letters, no words, no watermark.
```

---

## 5. Standar Penyimpanan Aset Gambar di Proyek

- **Rasio Aspek**: **16:9 Landscape** (proporsi standar banner blog dan kartu Open Graph).
- **Format Berkas**: **WebP** (`.webp`) terkompresi efisien.
- **Lokasi Penyimpanan**: `public/article/<nama-slug-artikel>.webp`.
- **Integritas Penamaan**: Versi ID dan EN wajib merujuk ke file asset yang sama (`/article/<slug-artikel>.webp`).
- **Alt Text Aksesibilitas & SEO**: Minimal 10 karakter, maksimal 125 karakter, memuat keyword utama secara deskriptif kontekstual.
