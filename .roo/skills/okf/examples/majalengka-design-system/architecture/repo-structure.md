---
type: Architecture Decision
title: Struktur repositori
description: Susunan monorepo pnpm — paket token, css, vue, nuxt, icons, plus aplikasi dokumentasi dan template.
tags: [architecture, monorepo, repo]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Struktur repositori

# Schema

    majalengka-tech/ui   (monorepo, pnpm workspace)
    ├── packages/
    │   ├── tokens/      sumber JSON + pipeline Style Dictionary
    │   ├── css/         layer CSS murni, tanpa ketergantungan
    │   ├── vue/         komponen Vue 3 (implementasi referensi)
    │   ├── nuxt/        modul Nuxt: auto-import + preset UnoCSS
    │   ├── icons/       ikon Lucide + ikon lokal
    │   └── react/       menyusul setelah v1.0
    ├── apps/
    │   ├── docs/        majalengka.tech (Nuxt + Nuxt Content)
    │   └── playground/  lahan uji coba
    ├── templates/       3 template halaman siap pakai
    └── .github/         CI, template isu, panduan kontribusi

Paket `css/` tidak boleh punya ketergantungan pada paket lain selain `tokens/`. Ini disengaja: instansi yang situsnya masih PHP atau HTML biasa harus bisa memakai satu berkas CSS tanpa proses build apa pun — lihat [pilihan teknologi](./tech-stack.md).

Urutan pengerjaan paket mengikuti [roadmap](/product/roadmap.md).
