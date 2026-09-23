# Panduan Penerjemahan Artikel Blog (ID ↔ EN)

Panduan teknis penerjemahan dua arah (Bahasa Indonesia ↔ Bahasa Inggris) untuk konten artikel Nuxt Content dengan proteksi penuh terhadap kode, komponen MDC, frontmatter, dan path tautan.

---

## 1. Prinsip Utama: Integritas Kode & Struktur

Presisi teknis adalah prioritas tertinggi. Penerjemahan konten blog tidak boleh merusak parsing Markdown MDC atau memutus keterkaitan file.

---

## 2. Bagian yang WAJIB Dijaga 100% Utuh (Dilarang Diterjemahkan)

| Elemen | Contoh Asli | Status / Tindakan |
|---|---|---|
| **Fenced Code Block** | ````bash [Terminal] ... ```` | Pertahankan seluruh blok kode dan isinya |
| **Inline Code** | `` `nuxt.config.ts` ``, `` `TrueType` `` | Biarkan apa adanya di dalam backtick |
| **Nama Komponen MDC** | `::conclusion`, `::faq`, `::steps`, `::tip`, `::note` | DILARANG diubah/diterjemahkan |
| **Nama Slot MDC** | `#default`, `#header` | DILARANG diubah |
| **Keys Frontmatter YAML** | `title:`, `category:`, `date:`, `description:`, `tags:` | Key tetap dalam bahasa Inggris baku |
| **Value Slug & Path** | `date: 2026-03-06`, `category: art` | Value non-teks tetap sama persis |
| **URL & Path Gambar** | `](/article/font3.webp)`, `](/blog/sejarah-font)` | Path file dan URL dilarang diubah |
| **Nama Brand / Library** | `Nuxt`, `Apple`, `Adobe`, `PostScript` | Pertahankan nama baku |

---

## 3. Bagian yang Wajib Diterjemahkan & Standar Kualitas

1. **Frontmatter Narasi**:
   - `title`: Terjemahkan secara menarik, mengalir alami tanpa tanda titik dua (`:`), dan ringkas (**maksimal 50–58 karakter**, sehingga total dengan suffix ` | Permadi` **tidak melebihi 70 karakter dengan spasi**).
   - `description`: Terjemahkan (tetap jaga panjang **140–160 karakter** memuat primary keyword).
   - `tags`: Terjemahkan ke padanan bahasa target yang relevan (misal `metode-belajar` -> `learning-methods`).
2. **Body Konten & Integritas TF-IDF**:
   - Seluruh teks heading (`#`, `##`, `###`) tanpa emoji dekoratif.
   - **Distribusi TF-IDF**: Seluruh kata kunci yang ada di `tags` versi terjemahan **WAJIB muncul minimal 1–3 kali** di dalam teks body bahasa target.
   - Teks alt gambar: `![Deskripsi alt text bahasa target memuat keyword](/article/gambar.webp)`.
   - Konten di dalam komponen callout (`::note`, `::tip`, `::warning`, `::conclusion`).
   - Nilai prop teks pada MDC: `::faq-item{question="Pertanyaan terjemahan?"}`.
3. **Higienitas Anti-Slop Target**:
   - Dilarang menggunakan em dash (`—`) dalam draf terjemahan.
   - Dilarang menggunakan frasa klise AI bahasa target (*delve, revolutionize, tapestry, fast-paced world, game-changer*).
   - Gunakan kalimat aktif lugas dan suara praktisi berpengalaman.

---

## 4. Alur Kerja Penerjemahan

1. **Deteksi Bahasa Sumber**:
   - Sumber `content/id/blog/*.md` → Terjemahkan ke Bahasa Inggris untuk `content/en/blog/*.md`.
   - Sumber `content/en/blog/*.md` → Terjemahkan ke Bahasa Indonesia untuk `content/id/blog/*.md`.
2. **Koreksi & Integritas Teks**:
   - Jika teks sumber memiliki inkonsistensi tanda baca atau ejaan, perbaiki secara natural dalam terjemahan.
   - Jika terdapat istilah yang ambigu secara teknis, tanyakan klarifikasi singkat sebelum memproses.
3. **Penyajian Output**:
   - Sajikan hasil terjemahan dalam SATU blok kode Markdown utuh (````md ... ````).
   - Pastikan hierarki heading (#, ##, ###) dan letak komponen MDC sama persis 1-ke-1 dengan file sumber.
