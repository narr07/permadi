---
type: Standard
title: Definition of done komponen
description: Sembilan syarat yang harus dipenuhi sebelum sebuah komponen boleh dirilis.
tags: [process, quality, checklist]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Definition of done

Satu komponen dianggap selesai kalau sembilan hal ini terpenuhi. Tidak ada rilis parsial — aturan ini yang menjaga prinsip [aksesibel untuk semua](/principles/aksesibel.md) tidak dikorbankan saat dikejar tenggat.

1. Kode Vue-nya jalan, punya tipe TypeScript, dan tidak memakai nilai warna atau jarak di luar [token](/foundations/token-architecture.md)
2. Punya padanan CSS murni di paket `css/`
3. Lolos uji axe tanpa pelanggaran serius, dan sudah dicoba pakai keyboard saja
4. Sudah dicoba dengan satu pembaca layar, NVDA atau VoiceOver
5. Punya uji unit untuk perilaku utamanya
6. Punya halaman dokumentasi: anatomi, props, contoh, kapan dipakai, kapan jangan
7. Punya contoh [microcopy](./microcopy.md) berbahasa Indonesia
8. Tampilan benar di mode terang, gelap, dan kontras tinggi
9. Ada komponen padanannya di Figma library dengan nama layer yang sama

## Kerangka halaman dokumentasi komponen

Apa ini dan kapan dipakai · contoh hidup · anatomi berlabel · varian dan state · tabel props · contoh microcopy Indonesia · catatan aksesibilitas (peran ARIA, jalur keyboard, apa yang dibacakan pembaca layar) · do dan don't · token yang dipakai · kode siap salin untuk Vue, Nuxt, dan HTML plus CSS murni.
