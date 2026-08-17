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

## 3. Bagian yang Wajib Diterjemahkan

1. **Frontmatter Narasi**:
   - `title`: Terjemahkan secara menarik dengan penyesuaian SEO di bahasa target.
   - `description`: Terjemahkan (tetap jaga panjang 140–160 karakter).
   - `tags`: Boleh disesuaikan dengan bahasa target jika relevan (misal `desain` -> `designer`).
2. **Body Konten**:
   - Seluruh teks heading (`#`, `##`, `###`).
   - Seluruh teks paragraf, bullet points, dan kutipan.
   - Teks alt gambar: `![Deskripsi alt text bahasa target](/article/gambar.webp)`.
   - Konten di dalam komponen callout (`::note`, `::tip`, `::conclusion`).
   - Nilai prop teks pada MDC: `::faq-item{question="Pertanyaan terjemahan?"}`.

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
