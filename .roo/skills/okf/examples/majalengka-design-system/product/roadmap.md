---
type: Product Requirement
title: Roadmap lima fase
description: Urutan pengerjaan dari audit fondasi sampai rilis v1.0 dan perluasan, lengkap dengan syarat selesai tiap fase.
tags: [prd, roadmap, planning]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
stale_after: 2027-03-17
---

# Roadmap

## Fase 0 — Fondasi (2 minggu)

Audit 10 situs instansi di Majalengka untuk mendata pola dan masalah nyata. Siapkan monorepo, CI, dan situs dokumentasi kosong. Finalkan token [warna](/foundations/color.md), [tipografi](/foundations/typography.md), dan [spasi](/foundations/spacing-shape.md). Bikin Figma library dasar.

**Selesai kalau:** `pnpm build` menghasilkan CSS variables dan preset Tailwind/UnoCSS dari satu sumber JSON.

## Fase 1 — Komponen dasar & formulir (6 minggu)

Gelombang 1 bagian dasar, formulir, dan tata letak. Pipeline uji aksesibilitas otomatis jalan sejak komponen pertama. Dokumentasi ditulis berbarengan.

**Selesai kalau:** satu halaman formulir layanan lengkap bisa dibangun hanya dengan komponen sistem dan meraih skor a11y Lighthouse 100.

## Fase 2 — Navigasi, data, template (6 minggu)

Header, menu, tabel responsif, kartu, paginasi. Tiga template halaman jadi. Modul Nuxt dirilis. Ikon lokal digambar.

**Selesai kalau:** satu situs dinas percontohan bisa dibangun utuh dalam waktu di bawah satu minggu kerja.

## Fase 3 — Rilis v1.0 (4 minggu)

Uji dengan pengguna nyata, perbaikan hasil temuan, pernyataan aksesibilitas, panduan adopsi, lokakarya komunitas, publikasi ke npm.

**Selesai kalau:** ada minimal satu instansi yang memakainya di produksi.

## Fase 4 — Perluasan (berjalan)

Paket React, komponen gelombang 3, tema per instansi, CLI `create-majalengka-app`, dan program adopsi bareng Diskominfo.
