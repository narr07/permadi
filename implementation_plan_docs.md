# Update Dokumentasi nuxt-tina

Update dokumentasi website dan README mengikuti Nuxt module best practices, writing-web-documentation skill, document-writer skill, dan antislop filter.

## Scope Perubahan

### README.md (root)

Jawab 3 pertanyaan Nuxt module best practices:
- ❓ **Why** — Kenapa pakai nuxt-tina? (konteks masalah yang diselesaikan, bukan list fitur)
- 🔧 **How** — Install + konfigurasi minimal, langsung dapat hasil
- ⚙️ **What** — Apa yang disediakan module (composable, component, server routes)

Tambah: link ke playground StackBlitz, badge TypeScript, perbarui nama export prefix.

---

### docs/content/1.getting-started/1.introduction.md

**Masalah sekarang:** Terlalu banyak teori di halaman orientasi. Reader belum tahu apakah ini untuk mereka.

Fix:
- Tambah paragraf pembuka yang langsung jawab "ini untuk siapa"
- Perjelas "Mengapa nuxt-tina" dengan framing masalah nyata (bukan Nuxt belum ada official Tina support)
- Persingkat — ini orientasi, bukan explanation page

---

### docs/content/1.getting-started/2.installation.md

**Masalah sekarang:** Baik, tapi belum ada success state — reader tidak tahu kapan instalasi berhasil.

Fix:
- Tambah step "Verifikasi" dengan output yang diharapkan
- Tambah catatan Cloudinary (peer dep opsional) karena sudah ada fitur itu
- Tambah next steps di akhir

---

### docs/content/2.guide/6.media.md

Tambah dokumentasi env vars Cloudinary yang harus tiga format (temuan dari sesi debugging hari ini) — ini knowledge baru yang belum ada di docs.

---

## File yang Diubah

### [MODIFY] README.md
### [MODIFY] docs/content/1.getting-started/1.introduction.md
### [MODIFY] docs/content/1.getting-started/2.installation.md
### [MODIFY] docs/content/2.guide/6.media.md

## Aturan Penulisan yang Diterapkan

- **Antislop:** Tidak ada em dash, tidak ada buzzword ("powerful", "seamless", "revolutionary")
- **Document-writer:** Active voice, present tense, 2-4 kalimat per paragraf, code block berlabel
- **Writing-web-documentation:** Page type jelas, prerequisites eksplisit, ada success state, no theory dump di task pages
- **Nuxt best practices:** "TinaCMS for Nuxt" (bukan "for Nuxt 4"), export prefix `useTina`/`TinaProvider`/`/api/_tina/`

## Verification Plan

Screenshot docs dev server setelah update untuk konfirmasi render.
