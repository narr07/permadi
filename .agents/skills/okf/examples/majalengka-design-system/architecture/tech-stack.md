---
type: Architecture Decision
title: Pilihan teknologi
description: Delapan keputusan teknis inti beserta alasan pemilihannya.
tags: [architecture, stack, tooling]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Pilihan teknologi

| Bagian | Pilihan | Alasan |
|--------|---------|--------|
| Pipeline token | Style Dictionary v4 | Matang, banyak target output, sinkron dengan Tokens Studio |
| Framework referensi | Vue 3 + TypeScript | Sesuai keahlian tim inti, Nuxt banyak dipakai di ekosistem lokal |
| Perilaku komponen | Reka UI (Radix Vue) | Pola ARIA-nya sudah diuji orang banyak, kita tidak perlu menemukan ulang fokus trap |
| Styling | UnoCSS + CSS variables | Ringan, atomic, tetap bisa dipakai tanpa build lewat paket `css/` |
| Dokumentasi | Nuxt Content + Histoire | Satu situs untuk panduan naratif dan contoh interaktif |
| Uji | Vitest, Playwright, axe-core | Unit, interaksi, dan aksesibilitas otomatis dalam satu alur |
| Rilis | Changesets + semver | Catatan perubahan jalan sendiri, versi jelas |
| Distribusi | npm `@majalengka/*` + CDN jsDelivr | CDN penting untuk instansi yang tidak punya proses build |

## Keputusan yang paling menentukan

Distribusi lewat CDN dan paket CSS murni adalah **jalur utama, bukan pelengkap**. Ini jawaban langsung untuk risiko "vendor menolak karena stack-nya beda" di [daftar risiko](/product/risks.md), dan untuk syarat keberhasilan di [pernyataan masalah](/product/problem.md): sistem harus lebih gampang dipakai daripada bikin sendiri.
