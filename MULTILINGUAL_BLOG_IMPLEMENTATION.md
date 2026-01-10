# Implementasi Blog Multibahasa dengan "Clean URL" di Nuxt Content v3

Dokumen ini menjelaskan logika implementasi untuk sistem blog yang mendukung:

1.  **Clean URLs** (contoh: `/blog/judul-artikel-keren`) meskipun nama file aslinya memiliki prefix angka atau spasi (contoh: `1. Judul Artikel Keren.md`).
2.  **Multibahasa (i18n)** dengan konten yang saling terhubung antar bahasa.
3.  **Cross-Language Linking** yang akurat (ganti bahasa mengarah ke artikel yang sama).

## Masalah

Secara default, Nuxt Content biasanya otomatis menghapus prefix angka (urutan) dari path. Namun, kita ingin memastikan format URL yang benar-benar bersih dan konsisten (mengubah spasi menjadi dash, lowercase) tanpa bergantung sepenuhnya pada perilaku default tersebut.
Kita ingin memegang kendali penuh atas bagaimana `slug` URL dihasilkan dari nama file.

## Solusi

### 1. Struktur Konten

Setiap artikel memiliki `idBlog` yang unik di frontmatter. Ini digunakan untuk menghubungkan artikel bahasa Indonesia dengan bahasa Inggris.

**ID Article (`content/id/blog/1.tulisanku.md`):**

```yaml
---
idBlog: 1
title: Tulisanku
---
```

**EN Article (`content/en/blog/1.my-writing.md`):**

```yaml
---
idBlog: 1
title: My Writing
---
```

### 2. Normalisasi Slug (Clean URL)

Kita membuat logika normalisasi standar untuk mengubah `path` file menjadi `slug` URL yang bersih.

**Logika:** `Path File` -> `Ambil Nama File` -> `Hapus Angka Depan (1.)` -> `Trim` -> `Ganti Spasi dengan Dash` -> `Lowercase`.

Contoh: `1. Judul Keren.md` menjadi `judul-keren`.

### 3. Implementasi di `blogList.vue` (Link Generation)

Saat menampilkan daftar blog, kita tidak menggunakan `path` mentah dari Nuxt Content. Kita memprosesnya terlebih dahulu agar link yang dihasilkan bersih.

```typescript
function getBlogLink(blog: any) {
  const filename = blog.path.split('/').pop()
  // Normalisasi: hapus angka, spasi -> dash
  const slug = filename
    .replace(/^\d+\./, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()

  // Generate link lokal: /blog/judul-keren
  return localePath({ name: 'blog-slug', params: { slug } })
}
```

### 4. Implementasi di `[slug].vue` (Smart Lookup)

Karena URL yang diminta (`/blog/judul-keren`) tidak sama dengan nama file asli (`1. Judul Keren.md`), kita tidak bisa langsung query `.path()`.

**Strategi "Reverse Lookup":**

1. Ambil **semua** artikel dalam koleksi bahasa tersebut.
2. Loop setiap artikel dan terapkan **normalisasi yang sama** pada path-nya.
3. Bandingkan hasil normalisasi dengan `route.params.slug` dari URL.
4. Jika cocok, itulah artikel yang kita cari.

```typescript
// Ambil semua artikel (path & idBlog saja untuk performa)
const allDocs = await queryCollection(collectionName).select('path', 'idBlog').all()

// Cari dokumen yang slug bersih-nya cocok dengan URL
const matchingDoc = allDocs.find((d) => {
  const filename = d.path.split('/').pop() || ''
  const cleanSlug = filename
    .replace(/^\d+\./, '') // Hapus "1."
    .trim()
    .replace(/\s+/g, '-') // Spasi -> "-"
    .toLowerCase()
  return cleanSlug === route.params.slug
})
```

### 5. Penanganan Bahasa (Language Switcher)

Agar tombol ganti bahasa mengarah ke artikel yang benar (bukan kembali ke home), kita menggunakan `idBlog`.

1. Setelah artikel ditemukan (misal: ID), ambil `idBlog`-nya.
2. Cari artikel di koleksi bahasa lain (misal: EN) yang punya `idBlog` sama.
3. Ambil path artikel EN tersebut (`1.my-writing.md`).
4. **Normalisasi** path tersebut menjadi clean slug (`my-writing`).
5. Set parameter i18n agar switcher mengarah ke `/en/blog/my-writing`.

```typescript
// Cari terjemahan berdasarkan idBlog
const translatedDoc = await queryCollection(locCollection)
  .where('idBlog', '=', currentDoc.idBlog)
  .first()

if (translatedDoc) {
  // Normalisasi path terjemahan untuk URL yang benar
  const filename = translatedDoc.path.split('/').pop()
  const cleanSlug = filename.replace(/^\d+\./, '').trim().replace(/\s+/g, '-').toLowerCase()

  // Beritahu i18n slug untuk bahasa ini
  translations[locCode] = { slug: cleanSlug }
}
```
