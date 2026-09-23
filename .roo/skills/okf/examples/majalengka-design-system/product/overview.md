---
type: Product Requirement
title: Ringkasan Design System Majalengka.tech
description: Sasaran, ruang lingkup rilis pertama, dan daftar non-tujuan design system Majalengka.tech.
tags: [prd, scope, design-system]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
sources:
  - id: prd-v01
    resource: https://claude.ai/artifact/P7ei31dLFNRhe1Ra8AeHHm
    title: PRD Design System Majalengka.tech v0.1
    author: human:dinar
    last_modified: 2026-09-17T00:00:00Z
---

# Ringkasan

Design system open-source untuk aplikasi pemerintahan dan instansi di Majalengka. Isinya empat lapis: [token](/foundations/token-architecture.md), primitives, [pola](/patterns/index.md), dan template halaman.

Sasaran sebenarnya bukan "UI kit cantik". Sasarannya: seorang developer honorer di dinas bisa memasang satu paket, mengikuti dokumentasi, dan halaman layanannya lolos [WCAG 2.1 AA](/standards/wcag-aa-checklist.md) tanpa perlu jadi ahli aksesibilitas dulu.[^prd-v01]

## Nama kerja

Usulan: **Angin**, dari julukan Majalengka sebagai Kota Angin. Paket npm `@majalengka/angin-*`, prefix token `--mjl-`. Alternatif netral: `@majalengka/ui`. Keputusan final belum diambil.

## Ruang lingkup v1.0

- Paket token format W3C DTCG plus hasil build ke CSS variables, preset Tailwind, preset UnoCSS, dan konstanta TypeScript
- 32 komponen inti dalam Vue 3 sebagai implementasi referensi
- Layer CSS murni tanpa framework untuk instansi yang situsnya masih PHP atau HTML biasa
- Situs dokumentasi di `majalengka.tech/docs`
- Tiga template halaman: beranda instansi, halaman layanan, detail berita

## Non-tujuan

Sengaja tidak dikerjakan di v1.0, dan daftar ini dipakai sebagai alat tolak yang sah saat ruang lingkup mulai melar:

- Bukan CMS, bukan framework — kita tidak mengatur cara data diambil
- Bukan pengganti standar nasional yang mengikat
- Paket React ditunda sampai token dan Vue stabil
- Charting kompleks dan peta hanya disediakan wadahnya, lihat `ChartFrame` di [katalog komponen](/components/catalog.md)
- Tidak mengurus hosting, keamanan server, atau SSO instansi

## Yang masih perlu diputuskan

Nama resmi sistem, apakah tema per instansi masuk v1.0, siapa dinas mitra percontohan, pengelolaan Figma library, dan perlu tidaknya Bahasa Sunda di lapisan i18n sejak awal.

[^prd-v01]: PRD Design System Majalengka.tech v0.1
