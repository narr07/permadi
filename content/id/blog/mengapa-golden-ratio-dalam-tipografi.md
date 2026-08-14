---
title: "Mengapa Menggunakan Golden Ratio (φ ≈ 1.618) dalam Skala Tipografi Web?"
description: "Eksplorasi estetika matematika rasio emas untuk menciptakan hirarki visual teks yang harmonis dan proporsional."
date: "2026-07-28"
tags: ["Typography", "Design Theory", "CSS", "Math"]
cover: "/blog/golden-ratio-type.jpg"
aspectRatio: "aspect-article"
readTime: "5 min read"
featured: false
---

# Mengapa Menggunakan Golden Ratio ($\phi \approx 1.618$) dalam Skala Tipografi Web?

Skala modular dalam desain grafis dan tipografi telah digunakan selama berabad-abad oleh para arsitek dan seniman Renaissance. Di web modern, skala tipografi berbasis **Golden Ratio ($\phi \approx 1.618$)** memberikan lompatan ukuran font yang dramatis namun tetap terasa natural di mata manusia.

## Skala Golden Ratio (`g0` - `g6`)

Dalam design system permadi.dev, skala tipografi dipetakan sebagai berikut:

- `text-g0` (~0.5 - 0.62rem): Meta data, badge kecil, tag kategori.
- `text-g1` (~0.8 - 1.0rem): Body text default & deskripsi.
- `text-g2` (~1.2 - 1.62rem): Judul kartu bento sedang (1×2, 2×1).
- `text-g3` (~1.8 - 2.62rem): Judul kartu besar (2×2).
- `text-g4` (~2.62 - 4.24rem): Headline utama / Hero card.
- `text-g5` - `text-g6` (~4.24 - 11rem): Judul impresif untuk display atau halaman khusus.

Dengan memanfaatkan CSS `clamp()`, ukuran teks membesar dan mengecil secara adaptif mengikuti lebar viewport layar pengguna.
