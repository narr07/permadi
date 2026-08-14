---
title: "Design Token Generator for Tailwind v4"
description: "CLI & Web Tool otomatis untuk menghasilkan 11-shade color palette dan skala tipografi Golden Ratio ke sintaks Tailwind CSS v4."
date: "2026-07-15"
tags: ["TypeScript", "Tailwind CSS", "CLI", "Color Theory"]
image: "/projects/token-generator.jpg"
aspectRatio: "aspect-thumbnail"
featured: false
demoUrl: "https://tokens.permadi.dev"
githubUrl: "https://github.com/narr07/tailwind-token-generator"
---

# Design Token Generator for Tailwind v4

Alat bantu pengembang dan desainer untuk menghasilkan skema warna OKLCH/HEX 11-shade (50 hingga 950) yang valid sesuai spesifikasi Nuxt UI dan Tailwind CSS v4 `@theme`.

## Fitur Utama

- **11-Shade Color Ramp**: Menghitung interpolasi luminansi secara matematis.
- **Golden Ratio Scale Calculator**: Menghasilkan fungsi CSS `clamp()` untuk ukuran font responsif dari `g0` hingga `g6`.
- **Ekspor Otomatis**: Mendukung format CSS Variables, JSON Schema, dan TypeScript Config.
