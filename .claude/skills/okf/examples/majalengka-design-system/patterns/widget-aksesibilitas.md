---
type: UX Pattern
title: Widget aksesibilitas
description: Panel pengaturan menetap untuk perbesar teks, kontras tinggi, dan mematikan animasi.
tags: [pattern, accessibility, preferences]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Widget aksesibilitas

Panel kecil menetap berisi tiga pengaturan:

- **Perbesar teks** — 100%, 125%, 150%
- **Mode kontras tinggi** — latar putih murni, teks hitam, garis tepi 2px, focus ring 3px
- **Matikan animasi** — menimpa preferensi sistem secara manual

Pilihan disimpan di `localStorage` dan berlaku di seluruh situs.

## Peringatan penting

Widget ini **bukan pengganti** kepatuhan [WCAG AA](/standards/wcag-aa-checklist.md). Banyak situs memasang widget semacam ini lalu merasa urusan aksesibilitas selesai — padahal halaman dasarnya masih tidak bisa dipakai lewat keyboard. Widget adalah pelengkap untuk preferensi pribadi, bukan tambalan.

Implementasinya memakai token dari [warna](/foundations/color.md) dan [gerak](/foundations/motion-elevation.md), sehingga mode kontras tinggi cukup mengganti nilai semantik tanpa menyentuh kode komponen.
